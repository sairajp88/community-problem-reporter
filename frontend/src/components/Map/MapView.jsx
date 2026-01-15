import { useEffect, useRef } from "react";
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

  // Initialize map once
  useEffect(() => {
    let map;

    axios.get("http://localhost:5000/api/zones").then((res) => {
      const zoneLayer = createZoneLayer(res.data);

      map = new Map({
        target: "map",
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
    });

    return () => {
      if (map) map.setTarget(null);
    };
  }, []);

  // Update issue layer when issues change
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old issue layer
    if (issueLayerRef.current) {
      mapRef.current.removeLayer(issueLayerRef.current);
    }

    const issueLayer = createIssueLayer(issues);
    mapRef.current.addLayer(issueLayer);
    issueLayerRef.current = issueLayer;
  }, [issues]);

  return null;
};

export default MapView;
