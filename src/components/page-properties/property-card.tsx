import { Card, CardHeader, CardDescription, CardTitle, CardAction, CardFooter, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types/property";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
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
  highlightTerm?: string;
}

function highlight(text: string | undefined, term?: string) {
  if (!text) return null;
  if (!term) return text;
  const safe = term.trim();
  if (!safe) return text;
  const regex = new RegExp(`(${safe.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) => {
    const key = `${part}-${i}`;
    return regex.test(part) ? (
      <mark key={`m-${key}`} className="bg-yellow-200 text-black rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={`t-${key}`}>{part}</span>
    );
  });
}

export function PropertyCard({ property, onView, onEdit, onDelete, highlightTerm }: PropertyCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  // Filter out any falsy/invalid image URLs
  const images = (property.imageUrls?.filter((img) => typeof img === 'string' && !!img) ?? []);
  const safeImages = images.length > 0 ? images : ["/no-image.png"];

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

  const formattedPrice = useMemo(() => {
    const val = property.price?.value;
    if (typeof val !== "number") return null;
    const millions = val / 1_000_000; // VND -> triệu
    if (millions >= 1000) {
      const billions = millions / 1000; // -> tỷ
      return `${billions.toLocaleString('vi-VN', { maximumFractionDigits: 2 })} tỷ`;
    }
    return `${millions.toLocaleString('vi-VN', { maximumFractionDigits: 2 })} triệu`;
  }, [property.price?.value]);

  return (
    <Card className="p-4 flex flex-col gap-2 shadow hover:shadow-lg transition" data-testid="property-card">
      <CardHeader>
        <CardDescription
          className="h-10 overflow-hidden"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
        >
          {highlight(property.memorableName, highlightTerm)}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formattedPrice ?? '—'}
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
            {safeImages.map((img, idx) => (
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
        <div
          className="text-muted-foreground h-10 overflow-hidden"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
        >
          {highlight(property.location?.fullAddress, highlightTerm)}
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
