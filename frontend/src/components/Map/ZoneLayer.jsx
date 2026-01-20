import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke, Text } from "ol/style";

/* ---------- RESIDENT COLOR PALETTE ---------- */
const RESIDENT_COLORS = [
  "#60a5fa", // blue
  "#34d399", // green
  "#fbbf24", // yellow
  "#f87171", // red
  "#a78bfa", // purple
  "#fb7185", // pink
  "#38bdf8", // sky
  "#4ade80", // emerald
];

/* ---------- HASH → COLOR ---------- */
const getColorFromZoneId = (zoneId) => {
  let hash = 0;
  for (let i = 0; i < zoneId.length; i++) {
    hash = zoneId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return RESIDENT_COLORS[
    Math.abs(hash) % RESIDENT_COLORS.length
  ];
};

/* ---------- INTELLIGENCE COLOR ---------- */
const getIntelligenceColor = (stats) => {
  if (!stats) return "#e5e7eb";
  if (stats.emergency > 0) return "#dc2626";
  if (stats.open > 0) return "#f59e0b";
  if (stats.total > 0 && stats.open === 0)
    return "#16a34a";
  return "#e5e7eb";
};

/* ---------- STYLE FACTORY ---------- */
const createZoneStyle = ({ zone, stats, role }) => {
  const baseColor =
    role === "resident"
      ? getColorFromZoneId(zone._id)
      : getIntelligenceColor(stats);

  return new Style({
    fill: new Fill({
      color: baseColor + "55",
    }),
    stroke: new Stroke({
      color: baseColor,
      width: 2,
    }),
    text: new Text({
      text: zone.name,
      font: "bold 13px sans-serif",
      fill: new Fill({ color: "#111827" }),
      stroke: new Stroke({
        color: "#ffffff",
        width: 3,
      }),
      overflow: true,
    }),
  });
};

/* ---------- CREATE ZONE LAYER ---------- */
export const createZoneLayer = (zones, intelligence = []) => {
  const storedUser = localStorage.getItem("user");
  const role = storedUser
    ? JSON.parse(storedUser).role
    : "resident";

  const statsMap = {};
  intelligence.forEach((z) => {
    statsMap[z._id] = z.stats;
  });

  const source = new VectorSource({
    features: new GeoJSON().readFeatures(
      {
        type: "FeatureCollection",
        features: zones.map((zone) => ({
          type: "Feature",
          geometry: zone.geometry,
          properties: {
            zoneId: zone._id,
            zone,
          },
        })),
      },
      { featureProjection: "EPSG:3857" }
    ),
  });

  const layer = new VectorLayer({
    source,
    style: (feature) => {
      const zone = feature.get("zone");
      const stats = statsMap[zone._id];
      return createZoneStyle({ zone, stats, role });
    },
    zIndex: 2,
  });

  return layer;
};
