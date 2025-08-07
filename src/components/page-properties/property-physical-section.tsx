import React from "react";

interface Props {
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setForm: (cb: (prev: any) => any) => void;
}

const AMENITIES = [
  'Ban công', 'Hồ bơi', 'Phòng gym', 'Sân vườn', 'Bảo vệ 24/7',
  'Camera an ninh', 'Thẻ từ', 'Thang máy', 'Máy lạnh', 'Internet',
  'Truyền hình cáp', 'Đậu xe'
];

export default function PropertyPhysicalSection({ form, handleChange, setForm }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">Đặc điểm Vật lý</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="font-semibold">Diện tích (m2) *</label>
          <input name="area" value={form.area} onChange={handleChange} required type="number" min={1} placeholder="Nhập diện tích" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="font-semibold">Mặt tiền (m)</label>
          <input name="frontage" value={form.frontage} onChange={handleChange} type="number" min={0} placeholder="Nhập mặt tiền" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="font-semibold">Hướng nhà</label>
          <input name="direction" value={form.direction} onChange={handleChange} placeholder='Ví dụ: "Đông Nam"' className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="font-semibold">Số tầng</label>
          <input name="floor" value={form.floor} onChange={handleChange} type="number" min={0} placeholder="Nhập số tầng" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="font-semibold">Phòng ngủ</label>
          <input name="bedrooms" value={form.bedrooms} onChange={handleChange} type="number" min={0} placeholder="Nhập số phòng ngủ" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="font-semibold">Phòng tắm</label>
          <input name="bathrooms" value={form.bathrooms} onChange={handleChange} type="number" min={0} placeholder="Nhập số phòng tắm" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="font-semibold">Nội thất</label>
          <select name="interiorStatus" value={form.interiorStatus} onChange={handleChange} className="w-full px-3 py-2 border rounded" title="Chọn tình trạng nội thất">
            <option value="">Chọn tình trạng</option>
            <option value="FURNISHED">Đầy đủ</option>
            <option value="UNFURNISHED">Không có</option>
            <option value="PARTIALLY_FURNISHED">Một phần</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label className="font-semibold">Tiện ích</label>
        <div className="border rounded p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {AMENITIES.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`amenity-${amenity}`}
                  checked={form.amenities.includes(amenity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm((prev: any) => ({
                        ...prev,
                        amenities: [...prev.amenities, amenity]
                      }));
                    } else {
                      setForm((prev: any) => ({
                        ...prev,
                        amenities: prev.amenities.filter((a: string) => a !== amenity)
                      }));
                    }
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor={`amenity-${amenity}`}>{amenity}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
