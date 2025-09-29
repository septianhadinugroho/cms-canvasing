"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm } from "./product-form"
import { Edit, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Product } from "@/types"

interface Pagination {
  totalData: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}
interface ProductApiResponse {
  items: Product[];
  pagination: Pagination;
}
interface ProductsTableProps {
  searchTerm: string;
  storeCode: string;
}

export function ProductsTable({ searchTerm, storeCode }: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
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

  const getFirstImageUrl = (imageUrl: string | null | undefined): string => {
    const placeholder = "/placeholder.svg";
    if (!imageUrl) return placeholder;
    let urlToTest = imageUrl;
    try {
      const parsed = JSON.parse(imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) urlToTest = parsed[0];
    } catch (e) { /* Bukan JSON string, lanjutkan */ }
    if (typeof urlToTest === 'string' && (urlToTest.startsWith('http') || urlToTest.startsWith('/'))) return urlToTest;
    return placeholder;
  };

  const handleEdit = async (product: Product) => {
    setIsEditDialogOpen(true);
    setIsLoadingDetails(true);
    setErrorDetails(null);
    setEditingProduct(null);

    try {
      const fullProductDataArray = await api.get<Product[]>(`/products/${product.slug}`);
      if (fullProductDataArray && fullProductDataArray.length > 0) {
        setEditingProduct(fullProductDataArray[0]);
      } else {
        throw new Error("Produk tidak ditemukan.");
      }
    } catch (error: any) {
      setErrorDetails(error.message || "Tidak dapat memuat detail produk.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      toast({ title: "Fitur Dalam Pengembangan", description: "API untuk delete produk belum tersedia di backend." });
    }
  }

  const handleProductSave = () => {
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    fetchProducts();
  }
  
  const handleDialogClose = () => {
    setIsEditDialogOpen(false);
    setErrorDetails(null);
    setEditingProduct(null);
  }

  if (isLoading) {
    return <div className="text-center py-12">Memuat data produk...</div>
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
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
                        src={getFirstImageUrl(product.url_image)}
                        alt={product.product_name || "Gambar produk"}
                        fill
                        className="object-cover"
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
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4 mr-2" />Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!products.length && !isLoading && (
          <div className="text-center py-12"><p className="text-muted-foreground">Tidak ada produk ditemukan.</p></div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /> Sebelumnya</Button>
            <span className="text-sm">Halaman {pagination.currentPage} dari {pagination.totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === pagination.totalPages}>Selanjutnya <ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
          </DialogHeader>
          
          {isLoadingDetails ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="ml-4 text-muted-foreground">Memuat detail produk...</p>
            </div>
          ) : errorDetails ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle className="h-10 w-10 text-destructive mb-4"/>
                <p className="font-semibold text-destructive">Gagal Mengambil Data</p>
                <p className="text-sm text-muted-foreground">{errorDetails}</p>
            </div>
          ) : editingProduct ? (
            <ProductForm
              product={editingProduct}
              onClose={handleDialogClose}
              onSave={handleProductSave}
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
                 <p className="text-muted-foreground">Silakan coba lagi.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}