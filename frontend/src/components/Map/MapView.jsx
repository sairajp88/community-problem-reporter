import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, toLonLat } from "ol/proj";
import axios from "axios";
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style";

import { createZoneLayer } from "./ZoneLayer";
import IssuePopup from "../IssuePopup";

/* ---------- STYLES ---------- */

const issueStyle = (severity) =>
  new Style({
    image: new CircleStyle({
      radius: severity === "emergency" ? 10 : 7,
      fill: new Fill({
        color: severity === "emergency" ? "#dc2626" : "#2563eb",
      }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
  });

const pinStyle = new Style({
  image: new CircleStyle({
    radius: 11,
    fill: new Fill({ color: "#16a34a" }),
    stroke: new Stroke({ color: "white", width: 3 }),
  }),
});

/* ---------- COMPONENT ---------- */

const MapView = ({
  issues = [],
  focusedIssue,
  pinMode,
  draftLocation,
  onMapClick,
}) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const issueLayerRef = useRef(null);
  const pinLayerRef = useRef(null);
  const pinModeRef = useRef(pinMode);

  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    pinModeRef.current = pinMode;
  }, [pinMode]);

  /* ---------- INIT MAP ---------- */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const init = async () => {
      const zonesRes = await axios.get("http://localhost:5000/api/zones");
      const zoneLayer = createZoneLayer(zonesRes.data);

      const issueLayer = new VectorLayer({
        source: new VectorSource(),
        zIndex: 10,
      });

      const pinLayer = new VectorLayer({
        source: new VectorSource(),
        style: pinStyle,
        zIndex: 20,
      });

      const map = new Map({
        target: containerRef.current,
        layers: [
          new TileLayer({ source: new OSM() }),
          zoneLayer,
          issueLayer,
          pinLayer,
        ],
        view: new View({
          center: fromLonLat([72.8777, 19.076]),
          zoom: 12,
        }),
      });

      map.on("singleclick", (event) => {
        const [lon, lat] = toLonLat(event.coordinate);

        if (pinModeRef.current) {
          onMapClick?.({ latitude: lat, longitude: lon });
          return;
        }

        map.forEachFeatureAtPixel(event.pixel, (feature) => {
          const issue = feature.get("issue");
          if (issue) setSelectedIssue(issue);
        });
      });

      mapRef.current = map;
      issueLayerRef.current = issueLayer;
      pinLayerRef.current = pinLayer;

      setTimeout(() => map.updateSize(), 0);
    };

    init();
  }, []);

  /* ---------- ISSUE MARKERS ---------- */
  useEffect(() => {
    if (!issueLayerRef.current) return;

    const source = issueLayerRef.current.getSource();
    source.clear();

    issues.forEach((issue) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(issue.location.coordinates)),
      });
      feature.set("issue", issue);
      feature.setStyle(issueStyle(issue.severity));
      source.addFeature(feature);
    });
  }, [issues]);

  /* ---------- DRAFT PIN ---------- */
  useEffect(() => {
    if (!pinLayerRef.current) return;

    const source = pinLayerRef.current.getSource();
    source.clear();

    if (draftLocation) {
      source.addFeature(
        new Feature({
          geometry: new Point(
            fromLonLat([
              draftLocation.longitude,
              draftLocation.latitude,
            ])
          ),
        })
      );
    }
  }, [draftLocation]);

  /* ---------- FOCUS ISSUE ---------- */
  useEffect(() => {
    if (!focusedIssue || !mapRef.current) return;

    mapRef.current.getView().animate({
      center: fromLonLat(focusedIssue.location.coordinates),
      zoom: 17,
      duration: 600,
    });

    setSelectedIssue(focusedIssue);
  }, [focusedIssue]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      <IssuePopup
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />
    </div>
  );
};

export default MapView;
