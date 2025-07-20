import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Thiết lập dự án Next.js thành công!</h1>
      <p className="text-lg text-center">
        Bạn đã khởi tạo dự án và trang chủ đang hoạt động bình thường.
      </p>
    </div>
  );
}
