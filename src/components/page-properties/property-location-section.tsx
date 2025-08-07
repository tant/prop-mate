import React from "react";
import LocationPickerMap from "./location-picker-map";

interface Props {
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hideCity?: boolean;
  hideDistrict?: boolean;
  hideWard?: boolean;
  hideStreet?: boolean;
}

export default function PropertyLocationSection({ form, handleChange, hideCity, hideDistrict, hideWard, hideStreet, setForm }: Props & { setForm?: any }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">Thông tin Vị trí</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">Địa chỉ đầy đủ *</label>
          <input name="fullAddress" value={form.fullAddress} onChange={handleChange} required placeholder="Nhập địa chỉ đầy đủ" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="font-semibold">Tên dự án/tòa nhà</label>
          <input name="projectName" value={form.projectName} onChange={handleChange} placeholder="Nhập tên dự án/tòa nhà" className="w-full px-3 py-2 border rounded" />
        </div>
        {!hideCity && (
          <div>
            <label className="font-semibold">Tỉnh/Thành phố</label>
            <input name="city" value={form.city} onChange={handleChange} placeholder="Nhập tỉnh/thành phố" className="w-full px-3 py-2 border rounded" />
          </div>
        )}
        {!hideDistrict && (
          <div>
            <label className="font-semibold">Quận/Huyện</label>
            <input name="district" value={form.district} onChange={handleChange} placeholder="Nhập quận/huyện" className="w-full px-3 py-2 border rounded" />
          </div>
        )}
        {!hideWard && (
          <div>
            <label className="font-semibold">Phường/Xã</label>
            <input name="ward" value={form.ward} onChange={handleChange} placeholder="Nhập phường/xã" className="w-full px-3 py-2 border rounded" />
          </div>
        )}
        {!hideStreet && (
          <div>
            <label className="font-semibold">Đường/Phố</label>
            <input name="street" value={form.street} onChange={handleChange} placeholder="Nhập tên đường/phố" className="w-full px-3 py-2 border rounded" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <label className="font-semibold mb-2 block">Pin vị trí trên bản đồ</label>
        <LocationPickerMap
          lat={form.gps?.lat}
          lng={form.gps?.lng}
          onChange={(lat, lng) => setForm && setForm((prev: any) => ({ ...prev, gps: { lat, lng } }))}
        />
        {form.gps && (
          <div className="mt-2 text-sm text-gray-600">Vị trí đã chọn: {form.gps.lat}, {form.gps.lng}</div>
        )}
      </div>
    </div>
  );
}
