"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BannerForm } from "./banner-form"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

interface Banner {
  id: string
  image_url: string
  text: string
  status: number
  created_at?: string
}

export function BannersTable() {
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  
  useEffect(() => {
    const fetchBanners = async () => {
        setIsLoading(true);
        try {
            const data = await api.get<Banner[]>('/banners');
            setBanners(data);
        } catch (error) {
            toast({ title: "Error", description: "Gagal memuat data banner.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    fetchBanners();
  }, [toast]);

  const getStatusBadge = (status: number) => {
    return status === 1 ? <Badge variant="default">Aktif</Badge> : <Badge variant="secondary">Nonaktif</Badge>
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (banner: Banner) => {
    if (window.confirm(`Yakin ingin menghapus banner ini?`)) {
      setBanners((prev) => prev.filter((b) => b.id !== banner.id))
      toast({ title: "Berhasil!", description: `Banner berhasil dihapus` })
    }
  }

  const handleSave = (banner: Banner) => {
    const isNew = !banners.some(b => b.id === banner.id);
    if (isNew) {
      setBanners(prev => [banner, ...prev]);
    } else {
      setBanners(prev => prev.map(b => b.id === banner.id ? banner : b));
    }
  }
  
  if (isLoading) return <div className="text-center py-12">Memuat data banner...</div>;

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Gambar</TableHead>
              <TableHead className="text-muted-foreground">Teks</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Dibuat</TableHead>
              <TableHead className="text-muted-foreground w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id} className="border-border hover:bg-muted/50">
                <TableCell>
                  <div className="relative h-16 w-32 rounded-md overflow-hidden bg-muted">
                    <Image src={banner.image_url || "/placeholder.svg"} alt={banner.text} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="max-w-xs"><p className="font-medium text-foreground truncate">{banner.text}</p></TableCell>
                <TableCell>{getStatusBadge(banner.status)}</TableCell>
                <TableCell>{banner.created_at ? new Date(banner.created_at).toLocaleDateString("id-ID") : '-'}</TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem onClick={() => handleEdit(banner)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(banner)}><Trash2 className="h-4 w-4 mr-2" />Hapus</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {banners.length === 0 && !isLoading && (
          <div className="text-center py-12"><p className="text-muted-foreground">Tidak ada banner yang ditemukan</p></div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Banner</DialogTitle></DialogHeader>
          {editingBanner && (
            <BannerForm
              banner={editingBanner}
              onClose={() => { setIsEditDialogOpen(false); setEditingBanner(null); }}
              onSave={handleSave}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}