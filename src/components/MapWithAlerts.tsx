 import { useEffect, useRef, useState } from "react";

// This component loads Leaflet from CDN (no package install) and renders a simple map
// with dummy pest-alert markers + circles indicating affected radius and a popup
// showing estimated percentage affected.

declare global {
  interface Window {
    L: any;
  }
}

const MAP_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const MAP_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

export default function MapWithAlerts({
  center = [-7.9839, 112.6214],
  zoom = 12,
}: {
  center?: [number, number];
  zoom?: number;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<any>(null);
  const instanceRef = useRef<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [hoveredAlert, setHoveredAlert] = useState<any | null>(null);
  const [protectedFarms, setProtectedFarms] = useState<number[]>([]);

  useEffect(() => {
    // when expanded toggles, invalidate map size so tiles render correctly
    if (instanceRef.current) {
      setTimeout(() => {
        try {
          instanceRef.current.invalidateSize();
        } catch (e) {}
      }, 200);
    }
    // load CSS
    if (!document.querySelector(`link[href="${MAP_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = MAP_CSS;
      document.head.appendChild(link);
    }

    // load JS if not present
    if (!window.L) {
      const script = document.createElement("script");
      script.src = MAP_JS;
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      // cleanup map instance
      try {
        if (instanceRef.current) {
          instanceRef.current.remove();
          instanceRef.current = null;
        }
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initMap() {
    if (!mapRef.current) return;
    if (!window.L) return;
    const L = window.L;
    leafletRef.current = L;

    const map = L.map(mapRef.current).setView(center, zoom);
    instanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Dummy pest-alert points around center
    const alerts = [
      {
        id: 1,
        name: "Ladang Budi",
        lat: center[0] + 0.01,
        lng: center[1] + 0.01,
        percent: 12,
        radiusM: 250,
        crop: "Jagung",
        pest: "Ulat",
      },
      {
        id: 2,
        name: "Ladang Sari",
        lat: center[0] - 0.008,
        lng: center[1] + 0.012,
        percent: 45,
        radiusM: 420,
        crop: "Padi",
        pest: "Wereng",
      },
      {
        id: 3,
        name: "Ladang Wawan",
        lat: center[0] + 0.015,
        lng: center[1] - 0.01,
        percent: 78,
        radiusM: 800,
        crop: "Kedelai",
        pest: "Thrips",
      },
    ];

    // Simulated user's farm location (in a real app, pass this as a prop)
    const userFarm = {
      id: 999,
      name: "Lahan Anda",
      lat: center[0] + 0.005,
      lng: center[1] + 0.002,
    };

    // draw a marker for user's farm
    const farmMarker = L.circleMarker([userFarm.lat, userFarm.lng], {
      radius: 6,
      fillColor: "#2563eb",
      color: "#ffffff",
      weight: 1,
      fillOpacity: 1,
    })
      .addTo(map)
      .bindTooltip("Lahan Anda");

    // keep references so we can update styles on hover
    const refs: any[] = [];

    alerts.forEach((a: any) => {
      const marker = L.circleMarker([a.lat, a.lng], {
        radius: 8,
        fillColor:
          a.percent >= 75 ? "#ff4e4e" : a.percent >= 40 ? "#ffb84e" : "#31B57F",
        color: "#ffffff",
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
      }).addTo(map);

      const circle = L.circle([a.lat, a.lng], {
        radius: a.radiusM,
        color:
          a.percent >= 75
            ? "#ff4e4e66"
            : a.percent >= 40
            ? "#ffb84e66"
            : "#31B57F66",
        fillColor:
          a.percent >= 75
            ? "#ff4e4e33"
            : a.percent >= 40
            ? "#ffb84e33"
            : "#31B57F33",
        weight: 1,
        fillOpacity: 0.12,
      }).addTo(map);

      marker.bindPopup(
        `<strong>${a.name}</strong><br/>Tanaman: ${a.crop}<br/>Perkiraan tertular: ${a.percent}%<br/>Hama: ${a.pest}<br/>Radius: ${a.radiusM} m`
      );

      // hover interactions
      marker.on("mouseover", () => {
        setHoveredAlert(a);
        circle.setStyle({ weight: 2, fillOpacity: 0.25 });
        marker.setStyle({ radius: 10 });
        marker.openPopup();
      });
      marker.on("mouseout", () => {
        setHoveredAlert(null);
        circle.setStyle({ weight: 1, fillOpacity: 0.12 });
        marker.setStyle({ radius: 8 });
        marker.closePopup();
      });

      // if user farm is inside circle, add a quick flag
      const distanceToFarm = map.distance(
        [a.lat, a.lng],
        [userFarm.lat, userFarm.lng]
      );
      const farmInside = distanceToFarm <= a.radiusM;

      refs.push({ alert: a, marker, circle, farmInside });
    });

    // store refs on instance for external access
    (map as any)._alertRefs = refs;

    // fit bounds to alerts with some padding
    const alertGroup = L.featureGroup(
      alerts.map((a: any) => L.circle([a.lat, a.lng], { radius: 1 }))
    );
    map.fitBounds(alertGroup.getBounds().pad(0.4));

    // attach farm marker reference so we can update it later
    (map as any)._farmMarker = farmMarker;
  }

  return (
    <div
      className={`${
        expanded ? "fixed inset-0 z-50 bg-white" : "h-48"
      } rounded-lg border bg-muted overflow-hidden`}
    >
      <div className="relative h-full">
        <div ref={mapRef} className="w-full h-full" />

        {/* Expand / Back controls */}
        <div className="absolute top-2 right-2 flex gap-2">
          {expanded ? (
            <button
              className="px-3 py-1 rounded-md bg-white shadow"
              onClick={() => setExpanded(false)}
            >
              Kembali
            </button>
          ) : (
            <button
              className="px-3 py-1 rounded-md bg-white shadow"
              onClick={() => setExpanded(true)}
            >
              Layar Penuh
            </button>
          )}
        </div>

        {/* Hovered alert info */}
        {hoveredAlert && (
          <div className="absolute left-2 bottom-2 bg-white p-3 rounded-lg shadow max-w-xs">
            <div className="font-semibold">{hoveredAlert.name}</div>
            <div className="text-sm text-muted-foreground">
              Tanaman: {hoveredAlert.crop}
            </div>
            <div className="text-sm">Hama: {hoveredAlert.pest}</div>
            <div className="text-sm">
              Perkiraan tertular: {hoveredAlert.percent}%
            </div>
            <div className="text-sm">Radius: {hoveredAlert.radiusM} m</div>
          </div>
        )}

        {/* Protect farm CTA when inside any alert */}
        <div className="absolute right-2 bottom-2">
          {/* find if user's farm is inside any alert cluster */}
          {instanceRef.current &&
            (instanceRef.current as any)._alertRefs &&
            (instanceRef.current as any)._alertRefs.some(
              (r: any) => r.farmInside
            ) && (
              <button
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#31B57F] to-[#27A06F] text-white shadow"
                onClick={() => {
                  // mark farm protected (mock)
                  setProtectedFarms((p) => [...p, 999]);
                  try {
                    const farmMarker = (instanceRef.current as any)._farmMarker;
                    if (farmMarker)
                      farmMarker.setStyle({ fillColor: "#9CA3AF" });
                  } catch (e) {}
                }}
              >
                Lindungi Lahan Kita
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
