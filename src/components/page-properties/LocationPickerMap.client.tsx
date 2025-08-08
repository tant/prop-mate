"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

type Props = {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number) => void;
};

// Fix marker icon URLs for leaflet
function fixLeafletIcons() {
  if (L?.Icon?.Default && typeof window !== "undefined") {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }
}

export default function LocationPickerMap({ lat, lng, onChange }: Props) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        onChange(e.latlng.lat, e.latlng.lng);
      },
    });
    return lat !== undefined && lng !== undefined ? <Marker position={[lat, lng]} /> : null;
  }

  return (
    <MapContainer
      center={[lat ?? 21.028511, lng ?? 105.804817]}
      zoom={lat !== undefined && lng !== undefined ? 15 : 5}
      style={{ width: "100%", height: 220, borderRadius: 8 }}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker />
    </MapContainer>
  );
}
