"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api" // Import API dikembalikan

// Definisikan tipe data user dan response sesuai backend
interface User {
  name: string
  store_code: string,
  role: 'admin' | 'kasir'
}

interface LoginResponse {
  user: Omit<User, 'role'> & { role?: 'admin' | 'kasir' } // Role dibuat opsional
  token: {
    token_access: string
    token_refresh: string
  }
}

// Dummy user untuk kasir
const dummyCashier = {
  user: { name: 'Cashier User', store_code: 'CSH-001', role: 'kasir' as 'kasir' },
  token: { token_access: 'dummy-cashier-token', token_refresh: 'dummy-cashier-refresh' }
};


export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Logika untuk login dummy kasir
    if (username === 'kasir' && password === 'kasir') {
      setTimeout(() => {
        const response = dummyCashier;
        auth.login(response.token.token_access, response.user)
        toast({
          title: "Login Berhasil!",
          description: `Selamat datang kembali, ${response.user.name}.`,
        })
        setIsLoading(false)
      }, 1000);
      return; // Hentikan eksekusi lebih lanjut
    }

    // Logika untuk login admin via API
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        username,
        password,
      })
      
      if (response.token && response.user) {
        // Default role ke 'admin' jika tidak ada dari API
        const userWithRole = { ...response.user, role: response.user.role || 'admin' as const };
        auth.login(response.token.token_access, userWithRole)
        toast({
          title: "Login Berhasil!",
          description: `Selamat datang kembali, ${response.user.name}.`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Login Gagal",
        description: error.message || "Username atau password salah.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-foreground">Canvasing CMS</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Masuk ke dashboard untuk mengelola produk dan toko
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username Anda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background border-border text-foreground pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Masuk...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Masuk
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}