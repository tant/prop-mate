import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  hideListingType?: boolean;
  hideStatus?: boolean;
}

export default function PropertyBasicSection({ form, handleChange, hideListingType, hideStatus }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">Định danh & Phân loại</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">Tên gợi nhớ *</label>
          <input name="memorableName" value={form.memorableName} onChange={handleChange} required placeholder='Ví dụ: "Căn hộ The Sun Avenue 2PN"' className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="font-semibold">Loại BĐS *</label>
          <select name="propertyType" value={form.propertyType} onChange={handleChange} required className="w-full px-3 py-2 border rounded" title="Chọn loại bất động sản">
            <option value="APARTMENT">Căn hộ</option>
            <option value="HOUSE">Nhà</option>
            <option value="LAND">Đất</option>
            <option value="VILLA">Biệt thự</option>
            <option value="OFFICE">Văn phòng</option>
          </select>
        </div>
        {!hideListingType && (
          <div>
            <label className="font-semibold">Loại tin *</label>
            <select name="listingType" value={form.listingType} onChange={handleChange} required className="w-full px-3 py-2 border rounded" title="Chọn loại tin">
              <option value="sale">Bán</option>
              <option value="rent">Cho thuê</option>
            </select>
          </div>
        )}
        {!hideStatus && (
          <div>
            <label className="font-semibold">Trạng thái *</label>
            <select name="status" value={form.status} onChange={handleChange} required className="w-full px-3 py-2 border rounded" title="Chọn trạng thái">
              <option value="DRAFT">Nháp</option>
              <option value="AVAILABLE">Đang mở bán/cho thuê</option>
              <option value="PENDING">Đang chờ</option>
              <option value="SOLD">Đã bán</option>
              <option value="RENTED">Đã cho thuê</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
