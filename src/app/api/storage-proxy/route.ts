// src/app/api/storage-proxy/route.ts
import { NextRequest } from 'next/server';
import { adminStorage } from '@/lib/firebase/admin';

/**
 * API route để proxy truy cập file từ Firebase Storage.
 * URL: /api/storage-proxy?path=<storage-path>
 * 
 * @param req NextRequest object
 * @returns Response với file content hoặc error
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('path');

  // Kiểm tra tham số path
  if (!filePath) {
    return new Response('Thiếu tham số path', { status: 400 });
  }

  // TODO: Kiểm tra quyền truy cập file
  // Ví dụ: Kiểm tra xem file này có thuộc về một trang sản phẩm nào đó đang published không
  // Đây là một logic phức tạp và phụ thuộc vào business requirements.
  // Trong ví dụ này, mình sẽ bỏ qua bước kiểm tra quyền để tập trung vào việc proxy.

  try {
    // Tạo signed URL để truy cập file từ Firebase Storage
    // Thời gian hết hạn: 5 phút
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    const signedUrl = await adminStorage
      .bucket() // Sử dụng bucket mặc định từ Firebase config
      .file(filePath)
      .getSignedUrl({
        action: 'read',
        expires: expirationTime,
      });

    const url = signedUrl[0];

    // Fetch file từ Firebase Storage bằng signed URL
    const fileResponse = await fetch(url);

    if (!fileResponse.ok) {
      console.error(`Lỗi khi fetch file từ Firebase Storage: ${fileResponse.status} ${fileResponse.statusText}`);
      return new Response('Không thể lấy file', { status: fileResponse.status });
    }

    // Lấy headers từ response của Firebase
    const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
    const contentLength = fileResponse.headers.get('content-length');

    // Tạo response mới để stream file về client
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }
    // Có thể thêm cache headers nếu cần

    // Trả về response với body từ Firebase
    return new Response(fileResponse.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Lỗi khi proxy file từ Firebase Storage:", error);
    return new Response('Lỗi server', { status: 500 });
  }
}