import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { PropertyFormCard } from "./property-form-card";
import type { UseFormReturn } from "react-hook-form";
import type { PropertyCreateInput } from "./property-form";

interface PropertyFormBasicsProps {
  form: UseFormReturn<PropertyCreateInput>;
  hasError?: boolean;
}

export function PropertyFormBasics({ form, hasError }: PropertyFormBasicsProps) {
  return (
    <PropertyFormCard title="Thông tin cơ bản" collapsible={false} hasError={!!hasError}>
      <div className="px-6">
        {/* Trạng thái, Loại hình (dòng 1) */}
        <div className="flex gap-4 w-full mb-4">
          <div className="flex-1">
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Nháp</SelectItem>
                        <SelectItem value="AVAILABLE">Đang bán/cho thuê</SelectItem>
                        <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                        <SelectItem value="SOLD">Đã bán</SelectItem>
                        <SelectItem value="RENTED">Đã cho thuê</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="flex-1">
            <FormField control={form.control} name="listingType" render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại hình" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Bán</SelectItem>
                        <SelectItem value="rent">Cho thuê</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>
        {/* Loại BĐS & Pháp lý (dòng 2) */}
        <div className="flex gap-4 w-full mb-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại BĐS" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APARTMENT">Căn hộ</SelectItem>
                          <SelectItem value="HOUSE">Nhà phố</SelectItem>
                          <SelectItem value="LAND">Đất</SelectItem>
                          <SelectItem value="VILLA">Biệt thự</SelectItem>
                          <SelectItem value="OFFICE">Văn phòng</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="legalStatus"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pháp lý" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PINK_BOOK">Sổ hồng</SelectItem>
                          <SelectItem value="RED_BOOK">Sổ đỏ</SelectItem>
                          <SelectItem value="SALE_CONTRACT">Hợp đồng mua bán</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Tên gợi nhớ (bắt buộc) */}
        <div className="mb-4">
          <FormField
            control={form.control}
            name="memorableName"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="mb-0 whitespace-nowrap">
                    Tên gợi nhớ <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Căn hộ Sunrise City" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Diện tích & Giá (cùng dòng) */}
        <div className="flex gap-4 w-full mb-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="mb-0 whitespace-nowrap">
                      Diện tích <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        value={field.value ?? ''}
                        onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="price.value"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="mb-0 whitespace-nowrap">
                      Giá <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1000000}
                        value={field.value ?? ''}
                        onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Địa chỉ (bắt buộc) */}
        <div className="mb-4">
          <FormField
            control={form.control}
            name="location.fullAddress"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="mb-0 whitespace-nowrap">
                    Địa chỉ <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập địa chỉ đầy đủ" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </PropertyFormCard>
  );
}
