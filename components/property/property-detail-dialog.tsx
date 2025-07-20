import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ConfirmDeleteDialog } from "@/components/property/confirm-delete-dialog";
import { Property } from "@/models/property-interface";

export function PropertyDetailDialog({ property, open, onClose, onEdit, onDelete }: {
  property: Property | null;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const [showDelete, setShowDelete] = useState(false);
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent showCloseButton>
        {property && (
          <>
            <DialogHeader>
              <DialogTitle>{property.memorableName}</DialogTitle>
              <DialogDescription>{property.address}</DialogDescription>
            </DialogHeader>
            <img
              src={property.imageUrls?.[0] || "/window.svg"}
              alt={property.memorableName}
              className="h-48 w-full object-cover rounded mb-4"
            />
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">{property.legalStatus}</Badge>
              <Badge variant="outline">{property.direction}</Badge>
              <Badge variant="outline">{property.area} m²</Badge>
              <Badge variant="outline">{property.frontage && `Mặt tiền: ${property.frontage}m`}</Badge>
              <Badge variant="outline">{property.bedrooms} PN</Badge>
              <Badge variant="outline">{property.bathrooms} WC</Badge>
            </div>
            <div className="text-blue-700 font-bold text-xl mb-2">
              {property.price?.toLocaleString()} đ
            </div>
            {property.notes && (
              <div className="text-gray-700 mb-2">Ghi chú: {property.notes}</div>
            )}
            <div className="text-xs text-gray-400 mb-4">
              Ngày tạo: {property.createdAt && (
                typeof property.createdAt === "object" && "seconds" in property.createdAt
                  ? new Date((property.createdAt as { seconds: number }).seconds * 1000).toLocaleString()
                  : new Date(property.createdAt).toLocaleString()
              )}
            </div>
            <div className="flex justify-end gap-2">
              {onEdit && <Button variant="secondary" onClick={onEdit}>Sửa</Button>}
              {onDelete && <Button variant="destructive" onClick={() => setShowDelete(true)}>Xóa</Button>}
            </div>
            {onDelete && (
              <ConfirmDeleteDialog
                open={showDelete}
                onCancel={() => setShowDelete(false)}
                onConfirm={() => { setShowDelete(false); onDelete(); }}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
