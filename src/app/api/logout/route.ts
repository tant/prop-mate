import { NextResponse } from "next/server"

export async function POST() {
  // Xóa cookie "token" bằng cách set maxAge = 0
  const res = NextResponse.json({ success: true })
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return res
}
