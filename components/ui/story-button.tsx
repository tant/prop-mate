"use client";
import { useEffect, useState } from "react";

export default function StoryButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);
  if (!show) return null;
  return (
    <a
      href="/the-story"
      className="inline-block px-8 py-3 bg-yellow-400 text-blue-900 rounded shadow hover:bg-yellow-500 transition text-lg font-semibold mb-2 ml-3 animate-fade-in"
    >
      Nghe chuyện
    </a>
  );
}
