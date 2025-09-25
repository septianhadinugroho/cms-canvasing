"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm } from "./product-form"
import { Edit, Trash2, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Product } from "@/types"

interface Pagination {
  totalData: number
  totalPages: number
  currentPage: number
  perPage: number
}

interface ProductApiResponse {
  items: Product[]
  pagination: Pagination
}

interface ProductsTableProps {
  searchTerm: string
  storeCode: string
}

export function ProductsTable({ searchTerm, storeCode }: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { storeCode, search: searchTerm, page: currentPage, limit: 10 };
      const response = await api.get<ProductApiResponse>('/products', params);
      setProducts(response.items);
      setPagination(response.pagination);
    } catch (error: any) {
      toast({
        title: "Terjadi Kesalahan",
        description: error.message || "Gagal memuat data produk dari server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [storeCode, searchTerm, currentPage, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fungsi helper untuk mendapatkan URL gambar pertama
  const getFirstImageUrl = (imageUrl: string | string[]): string => {
    if (typeof imageUrl === 'string') {
      try {
        // Coba parse jika string adalah array JSON
        const parsed = JSON.parse(imageUrl);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      } catch (e) {
        // Jika bukan JSON atau parsing gagal, kembalikan string aslinya
        return imageUrl;
      }
    }
    // Jika sudah berupa array
    if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      return imageUrl[0];
    }
    // Fallback jika tidak ada gambar
    return "/placeholder.svg";
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (product: Product) => { /* ... */ }
  const handleProductUpdate = (updatedProductData: Partial<Product>) => { /* ... */ }

  if (isLoading) {
    return <div className="text-center py-12">Memuat data produk...</div>
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          {/* ... TableHeader ... */}
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                      <Image
                        // Menggunakan fungsi helper di sini
                        src={getFirstImageUrl(product.url_image)}
                        alt={product.product_name}
                        fill
                        className="object-cover"
                        // Tambahkan error handler untuk gambar yang rusak
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
                      />
                    </div>
                    <div>
                      <div className="font-medium">{product.product_name}</div>
                      <div className="text-sm text-muted-foreground">{product.short_name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{product.sku}</TableCell>
                <TableCell>{product.name_category}</TableCell>
                <TableCell>{product.stock} {product.unit}</TableCell>
                <TableCell>Rp {(product.price ?? 0).toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(product)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product)}><Trash2 className="h-4 w-4 mr-2" />Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.length === 0 && !isLoading && (
          <div className="text-center py-12"><p className="text-muted-foreground">Tidak ada produk ditemukan.</p></div>
        )}
      </div>

      {/* ... Paginasi dan Dialog ... */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /> Sebelumnya</Button>
            <span className="text-sm">Halaman {pagination.currentPage} dari {pagination.totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === pagination.totalPages}>Selanjutnya <ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit Produk</DialogTitle></DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onClose={() => { setIsEditDialogOpen(false); setEditingProduct(null); }}
              onSave={handleProductUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}