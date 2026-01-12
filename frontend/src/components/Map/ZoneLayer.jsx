import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke, Text } from "ol/style";

const colors = [
  "rgba(255, 99, 132, 0.4)",
  "rgba(54, 162, 235, 0.4)",
  "rgba(255, 206, 86, 0.4)",
  "rgba(75, 192, 192, 0.4)",
];

export function createZoneLayer(zones) {
  const source = new VectorSource();

  const features = new GeoJSON().readFeatures(
    {
      type: "FeatureCollection",
      features: zones.map((zone) => ({
        type: "Feature",
        geometry: zone.geometry,
        properties: {
          name: zone.name,
          level: zone.level,
        },
      })),
    },
    {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    }
  );

  source.addFeatures(features);

  return new VectorLayer({
    source,
    style: (feature) => {
      const name = feature.get("name") || "";
      const color = colors[name.charCodeAt(0) % colors.length];

      return new Style({
        fill: new Fill({ color }),
        stroke: new Stroke({ color: "#333", width: 2 }),
        text: new Text({
          text: name,
          fill: new Fill({ color: "#000" }),
          stroke: new Stroke({ color: "#fff", width: 2 }),
        }),
      });
    },
  });
}
