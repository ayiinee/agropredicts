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
        reporter: "Budi Santoso",
        infectionChance: 35,
        severity: 25,
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
        reporter: "Sari Wijaya",
        infectionChance: 68,
        severity: 55,
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
        reporter: "Wawan Kurniawan",
        infectionChance: 85,
        severity: 78,
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
      // Create three concentric circles for each alert - all red with different opacity
      // Outer circle - lightest red (smaller size)
      const outerCircle = L.circle([a.lat, a.lng], {
        radius: a.radiusM * 1.2,
        color: "#ff4e4e",
        fillColor: "#ff4e4e",
        weight: 1,
        fillOpacity: 0.1,
      }).addTo(map);

      // Middle circle - medium red (smaller size)
      const middleCircle = L.circle([a.lat, a.lng], {
        radius: a.radiusM * 0.7,
        color: "#ff4e4e",
        fillColor: "#ff4e4e",
        weight: 1,
        fillOpacity: 0.25,
      }).addTo(map);

      // Inner circle - darkest red (smaller size)
      const innerCircle = L.circle([a.lat, a.lng], {
        radius: a.radiusM * 0.3,
        color: "#ff4e4e",
        fillColor: "#ff4e4e",
        weight: 1,
        fillOpacity: 0.4,
      }).addTo(map);

      // Create marker on top of circles
      const marker = L.circleMarker([a.lat, a.lng], {
        radius: 8,
        fillColor:
          a.percent >= 75 ? "#ff4e4e" : a.percent >= 40 ? "#ffb84e" : "#31B57F",
        color: "#ffffff",
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
      }).addTo(map);

      const tooltipContent = `<div style="min-width: 180px; font-family: system-ui, -apple-system, sans-serif; line-height: 1.3;">
        <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #1f2937;">${a.name}</div>
        <div style="margin-bottom: 3px; font-size: 12px;">
          <span style="color: #6b7280;">🐛</span> <strong>Hama:</strong> ${a.pest}
        </div>
        <div style="margin-bottom: 3px; font-size: 12px;">
          <span style="color: #6b7280;">🌾</span> <strong>Tanaman:</strong> ${a.crop}
        </div>
        <div style="margin-bottom: 3px; font-size: 12px;">
          <span style="color: #6b7280;">👤</span> <strong>Pelapor:</strong> ${a.reporter}
        </div>
        <div style="margin-bottom: 3px; font-size: 12px;">
          <span style="color: #6b7280;">📊</span> <strong>Infeksi:</strong> ${a.infectionChance}%
        </div>
        <div style="margin-bottom: 3px; font-size: 12px;">
          <span style="color: #6b7280;">💢</span> <strong>Keparahan:</strong> ${a.severity}%
        </div>
        <div style="margin-bottom: 3px; font-size: 12px;">
          <span style="color: #6b7280;">📈</span> <strong>Tertular:</strong> ${a.percent}%
        </div>
        <div style="color: #6b7280; font-size: 11px;">
          Radius: ${a.radiusM} m
        </div>
      </div>`;

      marker.bindTooltip(tooltipContent, {
        direction: "right",
        offset: [8, 0],
        permanent: false,
        className: 'custom-tooltip'
      });

      // hover interactions - enhance all circles on hover and show tooltip
      marker.on("mouseover", () => {
        setHoveredAlert(a);
        // Enhance all circles on hover with smooth transitions
        outerCircle.setStyle({ weight: 2, fillOpacity: 0.15 });
        middleCircle.setStyle({ weight: 2, fillOpacity: 0.35 });
        innerCircle.setStyle({ weight: 2, fillOpacity: 0.5 });
        // Slightly increase marker size (radius +2)
        marker.setStyle({ radius: 10 });
        // Open tooltip on hover
        marker.openTooltip();
      });
      marker.on("mouseout", () => {
        setHoveredAlert(null);
        // Reset all circles to original opacity
        outerCircle.setStyle({ weight: 1, fillOpacity: 0.1 });
        middleCircle.setStyle({ weight: 1, fillOpacity: 0.25 });
        innerCircle.setStyle({ weight: 1, fillOpacity: 0.4 });
        // Reset marker size
        marker.setStyle({ radius: 8 });
        // Close tooltip on mouseout
        marker.closeTooltip();
      });

      // Check if user farm is inside any of the danger zones
      const distanceToFarm = map.distance(
        [a.lat, a.lng],
        [userFarm.lat, userFarm.lng]
      );
      const farmInside = distanceToFarm <= a.radiusM * 1.2; // Check against outer circle

      refs.push({ 
        alert: a, 
        marker, 
        circles: { outer: outerCircle, middle: middleCircle, inner: innerCircle },
        farmInside 
      });
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
    <>
      <style>{`
        .custom-tooltip {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 6px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          font-size: 12px !important;
          padding: 8px !important;
          max-width: 200px !important;
          transition: opacity 0.2s ease-in-out !important;
        }
        .custom-tooltip::before {
          border-left-color: rgba(255, 255, 255, 0.95) !important;
        }
        .leaflet-tooltip-right {
          margin-left: 8px !important;
        }
        /* Smooth transitions for map elements */
        .leaflet-interactive {
          transition: all 0.2s ease-in-out !important;
        }
      `}</style>
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
    </>
  );
}
