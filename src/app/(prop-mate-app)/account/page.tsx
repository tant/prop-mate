"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/contexts/UserContext"
import { useMemo } from "react"

export default function Page() {
  const user = useUser();
  const loadingAuth = false;
  const isLoading = !user;
  const isError = false;

  const fullName = useMemo(() => {
    if (!user) return "";
    return `${user.firstName} ${user.lastName}`;
  }, [user]);

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
          {isLoading || loadingAuth ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : isError ? (
            <div className="text-destructive">Không thể tải thông tin tài khoản.</div>
          ) : user ? (
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 border-b pb-4">
                <Avatar className="size-16">
                  <AvatarImage src={user.profileImage || undefined} alt={fullName} />
                  <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-bold">{fullName}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{user.email}</Badge>
                    {user.emailVerified && <Badge variant="outline">Đã xác thực email</Badge>}
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">UID: {user.uid}</div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <div className="mb-2 font-medium">Thông tin cá nhân</div>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-semibold">Họ tên:</span> {fullName}</div>
                    <div><span className="font-semibold">Số điện thoại:</span> {user.phoneNumber}</div>
                    <div><span className="font-semibold">Địa chỉ:</span> {user.address || <span className="italic text-muted-foreground">Chưa cập nhật</span>}</div>
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
                <div>
                  <div className="mb-2 font-medium">Cài đặt</div>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-semibold">Chủ đề:</span> {user.settings?.theme || 'system'}</div>
                    <div><span className="font-semibold">Nhận thông báo:</span> {user.settings?.notificationEnabled ? 'Bật' : 'Tắt'}</div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-medium">Khác</div>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-semibold">Mã giới thiệu:</span> {user.referralCode || <span className="italic text-muted-foreground">Không có</span>}</div>
                    <div><span className="font-semibold">Người giới thiệu:</span> {user.referredBy || <span className="italic text-muted-foreground">Không có</span>}</div>
                    <div><span className="font-semibold">Ngày tạo:</span> {formatDate(user.createdAt)}</div>
                    <div><span className="font-semibold">Lần cập nhật cuối:</span> {formatDate(user.updatedAt)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
        {/* Bảng hiển thị tất cả các trường của user */}
        {user && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Tất cả trường dữ liệu user</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-muted-foreground rounded-lg">
                <tbody>
                  {Object.entries(user).map(([key, value]) => (
                    <tr key={key} className="border-b last:border-b-0">
                      <td className="font-medium px-2 py-1 whitespace-nowrap align-top bg-muted/50">{key}</td>
                      <td className="px-2 py-1 align-top">
                        {typeof value === 'object' && value !== null ? (
                          <pre className="whitespace-pre-wrap break-all bg-muted/20 rounded p-1">{JSON.stringify(value, null, 2)}</pre>
                        ) : value === undefined || value === null ? (
                          <span className="italic text-muted-foreground">Không có</span>
                        ) : (
                          String(value)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}

// Helper function
function formatDate(date: unknown): React.ReactNode {
  if (!date) return <span className="italic text-muted-foreground">Không có</span>;
  let d: Date | null = null;
  if (typeof date === 'string' || typeof date === 'number') {
    d = new Date(date);
  } else if (date instanceof Date) {
    d = date;
  } else if (
    date &&
    typeof date === 'object' &&
    'toDate' in date &&
    typeof (date as { toDate: () => Date }).toDate === 'function'
  ) {
    d = (date as { toDate: () => Date }).toDate();
  }
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleString() : <span className="italic text-muted-foreground">Không hợp lệ</span>;
}
