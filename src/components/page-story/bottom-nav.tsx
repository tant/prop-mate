import Link from "next/link";
import { Home, AppWindow } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur border-t shadow-lg flex justify-center gap-8 py-3 z-50 rounded-t-2xl">
      <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
        <Home size={28} strokeWidth={2} />
      </Link>
      <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
        <AppWindow size={28} strokeWidth={2} />
      </Link>
    </nav>
  );
}
