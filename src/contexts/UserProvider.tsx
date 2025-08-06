"use client";
import { UserContext } from "./UserContext";
import type { User } from "@/types/user";

export function UserProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={user}>{children}</UserContext.Provider>
  );
}
