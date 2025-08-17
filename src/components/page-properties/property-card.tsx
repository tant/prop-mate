import { Card, CardHeader, CardDescription, CardTitle, CardAction, CardFooter, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types/property";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { IconShare } from "@tabler/icons-react";
import Image from "next/image";

const PropertyMiniMap = dynamic(() => import("./property-mini-map"), { ssr: false });

export interface PropertyCardProps {
  property: Property;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PropertyCard({ property, onView, onEdit, onDelete }: PropertyCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const images = property.imageUrls?.length ? property.imageUrls : ["/no-image.png"];

  const handleImgClick = (img: string) => {
    setModalImg(img);
    setModalOpen(true);
  };

  // Fix: location may be undefined, so use optional chaining and fallback
  const lat = property.location?.gps?.lat ?? null;
  const lng = property.location?.gps?.lng ?? null;

  // Helper for keyboard accessibility
  const handleImgKeyDown = (img: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleImgClick(img);
    }
  };

  return (
    <Card className="p-4 flex flex-col gap-2 shadow hover:shadow-lg transition" data-testid="property-card">
      <CardHeader>
        <CardDescription>{property.memorableName}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {property.price && typeof property.price.value === "number" ?
            `${(property.price.value / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} triệu`
            : '—'}
          {property.legalStatus && (
            <Badge variant="outline" className="ml-2">
              {property.legalStatus}
            </Badge>
          )}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <IconShare />
            Chia sẻ
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex gap-2 h-32 w-full mb-2">
        <div className="w-1/2 h-full">
          <Swiper
            spaceBetween={8}
            slidesPerView={1}
            style={{ height: "100%", width: "100%" }}
          >
            {images.map((img, idx) => (
              <SwiperSlide key={typeof img === 'string' ? img : idx}>
                <Image
                  src={img}
                  alt={property.memorableName}
                  className="h-full w-full object-contain rounded bg-muted cursor-pointer"
                  onClick={() => handleImgClick(img)}
                  tabIndex={0}
                  onKeyDown={(e) => handleImgKeyDown(img, e)}
                  width={320}
                  height={180}
                  style={{ objectFit: 'contain' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-1/2 h-full">
          {lat && lng ? (
            <PropertyMiniMap lat={lat} lng={lng} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-muted rounded">
              Không có vị trí
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">
          {property.location?.fullAddress}
        </div>
  <div className="flex gap-4 text-xs text-muted-foreground">
          <span>Diện tích: {property.area} m²</span>
          <span>PN: {property.bedrooms ?? '-'} phòng ngủ</span>
          <span>WC: {property.bathrooms ?? '-'} nhà tắm</span>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={onView} type="button">
            Xem
          </Button>
          {onEdit && (
            <Button size="sm" variant="secondary" onClick={onEdit} type="button">
              Sửa
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="destructive" onClick={onDelete} type="button">
              Lưu trữ
            </Button>
          )}
        </div>
      </CardFooter>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="flex flex-col items-center justify-center">
          <div className="sr-only">
            <DialogTitle>Xem ảnh bất động sản</DialogTitle>
            <DialogDescription>Ảnh phóng to của bất động sản này</DialogDescription>
          </div>
          {modalImg && (
            <Image src={modalImg} alt="Xem ảnh" className="max-h-[80vh] max-w-full object-contain rounded" width={800} height={600} />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
