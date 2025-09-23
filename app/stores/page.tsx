"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StoresGrid } from "@/components/stores-grid"
import { StoreForm } from "@/components/store-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, MapPin } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function StoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cityFilter, setCityFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-foreground mb-2">Manajemen Toko</h1>
                <p className="text-muted-foreground">Kelola semua toko dan lokasi penjualan Anda</p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Toko
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Tambah Toko Baru</DialogTitle>
                  </DialogHeader>
                  <StoreForm onClose={() => setIsAddDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari toko..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-background border-border text-foreground">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-background border-border text-foreground">
                    <SelectValue placeholder="Kota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kota</SelectItem>
                    <SelectItem value="jakarta">Jakarta</SelectItem>
                    <SelectItem value="bandung">Bandung</SelectItem>
                    <SelectItem value="surabaya">Surabaya</SelectItem>
                    <SelectItem value="medan">Medan</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-border bg-transparent text-foreground hover:bg-accent"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Peta
                </Button>
              </div>
            </div>

            <StoresGrid searchTerm={searchTerm} statusFilter={statusFilter} cityFilter={cityFilter} />
          </div>
        </main>
      </div>
    </div>
  )
}
