"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect, useMemo } from "react"
import Link from "next/link"

// Fix Leaflet default marker icons in Next.js (client-only)
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export type GeoPoint = { id: string; name?: string; lat: number; lng: number }

function FitBounds({ bounds }: { bounds: L.LatLngBounds | undefined }) {
  const map = useMap()
  useEffect(() => {
    if (!bounds || !bounds.isValid()) return
    const ne = bounds.getNorthEast()
    const sw = bounds.getSouthWest()
    const isSinglePoint = ne.equals(sw)
    if (isSinglePoint) {
      // Center on the single point with a sensible zoom
      map.setView(bounds.getCenter(), 15, { animate: false })
    } else {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 })
    }
    // Ensure size recalculates after layout
    setTimeout(() => map.invalidateSize(), 0)
  }, [map, bounds])
  return null
}

export default function LeafletMap({ points }: { points: GeoPoint[] }) {
  const center = useMemo<[number, number]>(() => {
    return points.length > 0 ? [points[0].lat, points[0].lng] : [10.762622, 106.660172] // fallback HCMC
  }, [points])

  const bounds = useMemo(() => {
    if (points.length === 0) return undefined
    return L.latLngBounds(points.map((p) => L.latLng(p.lat, p.lng)))
  }, [points])

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <FitBounds bounds={bounds} />
      {points.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]}>
          <Popup>
            <div className="space-y-1">
              <div className="font-medium">{p.name || "(Không tên)"}</div>
              <Link href={`/properties/${p.id}`} className="text-primary hover:underline">
                Xem chi tiết
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
