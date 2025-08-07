import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import LocationPickerMap from "@/components/page-properties/location-picker-map";
import imageCompression from "browser-image-compression";
import { storage } from "@/lib/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type ImageWithSize = { url: string; size: number };

type PropertyFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initial?: any;
  loading?: boolean;
};

const defaultForm = {
  memorableName: "",
  address: "",
  price: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
  legalStatus: "",
  imageUrls: [] as ImageWithSize[],
  notes: "",
  gps: undefined as { lat: number; lng: number } | undefined,
};

export function PropertyFormDialog({
  open,
  onClose,
  onSubmit,
  initial,
  loading,
}: PropertyFormDialogProps) {
  const [form, setForm] = useState({ ...defaultForm });
  const [uploading, setUploading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial) {
      setForm({
        memorableName: initial.memorableName || "",
        address: initial.address || "",
        price: initial.price ? (initial.price / 1_000_000).toString() : "",
        area: initial.area?.toString() || "",
        bedrooms: initial.bedrooms?.toString() || "",
        bathrooms: initial.bathrooms?.toString() || "",
        legalStatus: initial.legalStatus || "",
        imageUrls: Array.isArray(initial.imageUrls)
          ? initial.imageUrls.map((url: string) => ({ url, size: 0 }))
          : [],
        notes: initial.notes || "",
        gps: initial.gps || undefined,
      });
    } else {
      setForm({ ...defaultForm });
    }
  }, [initial, open]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const uploadImageToFirebase = async (file: File) => {
    const storageRef = ref(storage, `properties/${Date.now()}_${file.name}`);
    console.log("[Upload] Bắt đầu upload:", file.name);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    console.log("[Upload] Thành công:", url);
    return url;
  };

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const imgs: ImageWithSize[] = [];
      for (let i = 0; i < files.length; i++) {
        // Nén ảnh
        const compressedFile = await imageCompression(files[i], {
          maxSizeMB: 0.3, // ~300kb
          maxWidthOrHeight: 760,
          useWebWorker: true,
          fileType: "image/jpeg",
          initialQuality: 0.8,
        });
        // Upload lên Firebase Storage
        const url = await uploadImageToFirebase(compressedFile);
        imgs.push({ url, size: compressedFile.size });
      }
      setForm(f => ({ ...f, imageUrls: [...f.imageUrls, ...imgs] }));
    } catch (err) {
      console.error("[Upload] Lỗi khi upload ảnh:", err);
      alert("Lỗi khi upload ảnh: " + (err instanceof Error ? err.message : err));
    } finally {
      setUploading(false);
      fileInputRef.current && (fileInputRef.current.value = "");
    }
  };

  const handleRemoveImage = (idx: number) => {
    setForm(f => ({ ...f, imageUrls: f.imageUrls.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price) * 1_000_000,
      area: Number(form.area),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      imageUrls: form.imageUrls.map(img => img.url).filter(Boolean),
      gps: form.gps,
    });
  };

  const handleGeocode = async () => {
    if (!form.address) {
      alert("Vui lòng nhập địa chỉ trước!");
      return;
    }
    setGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.address)}`);
      if (!res.ok) {
        alert("Lỗi mạng hoặc bị chặn: " + res.status);
        return;
      }
      const data = await res.json();
      if (data && data.length > 0) {
        setForm(f => ({ ...f, gps: { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } }));
      } else {
        alert("Không tìm thấy vị trí phù hợp!");
      }
    } catch (e) {
      alert("Lỗi khi tìm vị trí: " + (e instanceof Error ? e.message : e));
    } finally {
      setGeocoding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent showCloseButton className="overflow-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{initial ? "Chỉnh sửa BĐS" : "Thêm mới BĐS"}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input name="memorableName" placeholder="Tên gợi nhớ" value={form.memorableName} onChange={handleChange} required />
          <div className="flex gap-2 items-center">
            <Input name="address" placeholder="Địa chỉ" value={form.address} onChange={handleChange} required />
            <Button type="button" size="icon" variant="outline" onClick={handleGeocode} disabled={geocoding} title="Lấy vị trí từ địa chỉ">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#2563eb" strokeWidth="2" d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9Zm0 0v-4m0-8v4m0 0h4m-4 0H8"/></svg>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input name="price" placeholder="Giá" value={form.price} onChange={handleChange} type="number" required />
            <span className="text-gray-500 whitespace-nowrap">triệu đồng</span>
          </div>
          <div className="flex items-center gap-2">
            <Input name="area" placeholder="Diện tích" value={form.area} onChange={handleChange} type="number" required />
            <span className="text-gray-500 whitespace-nowrap">m²</span>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 w-full">
              <Input name="bedrooms" placeholder="Phòng ngủ" value={form.bedrooms} onChange={handleChange} type="number" required />
              <span className="text-gray-500 whitespace-nowrap">phòng ngủ</span>
            </div>
            <div className="flex items-center gap-2 w-full">
              <Input name="bathrooms" placeholder="WC" value={form.bathrooms} onChange={handleChange} type="number" required />
              <span className="text-gray-500 whitespace-nowrap">nhà tắm</span>
            </div>
          </div>
          <Input name="legalStatus" placeholder="Tình trạng pháp lý" value={form.legalStatus} onChange={handleChange} />
          <div>
            <label className="block mb-1 font-medium">Vị trí trên bản đồ</label>
            <div className="w-full h-56 mb-2">
              <LocationPickerMap
                lat={form.gps?.lat}
                lng={form.gps?.lng}
                onChange={(lat, lng) => setForm(f => ({ ...f, gps: { lat, lng } }))}
              />
            </div>
            {form.gps && (
              <div className="text-xs text-gray-500">Lat: {form.gps.lat}, Lng: {form.gps.lng}</div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Ảnh bất động sản</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              disabled={uploading || loading}
              className="block w-full border rounded px-2 py-1"
              title="Chọn ảnh bất động sản"
              placeholder="Chọn ảnh bất động sản"
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {form.imageUrls.filter(Boolean).map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img.url} alt="Ảnh" className="w-20 h-20 object-cover rounded border" />
                  <span className="absolute bottom-0 left-0 bg-white/80 text-xs px-1 rounded">{(img.size/1024/1024).toFixed(2)}MB</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-0 right-0 bg-white/80 rounded-full px-1 text-xs text-red-600 opacity-0 group-hover:opacity-100"
                    tabIndex={-1}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {uploading && <div className="text-xs text-blue-600 mt-1">Đang upload ảnh...</div>}
          </div>
          <Input name="notes" placeholder="Ghi chú" value={form.notes} onChange={handleChange} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading || uploading}>Hủy</Button>
            <Button type="submit" disabled={loading || uploading}>{loading ? "Đang lưu..." : (initial ? "Lưu" : "Thêm mới")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
