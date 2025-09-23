"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StoreForm } from "./store-form"
import { Edit, Trash2, MapPin, Phone, Users, TrendingUp, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Store {
  id: string
  name: string
  address: string
  city: string
  phone: string
  manager: string
  status: "active" | "inactive" | "maintenance"
  totalProducts: number
  monthlySales: number
  coordinates: {
    lat: number
    lng: number
  }
}

const mockStores: Store[] = [
  {
    id: "1",
    name: "Toko Jakarta Pusat",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    city: "jakarta",
    phone: "+62 21 1234 5678",
    manager: "Budi Santoso",
    status: "active",
    totalProducts: 245,
    monthlySales: 45200000,
    coordinates: { lat: -6.2088, lng: 106.8456 },
  },
  {
    id: "2",
    name: "Toko Bandung Utara",
    address: "Jl. Dago No. 45, Bandung",
    city: "bandung",
    phone: "+62 22 9876 5432",
    manager: "Sari Dewi",
    status: "active",
    totalProducts: 189,
    monthlySales: 32500000,
    coordinates: { lat: -6.8951, lng: 107.6084 },
  },
  {
    id: "3",
    name: "Toko Surabaya Timur",
    address: "Jl. Raya Gubeng No. 78, Surabaya",
    city: "surabaya",
    phone: "+62 31 5555 1234",
    manager: "Ahmad Rizki",
    status: "maintenance",
    totalProducts: 156,
    monthlySales: 28900000,
    coordinates: { lat: -7.2575, lng: 112.7521 },
  },
  {
    id: "4",
    name: "Toko Medan Plaza",
    address: "Jl. Gatot Subroto No. 90, Medan",
    city: "medan",
    phone: "+62 61 7777 8888",
    manager: "Linda Sari",
    status: "active",
    totalProducts: 203,
    monthlySales: 38700000,
    coordinates: { lat: 3.5952, lng: 98.6722 },
  },
]

interface StoresGridProps {
  searchTerm: string
  statusFilter: string
  cityFilter: string
}

export function StoresGrid({ searchTerm, statusFilter, cityFilter }: StoresGridProps) {
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  const filteredStores = mockStores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.manager.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || store.status === statusFilter
    const matchesCity = cityFilter === "all" || store.city === cityFilter

    return matchesSearch && matchesStatus && matchesCity
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Aktif</Badge>
      case "inactive":
        return <Badge variant="secondary">Nonaktif</Badge>
      case "maintenance":
        return <Badge variant="destructive">Maintenance</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleEdit = (store: Store) => {
    setEditingStore(store)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (store: Store) => {
    console.log("Deleting store:", store.id)
    toast({
      title: "Toko dihapus",
      description: `Toko ${store.name} berhasil dihapus`,
    })
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <Card key={store.id} className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-foreground mb-1">{store.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {store.address}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuItem onClick={() => handleEdit(store)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(store)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between">
                {getStatusBadge(store.status)}
                <span className="text-sm text-muted-foreground capitalize">{store.city}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                {store.phone}
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                Manager: {store.manager}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Total Produk</p>
                  <p className="text-lg font-semibold text-foreground">{store.totalProducts}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Penjualan/Bulan</p>
                  <p className="text-lg font-semibold text-foreground">{formatCurrency(store.monthlySales)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center text-sm text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% vs bulan lalu
                </div>
                <Button variant="outline" size="sm" className="border-border bg-transparent">
                  Lihat Detail
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Tidak ada toko yang ditemukan</p>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Toko</DialogTitle>
          </DialogHeader>
          {editingStore && (
            <StoreForm
              store={editingStore}
              onClose={() => {
                setIsEditDialogOpen(false)
                setEditingStore(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
