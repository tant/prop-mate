import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return user;
}
