// components/products-table.tsx

"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm } from "./product-form"
import { ProductDetailView } from "./product-detail-view"
import { Edit, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, Eye } from "lucide-react"
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
  items: Omit<Product, 'price'>[];
  pagination: Pagination;
}
interface ProductsTableProps {
  searchTerm: string;
  storeCode: string;
  refreshKey: number;
}

export function ProductsTable({ searchTerm, storeCode, refreshKey }: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (currentPage !== 1) {
        setCurrentPage(1);
    }
  }, [searchTerm]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { storeCode, search: searchTerm, page: currentPage, limit: 10 };
      const response = await api.get<ProductApiResponse>('/products', params);
      
      const productsWithPrice = response.items.map(p => ({
        ...p,
        price: p.tiers?.[0]?.price ? parseFloat(p.tiers[0].price) : 0,
      }));

      setProducts(productsWithPrice);
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
  }, [fetchProducts, refreshKey, currentPage, searchTerm]);

  const convertGoogleDriveUrl = (url: string): string => {
    const regex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return url;
  };

  const getFirstImageUrl = (imageUrl: string | null | undefined): string => {
    const placeholder = "/placeholder.svg";
    if (!imageUrl) return placeholder;
    let urlToTest = imageUrl;
    try {
      const parsed = JSON.parse(imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) urlToTest = parsed[0];
    } catch (e) { /* Bukan JSON string, lanjutkan */ }
    
    if (typeof urlToTest === 'string' && (urlToTest.startsWith('http') || urlToTest.startsWith('/'))) {
      return convertGoogleDriveUrl(urlToTest);
    }
    return placeholder;
  };

  const handleViewDetail = (product: Product) => {
    setDetailProduct(product);
    setIsDetailOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = async (productId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        try {
            await api.delete(`/products/${productId}`);
            toast({ title: "Berhasil!", description: "Produk berhasil dihapus." });
            fetchProducts();
        } catch (error: any) {
            toast({
                title: "Gagal Menghapus",
                description: error.message || "Tidak dapat menghapus produk.",
                variant: "destructive",
            });
        }
    }
  }

  const handleProductSave = () => {
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    fetchProducts();
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
              <TableRow key={product.product_id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={getFirstImageUrl(product.url_image)}
                        alt={product.product_name || "Gambar produk"}
                        fill
                        className="object-cover"
                        unoptimized
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
                      <DropdownMenuItem onClick={() => handleViewDetail(product)}><Eye className="h-4 w-4 mr-2" />Lihat Detail</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(product)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.product_id)}><Trash2 className="h-4 w-4 mr-2" />Hapus</DropdownMenuItem>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onClose={() => setIsEditDialogOpen(false)}
              onSave={handleProductSave}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{detailProduct?.product_name || "Detail Produk"}</DialogTitle>
          </DialogHeader>
           {detailProduct && <ProductDetailView product={detailProduct} />}
        </DialogContent>
      </Dialog>
    </>
  )
}