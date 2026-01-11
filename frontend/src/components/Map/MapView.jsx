import { useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import ZoneLayer from "./ZoneLayer";
import { Style, Fill, Stroke } from "ol/style";

const hoverStyle = new Style({
  fill: new Fill({ color: "rgba(255, 0, 0, 0.4)" }),
  stroke: new Stroke({ color: "#ff0000", width: 3 }),
});

const MapView = () => {
  useEffect(() => {
    const zoneLayer = ZoneLayer();

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        zoneLayer,
      ],
      view: new View({ center: fromLonLat([72.8777, 19.0760]),
        zoom: 12,
      }),
    });

    let hoveredFeature = null;

    // 🟡 Hover interaction
    map.on("pointermove", (event) => {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feat) => feat
      );

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

    // 🔵 Click interaction
    map.on("singleclick", (event) => {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feat) => feat
      );

      if (feature) {
        const zoneName = feature.get("name");
        console.log("Clicked Zone:", zoneName);
      }
    });

    return () => map.setTarget(null);
  }, []);

  return null;
};

export default MapView;
