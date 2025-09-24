"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StoreForm } from "./store-form"
import { Edit, Trash2, MapPin, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

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
}

interface StoresGridProps {
  searchTerm: string
  statusFilter: string
  cityFilter: string
}

export function StoresGrid({ searchTerm, statusFilter, cityFilter }: StoresGridProps) {
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStores = async () => {
        setIsLoading(true);
        try {
            const fetchedStores = await api.get<Store[]>('/stores');
            // Filter sementara di frontend
            const filtered = fetchedStores.filter(store =>
                (store.name.toLowerCase().includes(searchTerm.toLowerCase()) || store.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (statusFilter === 'all' || store.status === statusFilter) &&
                (cityFilter === 'all' || store.city === cityFilter)
            );
            setStores(filtered);
        } catch (error) {
            toast({ title: "Error", description: "Gagal memuat data toko.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    fetchStores();
  }, [searchTerm, statusFilter, cityFilter, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge variant="default">Aktif</Badge>
      case "inactive": return <Badge variant="secondary">Nonaktif</Badge>
      case "maintenance": return <Badge variant="destructive">Maintenance</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleEdit = (store: Store) => {
    setEditingStore(store)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (store: Store) => {
    if (window.confirm(`Hapus toko ${store.name}?`)) {
        setStores(prev => prev.filter(s => s.id !== store.id));
        toast({ title: "Berhasil!", description: `Toko ${store.name} dihapus.` });
    }
  }
  
  if (isLoading) return <div className="text-center py-12">Memuat data toko...</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Card key={store.id} className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground mb-1">{store.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {store.address}
                  </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem onClick={() => handleEdit(store)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(store)}><Trash2 className="h-4 w-4 mr-2" />Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {getStatusBadge(store.status)}
            </CardHeader>
            <CardContent>
              {/* Konten lain bisa ditambahkan di sini */}
            </CardContent>
          </Card>
        ))}
      </div>

      {stores.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Tidak ada toko yang ditemukan</p>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit Toko</DialogTitle></DialogHeader>
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