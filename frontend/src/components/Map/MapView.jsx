import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import axios from "axios";
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";

import { createZoneLayer } from "./ZoneLayer";
import createIssueLayer from "./IssueLayer";
import IssuePopup from "../IssuePopup";

const hoverStyle = new Style({
  fill: new Fill({ color: "rgba(255,0,0,0.3)" }),
  stroke: new Stroke({ color: "#ff0000", width: 2 }),
});

const draftPinStyle = new Style({
  image: new CircleStyle({
    radius: 10,
    fill: new Fill({ color: "#2563eb" }),
    stroke: new Stroke({ color: "white", width: 2 }),
  }),
});

const MapView = ({
  issues = [],
  focusedIssue,
  pinMode,
  draftPin,
  onMapClick,
}) => {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  const issueLayerRef = useRef(null);
  const draftPinFeatureRef = useRef(null);
  const draftPinLayerRef = useRef(null);

  const [selectedIssue, setSelectedIssue] = useState(null);

  // 🗺 INIT MAP ONCE
  useEffect(() => {
    if (!containerRef.current) return;

    let map;

    const init = async () => {
      const zonesRes = await axios.get("http://localhost:5000/api/zones");
      const zoneLayer = createZoneLayer(zonesRes.data);

      map = new Map({
        target: containerRef.current,
        layers: [
          new TileLayer({ source: new OSM() }),
          zoneLayer,
        ],
        view: new View({
          center: fromLonLat([72.8777, 19.076]),
          zoom: 12,
        }),
      });

      mapRef.current = map;

      // 🔵 CREATE DRAFT PIN LAYER ONCE
      draftPinFeatureRef.current = new Feature();
      draftPinFeatureRef.current.setStyle(draftPinStyle);

      draftPinLayerRef.current = new VectorLayer({
        source: new VectorSource({
          features: [draftPinFeatureRef.current],
        }),
        zIndex: 100,
      });

      map.addLayer(draftPinLayerRef.current);

      setTimeout(() => map.updateSize(), 0);

      // 🖱 CLICK HANDLER
      map.on("singleclick", (event) => {
        const [lon, lat] = toLonLat(event.coordinate);

        if (pinMode) {
          onMapClick?.({ latitude: lat, longitude: lon });
          return; // 🔴 DO NOT FALL THROUGH
        }

        map.forEachFeatureAtPixel(event.pixel, (feature) => {
          const issue = feature.get("issue");
          if (issue) setSelectedIssue(issue);
        });
      });

      // 🟡 ZONE HOVER
      let hovered = null;

      map.on("pointermove", (event) => {
        if (pinMode) return;

        const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);

        if (hovered && hovered !== feature && !hovered.get("issue")) {
          hovered.setStyle(undefined);
          hovered = null;
        }

        if (feature && !feature.get("issue")) {
          hovered = feature;
          feature.setStyle(hoverStyle);
          map.getTargetElement().style.cursor = "pointer";
        } else {
          map.getTargetElement().style.cursor = "";
        }
      });
    };

    init();

    return () => {
      if (map) map.setTarget(null);
    };
  }, []);

  // 📍 ISSUE MARKERS
  useEffect(() => {
    if (!mapRef.current) return;

    if (issueLayerRef.current) {
      mapRef.current.removeLayer(issueLayerRef.current);
    }

    if (!issues.length) return;

    const projected = issues.map((i) => ({
      ...i,
      location: {
        ...i.location,
        coordinates: fromLonLat(i.location.coordinates),
      },
    }));

    const layer = createIssueLayer(projected);
    mapRef.current.addLayer(layer);
    issueLayerRef.current = layer;
  }, [issues]);

  // 📌 UPDATE DRAFT PIN GEOMETRY (THIS IS THE FIX)
  useEffect(() => {
    if (!draftPinFeatureRef.current) return;

    if (!pinMode || !draftPin) {
      draftPinFeatureRef.current.setGeometry(null);
      return;
    }

    draftPinFeatureRef.current.setGeometry(
      new Point(fromLonLat([draftPin.longitude, draftPin.latitude]))
    );
  }, [draftPin, pinMode]);

  // 🎯 FOCUS ISSUE
  useEffect(() => {
    if (!focusedIssue || !mapRef.current) return;

    mapRef.current.getView().animate({
      center: fromLonLat(focusedIssue.location.coordinates),
      zoom: 17,
      duration: 700,
    });

    setSelectedIssue(focusedIssue);
  }, [focusedIssue]);

  // 🎯 CURSOR FEEDBACK
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.getTargetElement().style.cursor =
      pinMode ? "crosshair" : "";
  }, [pinMode]);

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
