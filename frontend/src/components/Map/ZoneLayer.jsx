import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke, Text } from "ol/style";

const zoneColors = [
  "rgba(255, 99, 132, 0.4)",
  "rgba(54, 162, 235, 0.4)",
  "rgba(255, 206, 86, 0.4)",
  "rgba(75, 192, 192, 0.4)"
];

const ZoneLayer = () => {
  const source = new VectorSource({
    url: "/zones/sample-zones.geojson",
    format: new GeoJSON(),
  });

  const layer = new VectorLayer({
    source,
    style: (feature) => {
      const name = feature.get("name");
      const color =
        zoneColors[name.charCodeAt(0) % zoneColors.length];

      return new Style({
        fill: new Fill({ color }),
        stroke: new Stroke({
          color: "#333",
          width: 2,
        }),
        text: new Text({
          text: name,
          fill: new Fill({ color: "#000" }),
          stroke: new Stroke({ color: "#fff", width: 2 }),
        }),
      });
    },
  });

  return layer;
};

export default ZoneLayer;
