import React from "react";

interface Props {
  images: File[];
  documents: File[];
  onImageChange: (files: File[]) => void;
  onDocumentChange: (files: File[]) => void;
  imageErrors: string[];
  documentErrors: string[];
}

export default function PropertyMediaSection({ images, documents, onImageChange, onDocumentChange, imageErrors, documentErrors }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">Hình ảnh & Tài liệu</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">Hình ảnh (tối đa 3, JPG/PNG, {'<'}1MB mỗi ảnh)</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={e => {
              const files = Array.from(e.target.files || []);
              onImageChange(files);
            }}
            className="w-full px-3 py-2 border rounded"
            title="Chọn hình ảnh"
          />
          {imageErrors.length > 0 && (
            <ul className="text-red-500 text-sm mt-2">
              {imageErrors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          )}
        </div>
        <div>
          <label className="font-semibold">Tài liệu (PDF, tối đa 3, {'<'}1MB mỗi file)</label>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={e => {
              const files = Array.from(e.target.files || []);
              onDocumentChange(files);
            }}
            className="w-full px-3 py-2 border rounded"
            title="Chọn tài liệu PDF"
          />
          {documentErrors.length > 0 && (
            <ul className="text-red-500 text-sm mt-2">
              {documentErrors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
