// This file is already correctly structured and does not require changes.
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";


import type { PropertyCreateInput } from "./property-form";


interface PropertyFormMoreProps {
  form: UseFormReturn<PropertyCreateInput>;
}

export function PropertyFormMore({ form }: PropertyFormMoreProps) {
  return (
    <PropertyFormCard title="Bổ sung">
      <div className="p-6">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <FormField control={form.control} name="handoverDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày bàn giao</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value ? (typeof field.value === "string" ? field.value : field.value.toISOString().slice(0, 10)) : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="currentStatus" render={({ field }) => (
            <FormItem>
              <FormLabel>Tình trạng hiện tại</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tình trạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VACANT">Trống</SelectItem>
                    <SelectItem value="OCCUPIED">Đang ở</SelectItem>
                    <SelectItem value="RENTED_OUT">Đã cho thuê</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="price.pricePerSqm" render={({ field }) => (
            <FormItem>
              <FormLabel>Giá/m²</FormLabel>
              <FormControl>
                <Input type="number" step="any" placeholder="Giá/m²" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </div>
    </PropertyFormCard>
  );
}
