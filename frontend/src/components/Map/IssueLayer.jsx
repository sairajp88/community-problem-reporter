import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";

const createIssueLayer = (issues) => {
  const features = issues.map((issue) => {
    const feature = new Feature({
      geometry: new Point(issue.location.coordinates),
      issue,
    });

    const color = issue.severity === "emergency" ? "red" : "blue";

    feature.setStyle(
      new Style({
        image: new CircleStyle({
          radius:6,
          fill: new Fill({ color }),
          stroke: new Stroke({ color: "white", width: 1 }),
        }),
      })
    );

    return feature;
  });

  return new VectorLayer({
    source: new VectorSource({ features }),
  });
};

export default createIssueLayer;
