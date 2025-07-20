"use client";
import Image from "next/image";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUserEmail(user.email || null);
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      alert("Sign out failed!");
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader size={48} color="#2563eb" speedMultiplier={0.9} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-2 text-blue-700">PropMate Home</h1>
      <p className="text-lg text-center mb-6 text-gray-700">
        Chào mừng{userEmail ? `, ${userEmail}` : "!"} 👋
        <br />
        Quản lý bất động sản, khách hàng và lịch hẹn dễ dàng.
      </p>
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
          onClick={() => router.push("/properties")}
        >
          Quản lý BĐS
        </button>
        <button
          className="px-6 py-3 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 transition"
          onClick={() => router.push("/clients")}
        >
          Khách hàng
        </button>
        <button
          className="px-6 py-3 bg-purple-500 text-white rounded shadow hover:bg-purple-600 transition"
          onClick={() => router.push("/appointments")}
        >
          Lịch hẹn
        </button>
      </div>
      <button
        className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={handleSignOut}
      >
        Đăng xuất
      </button>
    </div>
  );
}
