
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import dynamic from "next/dynamic";
import { PropertyFormCard } from "./property-form-card";
import type { UseFormReturn } from "react-hook-form";
import type { PropertyCreateInput } from "./property-form";

const LocationPickerMap = dynamic(() => import("./LocationPickerMap.client"), { ssr: false });

interface PropertyFormLocationProps {
  form: UseFormReturn<PropertyCreateInput>;
  hasError?: boolean;
  editable?: boolean;
}

export function PropertyFormLocation({ form, hasError, editable = true }: PropertyFormLocationProps) {
  return (
    <PropertyFormCard title="Vị trí" hasError={!!hasError}>
      <div className="px-6">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <FormField control={form.control} name="location.city" render={({ field }) => (
            <FormItem>
              <FormLabel>Thành phố</FormLabel>
              <FormControl>
                <Input placeholder="Thành phố" {...field} disabled={!editable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="location.district" render={({ field }) => (
            <FormItem>
              <FormLabel>Quận/Huyện</FormLabel>
              <FormControl>
                <Input placeholder="Quận/Huyện" {...field} disabled={!editable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="location.ward" render={({ field }) => (
            <FormItem>
              <FormLabel>Phường/Xã</FormLabel>
              <FormControl>
                <Input placeholder="Phường/Xã" {...field} disabled={!editable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="location.street" render={({ field }) => (
            <FormItem>
              <FormLabel>Đường</FormLabel>
              <FormControl>
                <Input placeholder="Đường" {...field} disabled={!editable} />
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
            onChange={
              editable
                ? (lat: number, lng: number) => {
                    form.setValue("location.gps.lat", lat);
                    form.setValue("location.gps.lng", lng);
                  }
                : () => {}
            }
            editable={editable}
          />
        </div>
      </div>
    </PropertyFormCard>
  );
}
