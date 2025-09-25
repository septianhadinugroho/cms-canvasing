"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StoreForm } from "./store-form"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Store } from "@/types"

// Interface disederhanakan sesuai respons API GET /stores
interface StoreListItem {
  store_code: string;
  store_name: string;
}

interface StoresGridProps {
  searchTerm: string
}

export function StoresGrid({ searchTerm }: StoresGridProps) {
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [stores, setStores] = useState<StoreListItem[]>([]) // Menggunakan tipe data yang lebih sederhana
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStores = async () => {
        setIsLoading(true);
        try {
            // API tidak memerlukan parameter, karena user ID diambil dari token
            const fetchedStores = await api.get<StoreListItem[]>('/stores');
            
            // Filter di frontend berdasarkan searchTerm
            const filtered = fetchedStores.filter(store =>
                store.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.store_code.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setStores(filtered);
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to load store data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    fetchStores();
  }, [searchTerm, toast]);

  const handleEdit = (storeCode: string) => {
    // Di sini Anda perlu API GET /stores/{store_code} untuk mendapatkan detail lengkap
    console.log("Editing store:", storeCode)
    toast({ title: "Fitur Dalam Pengembangan", description: "API untuk mengambil detail toko belum tersedia."})
    // setEditingStore(detailFromApi);
    // setIsEditDialogOpen(true);
  }

  const handleDelete = (storeCode: string) => {
    // Di sini Anda perlu API DELETE /stores/{store_code}
    console.log("Deleting store:", storeCode)
  }

  if (isLoading) return <div className="text-center py-12">Loading store data...</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
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
                    <DropdownMenuItem onClick={() => handleEdit(store.store_code)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(store.store_code)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-mono text-muted-foreground">{store.store_code}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {stores.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No stores found for this user.</p>
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