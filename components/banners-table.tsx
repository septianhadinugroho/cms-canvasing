"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BannerForm } from "./banner-form"
import { Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Banner } from "@/types"

export function BannersTable() {
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsEditDialogOpen(true);
  }

  const handleDelete = async (bannerId: number) => {
    if (window.confirm(`Are you sure you want to delete this banner?`)) {
        try {
            await api.delete(`/banners/${bannerId}`);
            toast({ title: "Success!", description: `Banner successfully deleted.` });
            fetchBanners();
        } catch(error: any) {
            toast({ title: "Failed", description: error.message, variant: "destructive"});
        }
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
                  <div className="relative h-20 w-40 rounded-md overflow-hidden bg-muted">
                    <Image 
                      src={banner.image_url} 
                      alt={`Banner ${banner.id}`} 
                      fill 
                      className="object-cover" 
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }} 
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={banner.status === 1 ? "default" : "secondary"}>
                    {banner.status === 1 ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(banner)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(banner.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
    </>
  )
}