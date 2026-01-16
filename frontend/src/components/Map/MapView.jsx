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

const hoverStyle = new Style({
  fill: new Fill({ color: "rgba(255, 0, 0, 0.4)" }),
  stroke: new Stroke({ color: "#ff0000", width: 3 }),
});

const MapView = ({ issues }) => {
  const mapRef = useRef(null);
  const issueLayerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

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

        if (hoveredFeature && hoveredFeature !== feature) {
          hoveredFeature.setStyle(undefined);
          hoveredFeature = null;
        }

        if (feature) {
          hoveredFeature = feature;
          feature.setStyle(hoverStyle);
          map.getTargetElement().style.cursor = "pointer";
        } else {
          map.getTargetElement().style.cursor = "";
        }
      });

      map.on("singleclick", (event) => {
        map.forEachFeatureAtPixel(event.pixel, (feature) => {
          const issue = feature.get("issue");
          if (issue) setSelectedIssue(issue);
        });
      });
    });

    return () => {
      if (map) map.setTarget(null);
    };
  }, []);

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
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%" }}
      />

      {selectedIssue && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            background: "white",
            padding: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            zIndex: 10,
          }}
        >
          <strong>{selectedIssue.title}</strong>
          <div>{selectedIssue.severity}</div>
        </div>
      )}
    </div>
  );
};

export default MapView;
