/* biome-ignore lint/suspicious/noExplicitAny: Dynamic import for SSR-safe leaflet usage */
let MapContainer: any, TileLayer: any, Marker: any, useMapEvents: any, L: any;

if (typeof window !== "undefined") {
  // Import leaflet and leaflet.css only on client
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("leaflet/dist/leaflet.css");
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  L = require("leaflet");
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ MapContainer, TileLayer, Marker, useMapEvents } = require("react-leaflet"));

  if (L?.Icon?.Default) {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }
}

type Props = {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number) => void;
};

export default function LocationPickerMap({ lat, lng, onChange }: Props) {
  if (typeof window === "undefined") {
    return null;
  }

  function LocationMarker() {
    useMapEvents({
      // biome-ignore lint/suspicious/noExplicitAny: event from leaflet
      click(e: any) {
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
