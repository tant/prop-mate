import { useEffect } from "react"
import { auth } from "@/lib/firebase/client"
import { onAuthStateChanged, User } from "firebase/auth"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

export function useAuthUser(): UseQueryResult<User | null, Error> {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: () =>
      new Promise<User | null>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          resolve(user)
          unsubscribe()
        })
      }),
    staleTime: 60 * 1000, // 1 phút
    refetchOnWindowFocus: false,
  })
}
