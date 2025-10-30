"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { BannerForm } from "./banner-form"
import { Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Banner } from "@/types"

// Menerima `key` sebagai prop untuk mekanisme refresh
export function BannersTable({ key: refreshKey }: { key: number }) {
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // State untuk image preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  
  const { toast } = useToast()

  const fetchBanners = useCallback(async () => {
    setIsLoading(true);
    try {
        const data = await api.get<Banner[]>('/banners/active');
        setBanners(data);
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  // useEffect sekarang bergantung pada `refreshKey`
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners, refreshKey]);

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsEditDialogOpen(true);
  }

  // Fungsi untuk membuka preview gambar
  const handleImagePreview = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
    setIsPreviewOpen(true);
  }

  // Fungsi delete yang dipanggil setelah konfirmasi
  const performDelete = async (bannerId: number) => {
    try {
        await api.delete(`/banners/${bannerId}`);
        toast({ title: "Success!", description: `Banner successfully deleted.` });
        fetchBanners(); // Langsung fetch ulang data setelah hapus
    } catch(error: any) {
        toast({ title: "Failed", description: error.message, variant: "destructive"});
    }
  }
  
  if (isLoading) return <div className="text-center py-12">Loading banners...</div>;

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  {/* Gambar kini bisa diklik untuk preview + aria-label */}
                  <button
                    className="relative h-20 w-40 rounded-md overflow-hidden bg-muted cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleImagePreview(banner.image_url)}
                    aria-label={`Preview banner ${banner.id}`}
                  >
                    <Image 
                      src={banner.image_url} 
                      alt={`Banner ${banner.id}`} 
                      fill 
                      className="object-cover" 
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }} 
                    />
                  </button>
                </TableCell>
                <TableCell>
                  <Badge variant={banner.status === 1 ? "default" : "secondary"}>
                    {banner.status === 1 ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(banner)}
                      aria-label={`Edit banner ${banner.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* Tombol Delete dengan AlertDialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          aria-label={`Delete banner ${banner.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will delete the banner. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => performDelete(banner.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {banners.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No active banners found.</p>
          </div>
        )}
      </div>

      {/* Dialog untuk Edit Banner (sudah ada) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Banner</DialogTitle></DialogHeader>
          {editingBanner && (
            <BannerForm
              banner={editingBanner}
              onClose={() => setIsEditDialogOpen(false)}
              onSave={() => {
                setIsEditDialogOpen(false);
                fetchBanners();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog baru untuk Image Preview */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Banner Preview</DialogTitle>
          </DialogHeader>
          {previewImageUrl && (
            <div className="relative mt-4 max-h-[80vh] w-full">
              <Image 
                src={previewImageUrl} 
                alt="Banner Preview" 
                width={1200}
                height={675}
                className="object-contain w-full h-full" 
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }} 
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}