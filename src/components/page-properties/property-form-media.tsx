"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PropertyFormCard } from "./property-form-card";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { PropertyCreateInput } from "./property-form";
import { X, Upload, Image as ImageIcon, FileText } from "lucide-react";
import Image from "next/image";
import { storage } from "@/lib/firebase/client";
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from "firebase/storage";

interface PropertyFormMediaProps {
  form: UseFormReturn<PropertyCreateInput>;
}

type UploadStatus = "pending" | "uploading" | "success" | "error";
type ImageItem = { id: string; name: string; src: string; downloadUrl?: string; progress: number; status: UploadStatus };
type DocItem = { id: string; name: string; url?: string; progress: number; status: UploadStatus; error?: string };

function randomId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function ProgressBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="h-2 w-full rounded bg-muted overflow-hidden">
      <div className="h-full bg-primary transition-[width]" style={{ width: `${pct}%` }} />
    </div>
  );
}

// Xóa file trên Firebase Storage
async function removeFileFromFirebase(url?: string) {
  if (!url) return;
  try {
    const storageRef = ref(storage, url.replace(/^https?:\/\/[^/]+\//, ""));
    await deleteObject(storageRef);
  } catch {
    // Có thể log lỗi nếu cần
  }
}

export function PropertyFormMedia({ form }: PropertyFormMediaProps) {
  // Images gallery (imageUrls)
  const [images, setImages] = useState<ImageItem[]>(() =>
    (form.getValues("imageUrls") ?? []).map((url) => ({ id: randomId("img"), name: url.split("/").pop() || "image", src: url, downloadUrl: url, progress: 100, status: "success" as UploadStatus }))
  );

  // Documents
  const [documents, setDocuments] = useState<DocItem[]>(() =>
    (form.getValues("documents") ?? []).map((d) => ({ id: randomId("doc"), name: d.name, url: d.url, progress: 100, status: "success" as UploadStatus }))
  );

  // 360 image
  const [image360Src, setImage360Src] = useState<string | undefined>(() => form.getValues("images360"));
  const [image360Progress, setImage360Progress] = useState<number>(0);
  const [image360Status, setImage360Status] = useState<UploadStatus>(image360Src ? "success" : "pending");

  // Video
  const [videoSrc, setVideoSrc] = useState<string | undefined>(() => form.getValues("videoUrl"));
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoStatus, setVideoStatus] = useState<UploadStatus>(videoSrc ? "success" : "pending");

  // Ensure form has only finalized URLs
  useEffect(() => {
    const urls = images.map((i) => i.downloadUrl).filter(Boolean) as string[];
    form.setValue("imageUrls", urls);
  }, [images, form]);

  useEffect(() => {
    const docs = documents.flatMap((d) => (d.url ? [{ name: d.name, url: d.url }] : []));
    form.setValue("documents", docs);
  }, [documents, form]);

  useEffect(() => {
    form.setValue("images360", image360Src);
  }, [image360Src, form]);

  useEffect(() => {
    form.setValue("videoUrl", videoSrc);
  }, [videoSrc, form]);

  // Drop handlers
  // Firebase upload helper
  const uploadWithProgress = useCallback(async (file: File, folder: string, onProgress: (pct: number) => void): Promise<string> => {
    const safeName = `${Date.now()}-${file.name}`.replace(/\s+/g, "-");
    const path = `${folder}/${safeName}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);
    return new Promise<string>((resolve, reject) => {
      task.on(
        "state_changed",
        (snap) => {
          const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
          onProgress(pct);
        },
        (err) => reject(err),
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            onProgress(100);
            resolve(url);
          } catch (e) {
            reject(e);
          }
        }
      );
    });
  }, []);

  const onDropImages = useCallback(
    (acceptedFiles: File[]) => {
      const newItems: ImageItem[] = acceptedFiles.map((file) => ({ id: randomId("img"), name: file.name, src: URL.createObjectURL(file), progress: 0, status: "uploading" }));
      setImages((prev) => [...prev, ...newItems]);
      // Start uploads
      newItems.forEach(async (item, idx) => {
        const file = acceptedFiles[idx];
        try {
          const url = await uploadWithProgress(file, "properties/images", (p) => {
            setImages((prev) => prev.map((it) => (it.id === item.id ? { ...it, progress: p, status: "uploading" } : it)));
          });
          setImages((prev) => prev.map((it) => (it.id === item.id ? { ...it, downloadUrl: url, src: url, progress: 100, status: "success" } : it)));
  } catch {
          setImages((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: "error" } : it)));
        }
      });
    },
    [uploadWithProgress]
  );

  const onDropDocuments = useCallback(
    (acceptedFiles: File[]) => {
      const newDocs: DocItem[] = acceptedFiles.map((file) => ({ id: randomId("doc"), name: file.name, progress: 0, status: "uploading" }));
      setDocuments((prev) => [...prev, ...newDocs]);
      newDocs.forEach(async (item, idx) => {
        const file = acceptedFiles[idx];
        try {
          const url = await uploadWithProgress(file, "properties/documents", (p) => {
            setDocuments((prev) => prev.map((d) => (d.id === item.id ? { ...d, progress: p, status: "uploading" } : d)));
          });
          setDocuments((prev) => prev.map((d) => (d.id === item.id ? { ...d, url, progress: 100, status: "success" } : d)));
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Upload failed";
          setDocuments((prev) => prev.map((d) => (d.id === item.id ? { ...d, status: "error", error: msg } : d)));
        }
      });
    },
    [uploadWithProgress]
  );

  const onDropImage360 = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles[0]) return;
      const file = acceptedFiles[0];
      const preview = URL.createObjectURL(file);
      setImage360Src(preview);
      setImage360Progress(0);
      setImage360Status("uploading");
      uploadWithProgress(file, "properties/360", setImage360Progress)
        .then((url) => {
          setImage360Src(url);
          setImage360Status("success");
        })
        .catch(() => setImage360Status("error"));
    },
    [uploadWithProgress]
  );

  const onDropVideo = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles[0]) return;
      const file = acceptedFiles[0];
      const preview = URL.createObjectURL(file);
      setVideoSrc(preview);
      setVideoProgress(0);
      setVideoStatus("uploading");
      uploadWithProgress(file, "properties/videos", setVideoProgress)
        .then((url) => {
          setVideoSrc(url);
          setVideoStatus("success");
        })
        .catch(() => setVideoStatus("error"));
    },
    [uploadWithProgress]
  );

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((it) => {
        if (typeof it.src === "string" && it.src.startsWith("blob:")) URL.revokeObjectURL(it.src);
      });
      if (image360Src?.startsWith("blob:")) URL.revokeObjectURL(image360Src);
      if (videoSrc?.startsWith("blob:")) URL.revokeObjectURL(videoSrc);
    };
  }, [images, image360Src, videoSrc]);

  const imagesDropzone = useDropzone({ accept: { "image/*": [] }, onDrop: onDropImages, multiple: true });
  const documentsDropzone = useDropzone({ onDrop: onDropDocuments, multiple: true });
  const image360Dropzone = useDropzone({ accept: { "image/*": [] }, onDrop: onDropImage360, multiple: false });
  const videoDropzone = useDropzone({ accept: { "video/*": [] }, onDrop: onDropVideo, multiple: false });

  const dropZoneBase = "flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center cursor-pointer transition hover:bg-muted/40";
  const thumbGrid = "mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3";

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((it) => it.id !== id));
    const removed = images.find((i) => i.id === id);
    if (removed?.downloadUrl) {
      const next = images.filter((i) => i.id !== id).map((i) => i.downloadUrl).filter(Boolean) as string[];
      form.setValue("imageUrls", next);
    }
  };
  const removeDoc = async (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    const removed = documents.find((d) => d.id === id);
    if (removed?.url) {
      await removeFileFromFirebase(removed.url);
    }
    const next = documents.filter((d) => d.id !== id).flatMap((d) => (d.url ? [{ name: d.name, url: d.url }] : []));
    form.setValue("documents", next);
  };

  return (
    <PropertyFormCard title="Hình ảnh & Tài liệu">
      <div className="px-6 space-y-6">
      {/* Thư viện ảnh */}
      <div>
        <FormLabel className="mb-2 block">Thư viện ảnh</FormLabel>
        <div {...imagesDropzone.getRootProps({ className: dropZoneBase })}>
          <input {...imagesDropzone.getInputProps()} />
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">Kéo thả ảnh vào đây hoặc bấm để chọn</div>
        </div>
        {images.length > 0 && (
          <div className={thumbGrid}>
            {images.map((it) => (
              <div key={it.id} className="relative group border rounded overflow-hidden">
                <Image src={it.src} alt={it.name} width={320} height={160} className="h-28 w-full object-cover" unoptimized />
                {it.status === "uploading" && (
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-black/40">
                    <ProgressBar value={it.progress} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(it.id)}
                  className="absolute top-1 right-1 hidden group-hover:flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-50"
                  aria-label="Remove image"
                  disabled={it.status === "uploading"}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {/* Optional: nhập URL ảnh bằng tay */}
        <FormField
          control={form.control}
          name="imageUrls"
          render={() => (
            <FormItem>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Tài liệu đính kèm */}
      <div>
        <FormLabel className="mb-2 block">Tài liệu đính kèm</FormLabel>
        <div {...documentsDropzone.getRootProps({ className: dropZoneBase })}>
          <input {...documentsDropzone.getInputProps()} />
          <FileText className="h-6 w-6 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">Kéo thả tài liệu vào đây hoặc bấm để chọn</div>
        </div>
        {documents.length > 0 && (
          <ul className="mt-3 space-y-2">
            {documents.map((d) => (
              <li key={d.id} className="flex flex-col gap-2 rounded border p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate" title={d.name}>{d.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Ẩn input tên và input URL, chỉ hiện nút xóa */}
                    <button type="button" onClick={() => removeDoc(d.id)} className="text-red-600 hover:underline text-sm" disabled={d.status === "uploading"}>Xóa</button>
                  </div>
                </div>
                {d.status === "uploading" && <ProgressBar value={d.progress} />}
                {d.status === "error" && <div className="text-xs text-red-600">Upload thất bại. Thử lại.</div>}
              </li>
            ))}
          </ul>
        )}
        <FormField
          control={form.control}
          name="documents"
          render={() => (
            <FormItem>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Ảnh 360 */}
      <div>
        <FormLabel className="mb-2 block">Ảnh 360</FormLabel>
        <div {...image360Dropzone.getRootProps({ className: dropZoneBase })}>
          <input {...image360Dropzone.getInputProps()} />
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">Kéo thả 1 ảnh 360 hoặc bấm để chọn</div>
        </div>
    {image360Src && (
          <div className="mt-3 relative inline-block border rounded overflow-hidden">
      <Image src={image360Src} alt="image-360" width={448} height={256} className="h-32 w-56 object-cover" unoptimized />
            {image360Status === "uploading" && (
              <div className="absolute inset-x-0 bottom-0 p-2 bg-black/40 w-56">
                <ProgressBar value={image360Progress} />
              </div>
            )}
            <button
              type="button"
              onClick={() => { setImage360Src(undefined); setImage360Progress(0); setImage360Status("pending"); }}
              className="absolute top-1 right-1 h-6 w-6 flex items-center justify-center rounded-full bg-black/60 text-white"
              aria-label="Remove 360"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {/* Manual URL input */}
        <div className="mt-2">
          <Input placeholder="Hoặc dán URL ảnh 360" value={image360Src ?? ""} onChange={(e) => { setImage360Src(e.target.value || undefined); setImage360Status(e.target.value ? "success" : "pending"); }} />
        </div>
        <FormField
          control={form.control}
          name="images360"
          render={() => (
            <FormItem>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Video */}
      <div>
        <FormLabel className="mb-2 block">Video</FormLabel>
        <div {...videoDropzone.getRootProps({ className: dropZoneBase })}>
          <input {...videoDropzone.getInputProps()} />
          <Upload className="h-6 w-6 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">Kéo thả 1 video hoặc bấm để chọn</div>
        </div>
        {videoSrc && (
          <div className="mt-3">
            <video src={videoSrc} controls className="w-full max-w-md rounded border">
              <track kind="captions" label="Captions" />
            </video>
            {videoStatus === "uploading" && (
              <div className="mt-2 w-full max-w-md">
                <ProgressBar value={videoProgress} />
              </div>
            )}
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => { setVideoSrc(undefined); setVideoProgress(0); setVideoStatus("pending"); }} className="text-red-600 hover:underline text-sm">Xóa</button>
            </div>
          </div>
        )}
        <div className="mt-2">
          <Input placeholder="Hoặc dán URL video" value={videoSrc ?? ""} onChange={(e) => { setVideoSrc(e.target.value || undefined); setVideoStatus(e.target.value ? "success" : "pending"); }} />
        </div>
        <FormField
          control={form.control}
          name="videoUrl"
          render={() => (
            <FormItem>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      </div>
    </PropertyFormCard>
  );
}
