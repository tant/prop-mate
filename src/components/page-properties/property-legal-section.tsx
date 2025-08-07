import React from "react";

interface Props {
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function PropertyLegalSection({ form, handleChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">Pháp lý & Chủ sở hữu</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="font-semibold">Tình trạng pháp lý *</label>
          <select name="legalStatus" value={form.legalStatus} onChange={handleChange} required className="w-full px-3 py-2 border rounded" title="Chọn tình trạng pháp lý">
            <option value="">Chọn tình trạng</option>
            <option value="RED_BOOK">Sổ đỏ</option>
            <option value="PINK_BOOK">Sổ hồng</option>
            <option value="CONTRACT">Hợp đồng mua bán</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Chủ sở hữu</label>
          <input name="owner" value={form.owner} onChange={handleChange} type="text" placeholder="Nhập tên chủ sở hữu" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="font-semibold">Ghi chú pháp lý</label>
          <input name="legalNote" value={form.legalNote} onChange={handleChange} type="text" placeholder="Ghi chú pháp lý" className="w-full px-3 py-2 border rounded" />
        </div>
      </div>
    </div>
  );
}
