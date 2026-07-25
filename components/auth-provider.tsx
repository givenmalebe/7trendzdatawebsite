"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import type { User } from "firebase/auth"
import { subscribeToAuth, getUserProfile, linkClientAccount, type UserProfile } from "@/lib/auth-service"

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    if (!user?.email) return
    const current = await getUserProfile(user.uid)
    if (current?.role === "client" && !current.clientId) {
      await linkClientAccount(user.uid, user.email, current.displayName || user.displayName || "")
    }
    const updated = await getUserProfile(user.uid)
    setProfile(updated)
  }, [user])

  useEffect(() => {
    const unsubscribe = subscribeToAuth((authUser, userProfile) => {
      setUser(authUser)
      setProfile(userProfile)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
