"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

// Bentuk data user disesuaikan dengan response API
interface User {
  name: string
  store_code: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (token: string, userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      // Kita cek keberadaan token
      const token = localStorage.getItem("accessToken")
      const userData = localStorage.getItem("userData")

      if (token && userData) {
        setIsAuthenticated(true)
        setUser(JSON.parse(userData))
      } else {
        setIsAuthenticated(false)
        setUser(null)
        if (pathname !== "/login") {
          router.push("/login")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname])

  const login = (token: string, userData: User) => {
    // Simpan token dan data user ke localStorage
    localStorage.setItem("accessToken", token)
    localStorage.setItem("userData", JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
    router.push("/") // Arahkan ke dashboard setelah login
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("userData")
    setIsAuthenticated(false)
    setUser(null)
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/login") {
    return null
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}