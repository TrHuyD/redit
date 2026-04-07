"use client"

import { useRouter } from "next/router"
import { createContext, useContext } from "react"

type AuthContextType = {
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType>({ isLoggedIn: false })

export function AuthProvider({ isLoggedIn, children }: { isLoggedIn: boolean, children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export const RequireAuth = () => {
  const {isLoggedIn}=useAuth()
  const router = useRouter()
  if(!isLoggedIn)
    router.push('sign-in')
}