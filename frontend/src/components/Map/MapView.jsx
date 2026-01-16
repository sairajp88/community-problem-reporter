import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import axios from "axios";
import { createZoneLayer } from "./ZoneLayer";
import createIssueLayer from "./IssueLayer";
import { Style, Fill, Stroke } from "ol/style";
import IssuePopup from "../IssuePopup";

const hoverStyle = new Style({
  fill: new Fill({ color: "rgba(255, 0, 0, 0.4)" }),
  stroke: new Stroke({ color: "#ff0000", width: 3 }),
});

const MapView = ({ issues }) => {
  const mapRef = useRef(null);
  const issueLayerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // 🗺️ Initialize map ONCE
  useEffect(() => {
    let map;

    axios.get("http://localhost:5000/api/zones").then((res) => {
      const zoneLayer = createZoneLayer(res.data);

      map = new Map({
        target: mapContainerRef.current,
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

      let hoveredFeature = null;
map.on("pointermove", (event) => {
  const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);

  // Reset previous hovered ZONE only
  if (
    hoveredFeature &&
    hoveredFeature !== feature &&
    !hoveredFeature.get("issue")
  ) {
    hoveredFeature.setStyle(undefined);
    hoveredFeature = null;
  }

  // Apply hover ONLY to zones
  if (feature && !feature.get("issue")) {
    hoveredFeature = feature;
    feature.setStyle(hoverStyle);
    map.getTargetElement().style.cursor = "pointer";
  } else {
    map.getTargetElement().style.cursor = "";
  }
});


      // 🟢 Click interaction (Sprint 5 Step 2)
      map.on("singleclick", (event) => {
        map.forEachFeatureAtPixel(event.pixel, (feature) => {
          const issue = feature.get("issue");
          if (issue) {
            setSelectedIssue(issue);
          }
        });
      });
    });

    return () => {
      if (map) map.setTarget(null);
    };
  }, []);

  // 📍 Update issue layer when issues change
  useEffect(() => {
    if (!mapRef.current) return;

    if (issueLayerRef.current) {
      mapRef.current.removeLayer(issueLayerRef.current);
    }

    const projectedIssues = issues.map((issue) => ({
      ...issue,
      location: {
        ...issue.location,
        coordinates: fromLonLat(issue.location.coordinates),
      },
    }));

    const issueLayer = createIssueLayer(projectedIssues);
    mapRef.current.addLayer(issueLayer);
    issueLayerRef.current = issueLayer;

    // 🎯 Auto-focus if only one issue exists
    if (projectedIssues.length === 1) {
      mapRef.current.getView().animate({
        center: projectedIssues[0].location.coordinates,
        zoom: 17,
        duration: 800,
      });
    }
  }, [issues]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* 🗺️ MAP CONTAINER */}
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%" }}
      />

      {/* 🧾 ISSUE POPUP */}
      <IssuePopup
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />
    </div>
  );
};

export default MapView;
