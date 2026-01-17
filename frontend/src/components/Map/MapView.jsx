import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import axios from "axios";
import { Style, Fill, Stroke } from "ol/style";

import { createZoneLayer } from "./ZoneLayer";
import createIssueLayer from "./IssueLayer";
import IssuePopup from "../IssuePopup";

const hoverStyle = new Style({
  fill: new Fill({ color: "rgba(255, 0, 0, 0.3)" }),
  stroke: new Stroke({ color: "#ff0000", width: 2 }),
});

const MapView = ({ issues = [], focusedIssue }) => {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const issueLayerRef = useRef(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

  /* INIT MAP */
  useEffect(() => {
    if (!containerRef.current) return;

    let map;

    const init = async () => {
      const zonesRes = await axios.get(
        "http://localhost:5000/api/zones"
      );

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
      requestAnimationFrame(() => map.updateSize());

      /* CLICK ISSUE */
      map.on("singleclick", (event) => {
        map.forEachFeatureAtPixel(event.pixel, (feature) => {
          const issue = feature.get("issue");
          if (issue) setSelectedIssue(issue);
        });
      });

      /* HOVER ZONES */
      let hovered = null;
      map.on("pointermove", (event) => {
        const f = map.forEachFeatureAtPixel(event.pixel, (x) => x);

        if (hovered && hovered !== f && !hovered.get("issue")) {
          hovered.setStyle(undefined);
          hovered = null;
        }

        if (f && !f.get("issue")) {
          hovered = f;
          f.setStyle(hoverStyle);
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

  /* UPDATE ISSUES */
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

  /* FOCUS ISSUE FROM PANEL */
  useEffect(() => {
    if (!focusedIssue || !mapRef.current) return;

    const center = fromLonLat(
      focusedIssue.location.coordinates
    );

    mapRef.current.getView().animate({
      center,
      zoom: 17,
      duration: 700,
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
