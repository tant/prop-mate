import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyFormCard } from "./property-form-card";
import type { UseFormReturn } from "react-hook-form";
import type { PropertyCreateInput } from "./property-form";

interface PropertyFormDetailsProps {
  form: UseFormReturn<PropertyCreateInput>;
    hasError?: boolean; // Ensure hasError is destructured correctly
  editable?: boolean;
}

export function PropertyFormDetails({ form, hasError, editable = true }: PropertyFormDetailsProps) {
  return (
    <PropertyFormCard title="Chi tiết nhà/đất" hasError={!!hasError}>
      <div className="px-6">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <FormField control={form.control} name="frontage" render={({ field }) => (
            <FormItem>
              <FormLabel>Mặt tiền (m)</FormLabel>
              <FormControl>
                <Input {...field} type="number" step="any" placeholder="Mặt tiền" disabled={!editable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="direction" render={({ field }) => (
            <FormItem>
              <FormLabel>Hướng</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Hướng" disabled={!editable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="floor" render={({ field }) => (
            <FormItem>
              <FormLabel>Tầng</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="Tầng" disabled={!editable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="totalFloors" render={({ field }) => (
            <FormItem>
              <FormLabel>Tổng số tầng</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="Tổng số tầng" disabled={!editable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="unitsPerFloor" render={({ field }) => (
            <FormItem>
              <FormLabel>Số căn/tầng</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="Số căn/tầng" disabled={!editable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="bedrooms" render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng ngủ</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="Phòng ngủ" disabled={!editable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="bathrooms" render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng tắm</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="Phòng tắm" disabled={!editable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="interiorStatus" render={({ field }) => (
            <FormItem>
              <FormLabel>Tình trạng nội thất</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nội thất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FURNISHED">Đầy đủ nội thất</SelectItem>
                    <SelectItem value="UNFURNISHED">Không nội thất</SelectItem>
                    <SelectItem value="PARTIALLY_FURNISHED">Nội thất cơ bản</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="amenities" render={({ field }) => (
            <FormItem>
              <FormLabel>Tiện ích</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nhập tiện ích, cách nhau dấu phẩy" disabled={!editable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </div>
    </PropertyFormCard>
  );
}
