"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MediaGallery } from "@/components/media-gallery"
import { MediaUpload } from "@/components/media-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Search, Grid, List, FolderPlus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

export default function MediaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [folderFilter, setFolderFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

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
                <h1 className="text-3xl font-semibold text-foreground mb-2">Media Library</h1>
                <p className="text-muted-foreground">Kelola semua gambar dan file media Anda</p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border bg-transparent text-foreground hover:bg-accent"
                  onClick={() => {
                    console.log("Creating new folder...")
                    // In real implementation, you'd show a dialog to create folder
                    toast({
                      title: "Folder baru dibuat",
                      description: "Folder berhasil ditambahkan ke media library",
                    })
                  }}
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Folder Baru
                </Button>
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Media
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Upload Media Baru</DialogTitle>
                    </DialogHeader>
                    <MediaUpload onClose={() => setIsUploadDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari media..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-background border-border text-foreground">
                    <SelectValue placeholder="Tipe File" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="image">Gambar</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Dokumen</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={folderFilter} onValueChange={setFolderFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-background border-border text-foreground">
                    <SelectValue placeholder="Folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Folder</SelectItem>
                    <SelectItem value="products">Produk</SelectItem>
                    <SelectItem value="stores">Toko</SelectItem>
                    <SelectItem value="banners">Banner</SelectItem>
                    <SelectItem value="logos">Logo</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border border-border rounded-md bg-background">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <MediaGallery
              searchTerm={searchTerm}
              typeFilter={typeFilter}
              folderFilter={folderFilter}
              viewMode={viewMode}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
