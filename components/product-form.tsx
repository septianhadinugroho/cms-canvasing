"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
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

interface ProductFormProps {
  product?: Product
  onClose: () => void
  onSave?: (product: Product) => void
}

export function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    store: product?.store || "",
    status: product?.status || "active",
    description: product?.description || "",
    image: product?.image || "",
  })

  const [imagePreview, setImagePreview] = useState(product?.image || "")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.category || !formData.price || !formData.store) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      })
      return
    }

    const productData = {
      id: product?.id || Date.now().toString(),
      ...formData,
    }

    if (onSave) {
      onSave(productData)
    }

    console.log("Form submitted:", productData)

    toast({
      title: "Berhasil!",
      description: product ? "Produk berhasil diupdate" : "Produk berhasil ditambahkan",
    })

    onClose()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)

      toast({
        title: "Gambar berhasil diupload",
        description: `File ${file.name} berhasil ditambahkan`,
      })
    }
  }

  const removeImage = () => {
    setImagePreview("")
    setFormData((prev) => ({ ...prev, image: "" }))
    toast({
      title: "Gambar dihapus",
      description: "Gambar produk berhasil dihapus",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="image">Gambar Produk</Label>
          <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-6 relative">
              {imagePreview ? (
                <div className="relative">
                  <div className="relative h-32 w-full rounded-md overflow-hidden bg-muted">
                    <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Klik untuk upload gambar</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG hingga 5MB</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" id="image-upload" />
              <label htmlFor="image-upload" className="absolute inset-0 w-full h-full cursor-pointer" />
            </CardContent>
          </Card>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Produk</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Masukkan nama produk"
              className="bg-background border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sepatu">Sepatu</SelectItem>
                <SelectItem value="tas">Tas</SelectItem>
                <SelectItem value="jaket">Jaket</SelectItem>
                <SelectItem value="aksesoris">Aksesoris</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseInt(e.target.value) || 0 }))}
                placeholder="0"
                className="bg-background border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stok</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData((prev) => ({ ...prev, stock: Number.parseInt(e.target.value) || 0 }))}
                placeholder="0"
                className="bg-background border-border"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="store">Toko</Label>
          <Select value={formData.store} onValueChange={(value) => setFormData((prev) => ({ ...prev, store: value }))}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Pilih toko" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jakarta">Jakarta Pusat</SelectItem>
              <SelectItem value="bandung">Bandung</SelectItem>
              <SelectItem value="surabaya">Surabaya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: "active" | "inactive" | "out-of-stock") =>
              setFormData((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
              <SelectItem value="out-of-stock">Habis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Masukkan deskripsi produk"
          className="bg-background border-border min-h-20"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          {product ? "Update Produk" : "Tambah Produk"}
        </Button>
      </div>
    </form>
  )
}
