import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-5xl font-bold mb-4 text-blue-700">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Không tìm thấy trang</h2>
      <p className="mb-6 text-gray-500">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Về trang chủ</Link>
    </div>
  );
}
