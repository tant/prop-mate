import React from "react";

interface Props {
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  hideListingType?: boolean;
}

export default function PropertyPriceSection({ form, handleChange, hideListingType }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">Giá & Thông tin giao dịch</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="font-semibold">Giá bán *</label>
          <input name="price" value={form.price} onChange={handleChange} required type="number" min={0} placeholder="Nhập giá bán" className="w-full px-3 py-2 border rounded" />
        </div>
        {!hideListingType && (
          <div>
            <label className="font-semibold">Hình thức giao dịch *</label>
            <select name="transactionType" value={form.transactionType} onChange={handleChange} required className="w-full px-3 py-2 border rounded" title="Chọn hình thức giao dịch">
              <option value="">Chọn hình thức</option>
              <option value="SELL">Bán</option>
              <option value="RENT">Cho thuê</option>
            </select>
          </div>
        )}
        <div>
          <label className="font-semibold">Thời hạn thuê (nếu có)</label>
          <input name="rentalTerm" value={form.rentalTerm} onChange={handleChange} type="text" placeholder="Ví dụ: 1 năm, 6 tháng" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="font-semibold">Phí quản lý (nếu có)</label>
          <input name="managementFee" value={form.managementFee} onChange={handleChange} type="number" min={0} placeholder="Nhập phí quản lý" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="font-semibold">Phí môi giới (nếu có)</label>
          <input name="brokerageFee" value={form.brokerageFee} onChange={handleChange} type="number" min={0} placeholder="Nhập phí môi giới" className="w-full px-3 py-2 border rounded" />
        </div>
      </div>
    </div>
  );
}
