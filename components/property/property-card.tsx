import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property } from "@/models/property-interface";
import dynamic from "next/dynamic";

const PropertyMiniMap = dynamic(() => import("./property-mini-map"), { ssr: false });

export interface PropertyCardProps {
  property: Property;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PropertyCard({ property, onView, onEdit, onDelete }: PropertyCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-2 shadow hover:shadow-lg transition">
      <div className="flex gap-2 h-32 w-full mb-2">
        <div className="w-1/2 h-full">
          <img
            src={property.imageUrls?.[0] || "/window.svg"}
            alt={property.memorableName}
            className="h-full w-full object-cover rounded"
          />
        </div>
        <div className="w-1/2 h-full">
          <PropertyMiniMap lat={property.gps?.lat} lng={property.gps?.lng} />
        </div>
      </div>
      <div className="font-bold text-lg truncate">{property.memorableName}</div>
      <div className="text-gray-600 text-sm truncate">{property.address}</div>
      <div className="flex items-center gap-2 text-blue-700 font-semibold">
        {property.price?.toLocaleString()} đ
        <Badge variant="outline" className="ml-2">
          {property.legalStatus}
        </Badge>
      </div>
      <div className="flex gap-4 text-xs text-gray-500">
        <span>Diện tích: {property.area} m²</span>
        <span>PN: {property.bedrooms}</span>
        <span>WC: {property.bathrooms}</span>
      </div>
      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="outline" onClick={onView}>
          Xem
        </Button>
        <Button size="sm" variant="secondary" onClick={onEdit}>
          Sửa
        </Button>
        <Button size="sm" variant="destructive" onClick={onDelete}>
          Xóa
        </Button>
      </div>
    </Card>
  );
}
