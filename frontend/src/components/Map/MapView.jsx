import { useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import axios from "axios";
import { createZoneLayer } from "./ZoneLayer";
import { Style, Fill, Stroke } from "ol/style";

const hoverStyle = new Style({
  fill: new Fill({ color: "rgba(255, 0, 0, 0.4)" }),
  stroke: new Stroke({ color: "#ff0000", width: 3 }),
});

const MapView = () => {
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
          center: fromLonLat([72.8777, 19.0760]),
          zoom: 12,
        }),
      });

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
        const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);
        if (feature) {
          console.log("Clicked Zone:", feature.get("name"));
        }
      });
    });

    return () => {
      if (map) map.setTarget(null);
    };
  }, []);

  return null;
};

export default MapView;
