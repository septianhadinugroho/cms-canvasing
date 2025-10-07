// app/products/page.tsx

"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ProductsTable } from "@/components/products-table"
import { ProductForm } from "@/components/product-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useDebounce } from "@/hooks/use-debounce" // Import new hook

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Apply debounce
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0); 
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  const storeCode = user?.store_code;
  
  const handleSave = () => {
    setIsAddDialogOpen(false);
    setRefreshKey(prevKey => prevKey + 1); 
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-foreground mb-2">Product Management</h1>
                <p className="text-muted-foreground">Manage all your products, SKUs, and inventory</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {storeCode ? (
              <ProductsTable 
                refreshKey={refreshKey}
                searchTerm={debouncedSearchTerm} // Use debounced value
                storeCode={storeCode} 
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Store code not found for this user.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}