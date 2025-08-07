import "@/lib/firebaseConfig";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngBoundsExpression } from "leaflet";
import { Property } from "@/models/property";

if (typeof window !== "undefined" && L && L.Icon.Default) {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

function FitBoundsHandler({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!positions.length) return;
    if (positions.length === 1) {
      map.setView(positions[0], 16);
    } else {
      map.fitBounds(positions, { padding: [40, 40] });
    }
  }, [positions, map]);
  return null;
}

export default function AllPropertiesMap({ onSelect }: { onSelect?: (property: Property | null) => void } = {}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/properties", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Lỗi xác thực hoặc tải dữ liệu");
        const data = await res.json();
        console.log("[AllPropertiesMap] Dữ liệu API trả về:", data); // log dữ liệu API
        setProperties(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("[AllPropertiesMap] Lỗi khi fetch properties:", e);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Lọc các property có gps hợp lệ
  const points = properties.filter(p => p.location?.gps && typeof p.location.gps.lat === "number" && typeof p.location.gps.lng === "number");
  console.log("[AllPropertiesMap] points (có gps):", points); // log các property có gps
  const center: [number, number] = points.length > 0 && points[0].location?.gps
    ? [points[0].location.gps.lat, points[0].location.gps.lng]
    : [21.028511, 105.804817];
  const positions: [number, number][] = points
    .filter(p => p.location?.gps)
    .map(p => p.location?.gps ? [p.location.gps.lat, p.location.gps.lng] : [0,0]);

  return (
    <div className="w-full h-full min-h-[300px] rounded overflow-hidden flex flex-col gap-2">
      <div className="flex-1">
        <MapContainer
          center={center}
          zoom={points.length > 0 ? 13 : 5}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom
        >
          <FitBoundsHandler positions={positions} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {points.map((p) =>
            p.location?.gps ? (
              <Marker
                key={p.id}
                position={[p.location.gps.lat, p.location.gps.lng]}
                eventHandlers={{
                  click: () => {
                    if (onSelect) onSelect(p);
                  },
                }}
              >
                <Popup>
                  <div className="font-bold">{p.memorableName}</div>
                  <div className="text-xs text-gray-500">{p.location.fullAddress}</div>
                  <div className="text-blue-700 font-semibold">{p.price.value.toLocaleString()} đ</div>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
        {loading && <div className="absolute inset-0 flex items-center justify-center bg-white/60">Đang tải dữ liệu...</div>}
      </div>
      {/* Xóa panel info ở đây, chuyển sang parent */}
    </div>
  );
}
