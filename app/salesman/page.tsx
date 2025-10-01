// app/salesman/page.tsx
"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SalesmanTable } from "@/components/salesman-table"
import { AddSalesmanForm } from "@/components/add-salesman-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function SalesmanPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1)
  }

  const handleSave = () => {
    setIsAddDialogOpen(false);
    handleRefresh();
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
                <h1 className="text-3xl font-semibold text-foreground mb-2">Salesman Management</h1>
                <p className="text-muted-foreground">View, update, and manage salesmen in the system</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Salesman
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Add New Salesman</DialogTitle>
                  </DialogHeader>
                  <AddSalesmanForm
                    onClose={() => setIsAddDialogOpen(false)}
                    onSave={handleSave}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <SalesmanTable key={refreshKey} onRefresh={handleRefresh} />

          </div>
        </main>
      </div>
    </div>
  )
}