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
  heightClass = "h-48",
  fullscreenTopOffsetClass = "inset-0",
}: {
  center?: [number, number];
  zoom?: number;
  heightClass?: string;
  fullscreenTopOffsetClass?: string; // e.g. "top-28 left-0 right-0 bottom-0" to keep header visible
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<any>(null);
  const instanceRef = useRef<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [protectedFarms, setProtectedFarms] = useState<number[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    // when expanded toggles, invalidate map size so tiles render correctly
    if (instanceRef.current) {
      setTimeout(() => {
        try {
          instanceRef.current.invalidateSize();
        } catch (e) {}
      }, 200);
    }
  }, [expanded]);

  useEffect(() => {
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
        crop: "Padi",
        pest: "Wereng",
      },
    ];

    // Simulated user's farm location (in a real app, pass this as a prop)
    const userFarm = {
      id: 999,
      name: "Lahan Anda",
      lat: center[0] + 0.005,
      lng: center[1] + 0.002,
    };

    // Build SVG pin icons (blue and gray) as data URLs
    const buildPinDataUrl = (color: string) => {
      const svg = encodeURIComponent(
        `<?xml version="1.0" encoding="UTF-8"?>
<svg width="34" height="34" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" fill-rule="evenodd">
    <path d="M17 3c5.246 0 9.5 4.187 9.5 9.357 0 5.17-4.254 9.948-9.5 17.286C11.754 22.305 7.5 17.527 7.5 12.357 7.5 7.187 11.754 3 17 3z" fill="${color}"/>
    <circle cx="17" cy="12.5" r="4.5" fill="#ffffff"/>
  </g>
</svg>`
      );
      return `data:image/svg+xml;charset=UTF-8,${svg}`;
    };

    const userPinBlue = L.icon({
      iconUrl: buildPinDataUrl("#2563eb"),
      iconSize: [34, 34],
      iconAnchor: [17, 33],
      popupAnchor: [0, -28],
      tooltipAnchor: [12, -20],
    });

    const userPinGray = L.icon({
      iconUrl: buildPinDataUrl("#9CA3AF"),
      iconSize: [34, 34],
      iconAnchor: [17, 33],
      popupAnchor: [0, -28],
      tooltipAnchor: [12, -20],
    });

    // draw a marker for user's farm using pin icon
    const farmMarker = L.marker([userFarm.lat, userFarm.lng], {
      icon: userPinBlue,
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

      const baseStroke =
        a.percent >= 75 ? "#ff4e4e" : a.percent >= 40 ? "#ffb84e" : "#31B57F";
      const baseFill = baseStroke; // same hue, control opacity via fillOpacity
      const circle = L.circle([a.lat, a.lng], {
        radius: a.radiusM,
        color: baseStroke,
        fillColor: baseFill,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.28,
      }).addTo(map);

      marker.bindPopup(
        `<strong>${a.name}</strong><br/>Tanaman: ${a.crop}<br/>Perkiraan tertular: ${a.percent}%<br/>Hama: ${a.pest}<br/>Radius: ${a.radiusM} m`
      );

      // hover interactions
      marker.on("mouseover", () => {
        circle.setStyle({ weight: 2, fillOpacity: 0.38 });
        marker.setStyle({ radius: 10 });
        marker.openPopup();
      });
      marker.on("mouseout", () => {
        circle.setStyle({ weight: 1, fillOpacity: 0.28 });
        marker.setStyle({ radius: 8 });
        marker.closePopup();
      });

      // mirror hover interactions on the radius circle for better UX
      circle.on("mouseover", () => {
        circle.setStyle({ weight: 2, fillOpacity: 0.38 });
        marker.setStyle({ radius: 10 });
        marker.openPopup();
      });
      circle.on("mouseout", () => {
        circle.setStyle({ weight: 1, fillOpacity: 0.28 });
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

    // attach farm marker and icons reference so we can update it later
    (map as any)._farmMarker = farmMarker;
    (map as any)._userIcons = { blue: userPinBlue, gray: userPinGray };

    // Store user location for center button
    setUserLocation([userFarm.lat, userFarm.lng]);
  }

  // Function to center map on user location
  const centerOnUser = () => {
    if (instanceRef.current) {
      // Get user location from map instance or use fallback
      const userFarm = {
        lat: center[0] + 0.005,
        lng: center[1] + 0.002,
      };
      instanceRef.current.setView([userFarm.lat, userFarm.lng], 15);
    }
  };

  // Function to refresh the map
  const refreshMap = () => {
    if (instanceRef.current) {
      instanceRef.current.invalidateSize();
      // Force tile refresh
      instanceRef.current.eachLayer((layer: any) => {
        if (layer._url) {
          layer.redraw();
        }
      });
    }
  };

  return (
    <div
      className={`${
        expanded
          ? `fixed ${fullscreenTopOffsetClass} z-40 bg-white`
          : `${heightClass} rounded-lg border bg-muted overflow-hidden`
      }`}
    >
      <div className="relative h-full w-full">
        <div ref={mapRef} className="w-full h-full" />

        {/* Map Controls - Right side */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-[1000]">
          {/* Control Buttons - Always visible in fullscreen */}
          {expanded && (
            <>
              {/* Center on User Button */}
              <button
                className="w-10 h-10 rounded-md bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center z-[1001]"
                onClick={centerOnUser}
                title="Pusatkan ke lokasi Anda"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              {/* Refresh Map Button */}
              <button
                className="w-10 h-10 rounded-md bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center z-[1001]"
                onClick={refreshMap}
                title="Refresh peta"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Fullscreen Toggle */}
          {expanded ? (
            <button
              className="w-10 h-10 rounded-md bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center z-[1001]"
              onClick={() => setExpanded(false)}
              title="Keluar dari layar penuh"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : (
            <button
              className="w-10 h-10 rounded-md bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center z-[1001]"
              onClick={() => setExpanded(true)}
              title="Layar penuh"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Inline hover info via popup on marker/circle only; overlay removed */}

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
                    const userIcons = (instanceRef.current as any)._userIcons;
                    if (farmMarker && userIcons && userIcons.gray) {
                      farmMarker.setIcon(userIcons.gray);
                    }
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
