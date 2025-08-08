import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Image from "next/image";

// Fix default icon issue for leaflet in Next.js
if (typeof window !== "undefined" && L && L.Icon.Default) {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

type Props = { lat?: number; lng?: number };

export default function PropertyMiniMap({ lat, lng }: Props) {
  if (typeof window === "undefined") {
    return null;
  }

  if (typeof lat !== "number" || typeof lng !== "number") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded text-xs text-gray-400">
        <Image src="/globe.svg" alt="No location" width={32} height={32} className="w-8 h-8 opacity-40" />
        <span className="ml-2">Chưa có vị trí</span>
      </div>
    );
  }
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ width: "100%", height: "100%", borderRadius: 8 }}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={[lat, lng]} />
    </MapContainer>
  );
}
