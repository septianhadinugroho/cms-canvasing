"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ProductsTable } from "@/components/products-table"
import { ProductForm } from "@/components/product-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [storeFilter, setStoreFilter] = useState("all")
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
                <h1 className="text-3xl font-semibold text-foreground mb-2">Manajemen Produk</h1>
                <p className="text-muted-foreground">Kelola semua produk, harga, dan stok Anda</p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Produk
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Tambah Produk Baru</DialogTitle>
                  </DialogHeader>
                  <ProductForm onClose={() => setIsAddDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari produk..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-background border-border text-foreground">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="sepatu">Sepatu</SelectItem>
                    <SelectItem value="tas">Tas</SelectItem>
                    <SelectItem value="jaket">Jaket</SelectItem>
                    <SelectItem value="aksesoris">Aksesoris</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={storeFilter} onValueChange={setStoreFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-background border-border text-foreground">
                    <SelectValue placeholder="Toko" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Toko</SelectItem>
                    <SelectItem value="jakarta">Jakarta Pusat</SelectItem>
                    <SelectItem value="bandung">Bandung</SelectItem>
                    <SelectItem value="surabaya">Surabaya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ProductsTable searchTerm={searchTerm} categoryFilter={categoryFilter} storeFilter={storeFilter} />
          </div>
        </main>
      </div>
    </div>
  )
}
