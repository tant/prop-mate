import { Card, CardHeader, CardDescription, CardTitle, CardAction, CardFooter, CardContent } from "@/components/ui/card"; import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property } from "@/models/property";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { IconShare } from "@tabler/icons-react";

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

  return (
    <Card className="p-4 flex flex-col gap-2 shadow hover:shadow-lg transition">
      <CardHeader>
        <CardDescription>{property.memorableName}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {property.price && typeof property.price.value === "number" ?
            `${(property.price.value / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} triệu`
            : '—'}
          <Badge variant="outline" className="ml-2">
            {property.legalStatus}
          </Badge>
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
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={property.memorableName}
                  className="h-full w-full object-contain rounded bg-gray-100 cursor-pointer"
                  onClick={() => handleImgClick(img)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-1/2 h-full">
          <PropertyMiniMap key={`${property.location?.lat},${property.location?.lng}`} lat={property.location?.lat} lng={property.location?.lng} />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        {/* <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up this month <IconShare className="size-4" />
        </div> */}
        <div className="text-muted-foreground">
          {property.location?.fullAddress}
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>Diện tích: {property.area} m²</span>
          <span>PN: {property.bedrooms} phòng ngủ</span>
          <span>WC: {property.bathrooms} nhà tắm</span>
        </div>
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={onView}>
            Xem
          </Button>
          <Button size="sm" variant="secondary" onClick={onEdit}>
            Sửa
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            Lưu trữ
          </Button>
        </div>
      </CardFooter>



      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="flex items-center justify-center">
          {modalImg && (
            <img src={modalImg} alt="Xem ảnh" className="max-h-[80vh] max-w-full object-contain rounded" />
          )}
        </DialogContent>
      </Dialog>


    </Card>
  );
}
