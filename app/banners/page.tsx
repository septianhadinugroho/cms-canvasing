"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { BannersTable } from "@/components/banners-table"
import { BannerForm } from "@/components/banner-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function BannersPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { isAuthenticated } = useAuth()
    
  // Mock onSave function for adding new banner
  const handleSaveNewBanner = (banner: any) => {
    console.log("New banner to be added:", banner);
    // Here you would typically call an API to add the banner
    // and then refresh the banner list in BannersTable.
    // For now, this is a placeholder.
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
                <h1 className="text-3xl font-semibold text-foreground mb-2">Manajemen Banner</h1>
                <p className="text-muted-foreground">Kelola semua banner promosi untuk website Anda</p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Banner
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Tambah Banner Baru</DialogTitle>
                  </DialogHeader>
                  <BannerForm 
                    onClose={() => setIsAddDialogOpen(false)}
                    onSave={handleSaveNewBanner}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <BannersTable />

          </div>
        </main>
      </div>
    </div>
  )
}