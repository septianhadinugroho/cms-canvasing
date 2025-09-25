"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types" // <-- Impor dari file terpusat

interface ProductFormProps {
  product?: Product
  onClose: () => void
  onSave?: (productData: Partial<Product>) => void // Mengirim data parsial untuk update
}

export function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  // State hanya untuk field yang ada di form
  const [formData, setFormData] = useState({
    product_name: product?.product_name || "",
    sku: product?.sku || "",
    barcode: product?.barcode || "",
    slug: product?.slug || "",
    url_image: product?.url_image || "",
    short_name: product?.short_name || "",
    unit: product?.unit || "",
    description: product?.description || "",
    category_id: product?.category_id || 0,
  })

  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.product_name || !formData.sku) {
      toast({
        title: "Error",
        description: "Nama Produk dan SKU wajib diisi.",
        variant: "destructive",
      })
      return
    }

    // Data yang dikirim hanya yang diubah oleh form
    const productDataToSave: Partial<Product> = {
      id: product?.id,
      ...formData,
    }
    
    if (onSave) {
      onSave(productDataToSave)
    }

    toast({
      title: "Berhasil!",
      description: product ? "Produk berhasil diupdate" : "Produk berhasil ditambahkan",
    })

    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product_name">Nama Produk</Label>
            <Input id="product_name" value={formData.product_name} onChange={(e) => setFormData((prev) => ({ ...prev, product_name: e.target.value }))} placeholder="Contoh: Nike Air Max" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="short_name">Nama Pendek</Label>
            <Input id="short_name" value={formData.short_name} onChange={(e) => setFormData((prev) => ({ ...prev, short_name: e.target.value }))} placeholder="Contoh: Air Max" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} placeholder="contoh: nike-air-max" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" value={formData.sku} onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))} placeholder="NK-AM-001" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input id="barcode" value={formData.barcode} onChange={(e) => setFormData((prev) => ({ ...prev, barcode: e.target.value }))} placeholder="887229000123" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" value={formData.unit} onChange={(e) => setFormData(p => ({ ...p, unit: e.target.value }))} placeholder="Contoh: pasang, buah" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="category_id">ID Kategori</Label>
                <Input id="category_id" type="number" value={formData.category_id} onChange={(e) => setFormData(p => ({ ...p, category_id: parseInt(e.target.value) || 0 }))} placeholder="1" required />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url_image">URL Gambar</Label>
        <Input id="url_image" value={formData.url_image} onChange={(e) => setFormData(p => ({ ...p, url_image: e.target.value }))} placeholder="https://example.com/image.png" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Masukkan deskripsi produk" rows={3} />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
        <Button type="submit">{product ? "Update Produk" : "Tambah Produk"}</Button>
      </div>
    </form>
  )
}