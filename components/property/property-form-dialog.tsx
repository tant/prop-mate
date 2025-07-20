import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebaseConfig";
import { getAuth } from "firebase/auth";


// Hàm upload ảnh lên Firebase Storage, trả về URL public
async function uploadImageToFirebase(file: File): Promise<string> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Bạn cần đăng nhập để upload ảnh");
  const storage = getStorage(app);
  const fileRef = storageRef(storage, `properties/${user.uid}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

const MAX_IMAGE_SIZE_MB = 2;
const MAX_TOTAL_SIZE_MB = 15;

// Lưu thêm size cho từng ảnh đã upload (dạng: {url, size})
type ImageWithSize = { url: string; size: number };

export function PropertyFormDialog({
  open,
  onClose,
  onSubmit,
  initial,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initial?: any;
  loading?: boolean;
}) {
  // Sửa lại state imageUrls thành mảng object {url, size}
  const [form, setForm] = useState({
    memorableName: "",
    address: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    legalStatus: "",
    imageUrls: [] as ImageWithSize[],
    notes: "",
  });

  // Khi load initial, nếu là mảng string thì gán size = 0 (không kiểm soát được size cũ)
  useEffect(() => {
    if (initial) {
      setForm({
        memorableName: initial.memorableName || "",
        address: initial.address || "",
        price: initial.price?.toString() || "",
        area: initial.area?.toString() || "",
        bedrooms: initial.bedrooms?.toString() || "",
        bathrooms: initial.bathrooms?.toString() || "",
        legalStatus: initial.legalStatus || "",
        imageUrls: Array.isArray(initial.imageUrls)
          ? initial.imageUrls.map((url: string) => ({ url, size: 0 }))
          : [],
        notes: initial.notes || "",
      });
    } else {
      setForm({
        memorableName: "",
        address: "",
        price: "",
        area: "",
        bedrooms: "",
        bathrooms: "",
        legalStatus: "",
        imageUrls: [],
        notes: "",
      });
    }
  }, [initial, open]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    // Kiểm tra từng file
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        alert(`Ảnh "${files[i].name}" vượt quá ${MAX_IMAGE_SIZE_MB}MB!`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }
    // Tính tổng size đã upload (ảnh cũ)
    const uploadedTotal = form.imageUrls.reduce((sum, img) => sum + (img.size || 0), 0);
    // Tính tổng size file mới
    let newTotal = 0;
    for (let i = 0; i < files.length; i++) {
      newTotal += files[i].size;
    }
    if (uploadedTotal + newTotal > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
      alert(`Tổng dung lượng ảnh của bất động sản vượt quá ${MAX_TOTAL_SIZE_MB}MB!`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setUploading(true);
    try {
      const imgs: ImageWithSize[] = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const url = await uploadImageToFirebase(files[i]);
          imgs.push({ url, size: files[i].size });
        } catch (err: any) {
          alert(err.message || "Lỗi upload ảnh. Hãy đăng nhập lại.");
          break;
        }
      }
      setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, ...imgs] }));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (idx: number) => {
    setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      area: Number(form.area),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      imageUrls: form.imageUrls.map((img) => img.url).filter(Boolean),
    });
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>{initial ? "Chỉnh sửa BĐS" : "Thêm mới BĐS"}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input name="memorableName" placeholder="Tên gợi nhớ" value={form.memorableName} onChange={handleChange} required />
          <Input name="address" placeholder="Địa chỉ" value={form.address} onChange={handleChange} required />
          <Input name="price" placeholder="Giá (VNĐ)" value={form.price} onChange={handleChange} type="number" required />
          <Input name="area" placeholder="Diện tích (m²)" value={form.area} onChange={handleChange} type="number" required />
          <div className="flex gap-2">
            <Input name="bedrooms" placeholder="Phòng ngủ" value={form.bedrooms} onChange={handleChange} type="number" required />
            <Input name="bathrooms" placeholder="WC" value={form.bathrooms} onChange={handleChange} type="number" required />
          </div>
          <Input name="legalStatus" placeholder="Tình trạng pháp lý" value={form.legalStatus} onChange={handleChange} />
          {/* Thay thế trường nhập ảnh bằng upload file */}
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
