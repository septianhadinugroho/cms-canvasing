"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  name: string
  store_code: string
  role: 'ADMIN' | 'SALESMAN' | 'CASHIER'
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
      const token = localStorage.getItem("accessToken")
      const userData = localStorage.getItem("userData")

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true)
        setUser(parsedUser)
        // Set cookies for middleware
        document.cookie = `token=${token}; path=/`;
        document.cookie = `userData=${JSON.stringify(parsedUser)}; path=/`;
      } else {
        setIsAuthenticated(false)
        setUser(null)
        // Clear cookies
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        if (pathname !== "/login") {
          router.push("/login")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname])

  const login = (token: string, userData: User) => {
    localStorage.setItem("accessToken", token)
    localStorage.setItem("userData", JSON.stringify(userData))
    // Set cookies for middleware
    document.cookie = `token=${token}; path=/`;
    document.cookie = `userData=${JSON.stringify(userData)}; path=/`;
    setIsAuthenticated(true)
    setUser(userData)
    // Redirect based on role
    switch (userData.role) {
      case 'ADMIN':
        router.push("/");
        break;
      case 'SALESMAN':
        router.push("/products");
        break;
      case 'CASHIER':
        router.push("/sales-history");
        break;
      default:
        router.push("/");
        break;
    }
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("userData")
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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