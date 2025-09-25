"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { BannerImages } from "@/types" // <-- Impor tipe baru

export function BannersTable() {
  const [bannerUrls, setBannerUrls] = useState<BannerImages>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  
  useEffect(() => {
    const fetchBanners = async () => {
        setIsLoading(true);
        try {
            // Panggil endpoint /banners/active
            const data = await api.get<BannerImages>('/banners/active');
            setBannerUrls(data);
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Gagal memuat data banner.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    fetchBanners();
  }, [toast]);

  const handleDelete = (urlToDelete: string) => {
    if (window.confirm(`Yakin ingin menghapus banner ini?`)) {
        // Logika untuk menghapus banner (membutuhkan API DELETE by URL atau ID)
        // Untuk sementara, kita hanya hapus dari state
        setBannerUrls(prev => prev.filter(url => url !== urlToDelete));
        toast({ title: "Berhasil!", description: `Banner berhasil dihapus.` });
    }
  }
  
  if (isLoading) return <div className="text-center py-12">Memuat data banner...</div>;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-muted-foreground">Preview Gambar</TableHead>
            <TableHead className="text-muted-foreground">URL</TableHead>
            <TableHead className="text-muted-foreground w-12 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bannerUrls.map((url, index) => (
            <TableRow key={index} className="border-border hover:bg-muted/50">
              <TableCell>
                <div className="relative h-20 w-40 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={url}
                    alt={`Banner ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
                  />
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="font-mono text-sm text-foreground truncate">{url}</p>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(url)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {bannerUrls.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Tidak ada banner aktif yang ditemukan.</p>
        </div>
      )}
    </div>
  )
}