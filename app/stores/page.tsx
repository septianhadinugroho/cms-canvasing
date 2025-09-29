"use client"

import { useState, useCallback } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StoresGrid } from "@/components/stores-grid"
import { StoreForm } from "@/components/store-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Store } from "@/types"

export default function StoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const handleRefresh = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  const handleAddStore = async (storeData: Partial<Store>) => {
    // PENTING: Backend untuk POST /stores belum diimplementasikan di kode yang Anda berikan.
    // Kode di bawah akan gagal sampai API-nya dibuat di backend.
    try {
      await api.post("/stores", storeData);
      toast({ title: "Success!", description: "Store successfully added." });
      setIsAddDialogOpen(false);
      handleRefresh();
    } catch (error: any) {
      toast({ 
        title: "Feature In Development", 
        description: `Could not add store: The backend API for adding a store is not implemented yet.`, 
        variant: "destructive" 
      });
    }
  };

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
                <h1 className="text-3xl font-semibold text-foreground mb-2">Store Management</h1>
                <p className="text-muted-foreground">Manage all your sales locations and stores</p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Store
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Add New Store</DialogTitle>
                  </DialogHeader>
                  <StoreForm 
                    onClose={() => setIsAddDialogOpen(false)} 
                    onSave={handleAddStore}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by store name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <StoresGrid 
              searchTerm={searchTerm} 
              refreshKey={refreshKey} 
              onRefresh={handleRefresh} 
            />
          </div>
        </main>
      </div>
    </div>
  )
}