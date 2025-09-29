"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StoreForm } from "./store-form"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Store } from "@/types"

interface StoresGridProps {
  searchTerm: string
  refreshKey: number
  onRefresh: () => void
}

export function StoresGrid({ searchTerm, refreshKey, onRefresh }: StoresGridProps) {
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [stores, setStores] = useState<Store[]>([])
  const [filteredStores, setFilteredStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    try {
        // Menggunakan /stores/all untuk mendapatkan data lengkap, sesuai backend.
        const fetchedStores = await api.get<Store[]>('/stores');
        setStores(fetchedStores);
    } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to load store data.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  // Gunakan refreshKey untuk memicu fetch
  useEffect(() => {
    fetchStores();
  }, [fetchStores, refreshKey]);

  // Lakukan filter di frontend karena API tidak mendukung search
  useEffect(() => {
    const filtered = stores.filter(store =>
        store.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.store_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [searchTerm, stores]);

  const handleEdit = (store: Store) => {
    toast({ title: "Fitur Dalam Pengembangan", description: "API untuk update toko belum tersedia di backend." });
    // Logika edit akan ditambahkan di sini setelah backend siap
    // setEditingStore(store);
    // setIsEditDialogOpen(true);
  }

  const handleDelete = (storeCode: string) => {
    toast({ title: "Fitur Dalam Pengembangan", description: "API untuk menghapus toko belum tersedia di backend." });
    // Logika hapus akan ditambahkan di sini setelah backend siap
  }

  if (isLoading) return <div className="text-center py-12">Loading store data...</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <Card key={store.store_code} className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-2">
                  <CardTitle className="text-lg font-semibold text-foreground">{store.store_name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(store)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(store.store_code)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-mono text-muted-foreground">{store.store_code}</p>
              <p className="text-sm text-muted-foreground mt-2 truncate">{store.address}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStores.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No stores found.</p>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit Store</DialogTitle></DialogHeader>
          {editingStore && (
            <StoreForm
              store={editingStore}
              onClose={() => { setIsEditDialogOpen(false); setEditingStore(null); }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}