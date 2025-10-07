import { Card, CardHeader, CardDescription, CardTitle, CardAction, CardFooter, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types/property";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
  const [modalImgIndex, setModalImgIndex] = useState<number>(0);
  const images = property.imageUrls?.length ? property.imageUrls : ["/no-image.png"];

  const handleImgClick = (index: number) => {
    setModalImgIndex(index);
    setModalOpen(true);
  };

  // Fix: location may be undefined, so use optional chaining and fallback
  const lat = property.location?.gps?.lat ?? null;
  const lng = property.location?.gps?.lng ?? null;

  // Helper for keyboard accessibility
  const handleImgKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleImgClick(index);
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
        <div className="w-1/2 h-full relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={8}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            style={{ height: "100%", width: "100%" }}
            className="property-card-swiper"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={typeof img === 'string' ? img : idx}>
                <Image
                  src={img}
                  alt={`${property.memorableName} - ảnh ${idx + 1}`}
                  className="h-full w-full object-cover rounded bg-gray-100 cursor-pointer"
                  onClick={() => handleImgClick(idx)}
                  tabIndex={0}
                  onKeyDown={(e) => handleImgKeyDown(idx, e)}
                  width={320}
                  height={180}
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-1/2 h-full">
          {lat && lng ? (
            <PropertyMiniMap lat={lat} lng={lng} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-50 rounded">
              Không có vị trí
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">
          {property.location?.fullAddress}
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
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
        <DialogPortal>
          <DialogOverlay className="bg-transparent" />
          <DialogContent className="w-[85vw] h-auto max-h-[90vh] max-w-[1400px] p-0 gap-0 bg-transparent border-0 shadow-none overflow-visible [&>button]:hidden">
            <div className="sr-only">
              <DialogTitle>Xem ảnh bất động sản</DialogTitle>
              <DialogDescription>Ảnh phóng to của bất động sản này</DialogDescription>
            </div>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              initialSlide={modalImgIndex}
              className="property-modal-swiper w-full"
              style={{ height: 'auto', minHeight: '400px' }}
            >
              {images.map((img, idx) => (
                <SwiperSlide key={`modal-${idx}`} className="flex items-center justify-center h-auto">
                  <Image
                    src={img}
                    alt={`${property.memorableName} - ảnh ${idx + 1}`}
                    className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                    width={1920}
                    height={1080}
                    unoptimized
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </Card>
  );
}
