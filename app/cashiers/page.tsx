// app/cashiers/page.tsx
"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CashiersTable } from "@/components/cashiers-table"
import { CashierForm } from "@/components/cashier-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function CashiersPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  const handleSave = () => {
    setIsAddDialogOpen(false)
    setRefreshKey(prevKey => prevKey + 1)
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
                <h1 className="text-3xl font-semibold text-foreground mb-2">Cashier Management</h1>
                <p className="text-muted-foreground">Manage all cashier accounts in the system</p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Cashier
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Add New Cashier</DialogTitle>
                  </DialogHeader>
                  <CashierForm
                    onClose={() => setIsAddDialogOpen(false)}
                    onSave={handleSave}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <CashiersTable key={refreshKey} onRefresh={() => setRefreshKey(prevKey => prevKey + 1)} />

          </div>
        </main>
      </div>
    </div>
  )
}