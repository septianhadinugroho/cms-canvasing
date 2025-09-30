"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StoreForm } from "./store-form"
import { Edit, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, Store as StoreIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Store } from "@/types"

interface StoresGridProps {
  searchTerm: string
  selectedStoreCode: string; // Prop baru untuk filter
  endpoint: string
  onRefresh: () => void
}

export function StoresGrid({ searchTerm, selectedStoreCode, endpoint, onRefresh }: StoresGridProps) {
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [stores, setStores] = useState<Store[]>([])
  const [filteredStores, setFilteredStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 9;
  const { toast } = useToast()

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    try {
        const fetchedStores = await api.get<Store[]>(endpoint);
        setStores(fetchedStores);
    } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to load store data.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }, [toast, endpoint]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores, onRefresh]);

  // Logika filter diperbarui
  useEffect(() => {
    let results = stores;

    // 1. Filter berdasarkan store code yang dipilih
    if (selectedStoreCode) {
      results = results.filter(store => store.store_code === selectedStoreCode);
    }

    // 2. Filter berdasarkan teks pencarian dari hasil sebelumnya
    if (searchTerm) {
      results = results.filter(store =>
        store.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.store_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStores(results);
    setCurrentPage(1); // Reset ke halaman pertama setiap kali filter berubah
  }, [searchTerm, selectedStoreCode, stores]);

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setIsEditDialogOpen(true);
  }

  const handleUpdateStore = async (storeData: Partial<Store>) => {
    if (!storeData.id) return;
    try {
      await api.put(`/stores/${storeData.id}`, storeData);
      toast({ title: "Success!", description: "Store successfully updated." });
      setIsEditDialogOpen(false);
      setEditingStore(null);
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update the store.",
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = async (storeId: string) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
        try {
            await api.delete(`/stores/${storeId}`);
            toast({ title: "Success!", description: "Store successfully deleted." });
            onRefresh();
        } catch (error: any) {
            toast({
                title: "Delete Failed",
                description: error.message || "Could not delete store.",
                variant: "destructive"
            });
        }
    }
  }

  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore);
  const totalPages = Math.ceil(filteredStores.length / storesPerPage);

  if (isLoading) return <div className="text-center py-12">Loading store data...</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentStores.map((store) => (
          <Card key={store.id} className="bg-card border-border hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader className="flex-grow">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-muted rounded-full">
                    <StoreIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 mr-2">
                    <CardTitle className="text-lg font-semibold text-foreground">{store.store_name}</CardTitle>
                    <p className="text-sm font-mono text-muted-foreground">{store.store_code}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(store)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(store.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mt-2 truncate h-10">{store.address}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStores.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No stores found with current filters.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit Store</DialogTitle></DialogHeader>
          {editingStore && (
            <StoreForm
              store={editingStore}
              onClose={() => { setIsEditDialogOpen(false); setEditingStore(null); }}
              onSave={handleUpdateStore}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}