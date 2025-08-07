"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/app/_trpc/client";
import { formatDate } from "@/lib/utils";
import { z } from "zod";
import { useMemo, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Page() {
  const { data: user, isLoading, isError } = api.user.me.useQuery();
  const queryClient = useQueryClient();
  const updateUser = api.user.update.useMutation();
  // State cho form edit (không phụ thuộc user)
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    profileImage: "",
    phoneNumber: "",
    address: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Khi user thay đổi, đồng bộ lại form
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profileImage: user.profileImage || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const fullName = useMemo(() => {
    return user ? `${user.firstName} ${user.lastName}` : "";
  }, [user]);

  if (isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;
  if (isError) return <div className="text-destructive">Không thể tải thông tin tài khoản.</div>;
  if (!user) return null;

  // Xử lý thay đổi input
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Xử lý cập nhật avatar (chỉ demo, thực tế nên upload lên server)
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((f) => ({ ...f, profileImage: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  }

  // Zod schema cho form user
  const userFormSchema = z.object({
    firstName: z.string().min(1, "Vui lòng nhập tên"),
    lastName: z.string().min(1, "Vui lòng nhập họ"),
    profileImage: z.string().optional(),
    phoneNumber: z.string().min(8, "Số điện thoại không hợp lệ"),
    address: z.string().optional(),
  });

  // Xử lý submit (gọi API update user)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = userFormSchema.safeParse(form);
    if (!result.success) {
      setFormError(result.error.issues[0]?.message || "Dữ liệu không hợp lệ");
      return;
    }
    setFormError(null);
    if (!user) return;
    try {
      await updateUser.mutateAsync({
        uid: user.uid,
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber,
          address: form.address,
          profileImage: form.profileImage,
        },
      });
      setEditMode(false);
      queryClient.invalidateQueries({ queryKey: ["user.me"] });
    } catch (err) {
      setFormError((err as Error)?.message || "Cập nhật thất bại");
    }
  }

  // Helper component cho 1 dòng thông tin cá nhân
  function InfoRow({ label, value, name, editMode, onChange, placeholder }: {
    label: string;
    value: string | undefined;
    name: string;
    editMode: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }) {
    return (
      <div>
        <span className="font-semibold">{label}:</span>{" "}
        {editMode ? (
          <input
            className="border rounded px-2 py-1 w-40"
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder || label}
          />
        ) : (
          value || <span className="italic text-muted-foreground">{placeholder || "Chưa cập nhật"}</span>
        )}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-lg font-semibold">Tài khoản</h1>
          </div>
        </header>
        <div className="p-4 max-w-2xl mx-auto">
          {isLoading ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : isError ? (
            <div className="text-destructive">Không thể tải thông tin tài khoản.</div>
          ) : user ? (
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 border-b pb-4">
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    className={editMode ? "cursor-pointer group outline-none bg-transparent border-0 p-0" : "bg-transparent border-0 p-0"}
                    style={{ position: 'relative' }}
                    onClick={editMode ? () => document.getElementById('avatar-upload')?.click() : undefined}
                    onKeyDown={editMode ? (e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('avatar-upload')?.click(); } : undefined}
                    tabIndex={editMode ? 0 : -1}
                    aria-label="Đổi ảnh đại diện"
                    disabled={!editMode}
                  >
                    <Avatar className="size-16">
                      <AvatarImage src={editMode ? form.profileImage || undefined : user.profileImage || undefined} alt={form.firstName || fullName} />
                      <AvatarFallback>{user.firstName?.[0]}{user.lastName ? user.lastName[0] : '.'}</AvatarFallback>
                    </Avatar>
                    {editMode && (
                      <>
                        {/* Icon bút chì ở góc trên phải */}
                        <span className="absolute top-0 right-0 bg-white rounded-full p-1 shadow" style={{ transform: 'translate(30%, -30%)' }}>
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Chỉnh sửa ảnh đại diện">
                            <title>Chỉnh sửa ảnh đại diện</title>
                            <path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z" fill="#888"/>
                            <path d="M14.85 6.35a1.2 1.2 0 0 0 0-1.7l-1.5-1.5a1.2 1.2 0 0 0-1.7 0l-1.13 1.13 3.2 3.2 1.13-1.13z" fill="#888"/>
                          </svg>
                        </span>
                        {/* Overlay đổi ảnh */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                          <span className="text-white text-xs">Đổi ảnh</span>
                        </div>
                      </>
                    )}
                  </button>
                  {editMode && (
                    <input
                      id="avatar-upload"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    {user.firstName} {user.lastName || <span className="italic text-muted-foreground">...</span>}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{user.email}</Badge>
                    {user.emailVerified && <Badge variant="outline">Đã xác thực email</Badge>}
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">UID: {user.uid}</div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <form onSubmit={handleSubmit} className="contents">
                  <div>
                    <div className="mb-2 font-medium">Thông tin cá nhân</div>
                    <div className="space-y-1 text-sm">
                      <InfoRow label="Họ" value={form.lastName} name="lastName" editMode={editMode} onChange={handleChange} placeholder="Họ" />
                      <InfoRow label="Tên" value={form.firstName} name="firstName" editMode={editMode} onChange={handleChange} placeholder="Tên" />
                      <InfoRow label="Số điện thoại" value={form.phoneNumber} name="phoneNumber" editMode={editMode} onChange={handleChange} placeholder="Số điện thoại" />
                      <InfoRow label="Địa chỉ" value={form.address} name="address" editMode={editMode} onChange={handleChange} placeholder="Địa chỉ" />
                      <div><span className="font-semibold">Xác thực SĐT:</span> {user.phoneVerified ? <span className="text-green-600">Đã xác thực</span> : <span className="text-muted-foreground">Chưa xác thực</span>}</div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-medium">Gói dịch vụ</div>
                    {user.subscription ? (
                      <div className="space-y-1 text-sm">
                        <div><span className="font-semibold">Gói:</span> {user.subscription.planName}</div>
                        <div><span className="font-semibold">Loại:</span> {user.subscription.type === 'MONTHLY' ? 'Theo tháng' : 'Theo năm'}</div>
                        <div><span className="font-semibold">Trạng thái:</span> <Badge>{user.subscription.status}</Badge></div>
                        <div><span className="font-semibold">Hạn sử dụng:</span> {formatDate(user.subscription.endDate)}</div>
                        {user.subscription.lastPayment && (
                          <div><span className="font-semibold">Thanh toán gần nhất:</span> {user.subscription.lastPayment.amount.toLocaleString()}₫ ({user.subscription.lastPayment.method})</div>
                        )}
                      </div>
                    ) : (
                      <div className="italic text-muted-foreground">Chưa đăng ký gói dịch vụ</div>
                    )}
                  </div>
                  {/* Mục Giới thiệu */}
                  <div>
                    <div className="mb-2 font-medium">Giới thiệu</div>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-semibold">Mã giới thiệu:</span> {user.referralCode || <span className="italic text-muted-foreground">Không có</span>}</div>
                      <div><span className="font-semibold">Người giới thiệu:</span> {user.referredBy || <span className="italic text-muted-foreground">Không có</span>}</div>
                    </div>
                  </div>
                  {/* Mục Thông tin */}
                  <div>
                    <div className="mb-2 font-medium">Thông tin tài khoản</div>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-semibold">Ngày tạo:</span> {formatDate(user.createdAt) === 'Không có' ? <span className="italic text-muted-foreground">Không có</span> : formatDate(user.createdAt)}</div>
                      <div><span className="font-semibold">Lần cập nhật cuối:</span> {formatDate(user.updatedAt) === 'Không có' ? <span className="italic text-muted-foreground">Không có</span> : formatDate(user.updatedAt)}</div>
                      <div><span className="font-semibold">Đăng nhập gần nhất:</span> {formatDate(user.lastLoginAt) === 'Không có' ? <span className="italic text-muted-foreground">Không có</span> : formatDate(user.lastLoginAt)}</div>
                    </div>
                  </div>
                  {formError && (
                    <div className="col-span-full text-destructive text-sm mb-2">{formError}</div>
                  )}
                  {editMode ? (
                    <div className="col-span-full flex gap-2 mt-4">
                      <button type="submit" className="px-4 py-2 rounded bg-primary text-white" disabled={updateUser.status === 'pending'}>
                        {updateUser.status === 'pending' ? "Đang lưu..." : "Lưu"}
                      </button>
                      <button type="button" className="px-4 py-2 rounded bg-muted" onClick={() => setEditMode(false)} disabled={updateUser.status === 'pending'}>
                        Huỷ
                      </button>
                    </div>
                  ) : (
                    <div className="col-span-full flex gap-2 mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 rounded bg-primary text-white"
                        onClick={e => {
                          e.preventDefault();
                          setEditMode(true);
                        }}
                      >
                        Cập nhật
                      </button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
