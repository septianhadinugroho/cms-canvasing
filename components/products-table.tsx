"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm } from "./product-form"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api" // <-- IMPORT API SERVICE KITA

// Interface disesuaikan dengan skema DB baru
interface Product {
  id: string
  sku: string
  barcode: string
  product_name: string
  slug: string
  url_image: string
  short_name: string
  unit: string
  description: string
  category_id: number
}

interface ProductsTableProps {
  searchTerm: string
}

export function ProductsTable({ searchTerm }: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        // Menggunakan api service yang sudah dibuat
        const fetchedProducts = await api.get<Product[]>(`/products?search=${searchTerm}`)
        setProducts(fetchedProducts)
      } catch (error) {
        toast({
          title: "Terjadi Kesalahan",
          description: "Gagal memuat data produk dari server.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [searchTerm, toast])

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (product: Product) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${product.product_name}?`)) {
        // Nanti di sini akan ada logic untuk memanggil API DELETE
        setProducts((prev) => prev.filter((p) => p.id !== product.id))
        toast({
            title: "Berhasil!",
            description: `${product.product_name} berhasil dihapus`,
        })
    }
  }
  
  const handleProductUpdate = (updatedProduct: Product) => {
    // Nanti di sini akan ada logic untuk memanggil API PUT/PATCH
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
  }


  if (isLoading) {
    return <div className="text-center py-12">Memuat data produk...</div>
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Produk</TableHead>
              <TableHead className="text-muted-foreground">SKU</TableHead>
              <TableHead className="text-muted-foreground">Unit</TableHead>
              <TableHead className="text-muted-foreground">ID Kategori</TableHead>
              <TableHead className="text-muted-foreground w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-border hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={product.url_image || "/placeholder.svg"}
                        alt={product.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{product.product_name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{product.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{product.sku}</TableCell>
                <TableCell className="capitalize">{product.unit}</TableCell>
                <TableCell>{product.category_id}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {products.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada produk yang ditemukan</p>
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onClose={() => {
                setIsEditDialogOpen(false)
                setEditingProduct(null)
              }}
              onSave={handleProductUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}