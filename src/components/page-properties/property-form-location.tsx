import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";
import type { UseFormReturn } from "react-hook-form";
import type { PropertyCreateInput } from "./property-form";

const LocationPickerMap = dynamic(() => import("./location-picker-map"), { ssr: false });

interface PropertyFormLocationProps {
  form: UseFormReturn<PropertyCreateInput>;
}

export function PropertyFormLocation({ form }: PropertyFormLocationProps) {
  return (
    <CardContent className="p-6">
      <div className="mb-4 grid grid-cols-2 gap-4">
        <FormField control={form.control} name="location.city" render={({ field }) => (
          <FormItem>
            <FormLabel>Thành phố</FormLabel>
            <FormControl>
              <Input placeholder="Thành phố" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="location.district" render={({ field }) => (
          <FormItem>
            <FormLabel>Quận/Huyện</FormLabel>
            <FormControl>
              <Input placeholder="Quận/Huyện" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="location.ward" render={({ field }) => (
          <FormItem>
            <FormLabel>Phường/Xã</FormLabel>
            <FormControl>
              <Input placeholder="Phường/Xã" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="location.street" render={({ field }) => (
          <FormItem>
            <FormLabel>Đường</FormLabel>
            <FormControl>
              <Input placeholder="Đường" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      {/* Thay input vĩ độ/kinh độ bằng bản đồ chọn vị trí */}
      <div className="mb-4">
        <FormLabel className="mb-2 block">Pin vị trí trên bản đồ</FormLabel>
        <LocationPickerMap
          lat={form.watch("location.gps.lat")}
          lng={form.watch("location.gps.lng")}
          onChange={(lat, lng) => {
            form.setValue("location.gps.lat", lat);
            form.setValue("location.gps.lng", lng);
          }}
        />
        {form.watch("location.gps.lat") !== undefined && form.watch("location.gps.lng") !== undefined && (
          <div className="mt-2 text-sm text-gray-600">
            Vị trí đã chọn: {form.watch("location.gps.lat")}, {form.watch("location.gps.lng")}
          </div>
        )}
      </div>
    </CardContent>
  );
}
