"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm } from "./product-form"
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  store: string
  status: "active" | "inactive" | "out-of-stock"
  image: string
  description: string
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Nike Air Max 270",
    category: "sepatu",
    price: 1250000,
    stock: 25,
    store: "jakarta",
    status: "active",
    image: "/product-1.png",
    description: "Sepatu olahraga premium dengan teknologi Air Max",
  },
  {
    id: "2",
    name: "Adidas Ultraboost 22",
    category: "sepatu",
    price: 1800000,
    stock: 0,
    store: "bandung",
    status: "out-of-stock",
    image: "/product-2.png",
    description: "Sepatu lari dengan teknologi Boost terdepan",
  },
  {
    id: "3",
    name: "Tas Ransel Eiger",
    category: "tas",
    price: 450000,
    stock: 15,
    store: "surabaya",
    status: "active",
    image: "/eiger-backpack.jpg",
    description: "Tas ransel outdoor berkualitas tinggi",
  },
  {
    id: "4",
    name: "Jaket Bomber Uniqlo",
    category: "jaket",
    price: 599000,
    stock: 8,
    store: "jakarta",
    status: "active",
    image: "/uniqlo-bomber-jacket.jpg",
    description: "Jaket bomber stylish untuk segala cuaca",
  },
  {
    id: "5",
    name: "Topi Baseball Nike",
    category: "aksesoris",
    price: 275000,
    stock: 30,
    store: "bandung",
    status: "active",
    image: "/nike-baseball-cap.jpg",
    description: "Topi baseball dengan logo Nike original",
  },
]

interface ProductsTableProps {
  searchTerm: string
  categoryFilter: string
  storeFilter: string
}

export function ProductsTable({ searchTerm, categoryFilter, storeFilter }: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const { toast } = useToast()

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStore = storeFilter === "all" || product.store === storeFilter

    return matchesSearch && matchesCategory && matchesStore
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Habis</Badge>
    }
    if (status === "active") {
      return <Badge variant="default">Aktif</Badge>
    }
    return <Badge variant="secondary">Nonaktif</Badge>
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return "text-destructive"
    if (stock < 10) return "text-yellow-500"
    return "text-foreground"
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsEditDialogOpen(true)
    toast({
      title: "Edit Produk",
      description: `Membuka form edit untuk ${product.name}`,
    })
  }

  const handleViewDetails = (product: Product) => {
    toast({
      title: "Detail Produk",
      description: `${product.name} - ${product.description}. Harga: ${formatPrice(product.price)}, Stok: ${product.stock}`,
    })
    console.log("Viewing details for:", product)
  }

  const handleDelete = (product: Product) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${product.name}?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
      toast({
        title: "Berhasil!",
        description: `${product.name} berhasil dihapus`,
      })
      console.log("Deleted product:", product)
    }
  }

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    toast({
      title: "Berhasil!",
      description: `${updatedProduct.name} berhasil diperbarui`,
    })
  }

  const handleProductAdd = (newProduct: Omit<Product, "id">) => {
    const productWithId = {
      ...newProduct,
      id: Date.now().toString(),
    }
    setProducts((prev) => [...prev, productWithId])
    toast({
      title: "Berhasil!",
      description: `${newProduct.name} berhasil ditambahkan`,
    })
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Produk</TableHead>
              <TableHead className="text-muted-foreground">Kategori</TableHead>
              <TableHead className="text-muted-foreground">Harga</TableHead>
              <TableHead className="text-muted-foreground">Stok</TableHead>
              <TableHead className="text-muted-foreground">Toko</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="border-border hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{product.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{product.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-foreground">{formatPrice(product.price)}</TableCell>
                <TableCell className={getStockStatus(product.stock)}>{product.stock} unit</TableCell>
                <TableCell className="text-foreground capitalize">{product.store}</TableCell>
                <TableCell>{getStatusBadge(product.status, product.stock)}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewDetails(product)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat Detail
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

        {filteredProducts.length === 0 && (
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
