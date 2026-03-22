"use client"

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