import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-2 text-blue-700">PropMate Home</h1>
      <p className="text-lg text-center mb-6 text-gray-700">
        Chào mừng! 👋
        <br />
        Quản lý bất động sản, khách hàng và lịch hẹn dễ dàng.
      </p>
      <div className="flex gap-4 mb-8">
        <a
          className="px-8 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition text-lg font-semibold"
          href="/dashboard"
        >
          Vào App
        </a>
      </div>
    </div>
  );
}
