// components/product-form.tsx

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Product, ProductFormData } from "@/types"
import { api } from "@/lib/api"
import { X, Plus } from "lucide-react"

interface ProductFormProps {
  product?: Product
  onClose: () => void
  onSave: () => void
}

export function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const isEditMode = !!product;

  const [formData, setFormData] = useState({
    product_name: product?.product_name || "",
    sku: product?.sku || "",
    barcode: product?.barcode || "",
    slug: product?.slug || "",
    short_name: product?.short_name || "",
    unit: product?.unit || "",
    description: product?.description || "",
    category_id: product?.category_id || "",
    store_id: product?.store_id || "",
    price: product?.price || 0,
    price_promo: 0,
  });
  
  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    if (!product?.url_image) return [""];
    try {
      const parsed = JSON.parse(product.url_image);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
    } catch {
      return [String(product.url_image)];
    }
  });

  const { toast } = useToast()

  // Mengisi form data ketika properti product berubah (untuk mode edit)
  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name || "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        slug: product.slug || "",
        short_name: product.short_name || "",
        unit: product.unit || "",
        description: product.description || "",
        category_id: product.category_id || "",
        store_id: product.store_id || "",
        price: product.price || 0,
        price_promo: 0, 
      });

      try {
        const parsedImages = JSON.parse(product.url_image);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          setImageUrls(parsedImages);
        } else {
          setImageUrls([product.url_image || ""]);
        }
      } catch {
        setImageUrls([product.url_image || ""]);
      }

    }
  }, [product]);

  const convertGoogleDriveUrl = (url: string): string => {
    const regex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return url;
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };
  
  const handleUrlInputBlur = (index: number) => {
    const newUrls = [...imageUrls];
    const convertedUrl = convertGoogleDriveUrl(newUrls[index]);
    if (newUrls[index] !== convertedUrl) {
        newUrls[index] = convertedUrl;
        setImageUrls(newUrls);
    }
  };

  const addImageUrlInput = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageUrlInput = (index: number) => {
    if (imageUrls.length > 1) {
      const newUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newUrls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_name || !formData.sku || (!isEditMode && !formData.store_id) || !formData.category_id) {
      toast({
        title: "Error",
        description: "Field yang wajib diisi tidak boleh kosong.",
        variant: "destructive",
      })
      return
    }

    const processedImageUrls = imageUrls
      .map(url => convertGoogleDriveUrl(url))
      .filter(url => url.trim() !== "");

    const payload: ProductFormData & { url_image: string, store_id?: string } = {
        ...formData,
        url_image: JSON.stringify(processedImageUrls),
    };

    if (!isEditMode) {
        payload.store_id = formData.store_id;
    }

    try {
      if (isEditMode && product) {
        await api.put(`/products/${product.product_id}`, payload);
        toast({ title: "Berhasil!", description: "Produk berhasil diupdate." });
      } else {
        await api.post("/products", payload);
        toast({ title: "Berhasil!", description: "Produk berhasil ditambahkan." });
      }
      onSave();
      onClose();
    } catch (error: any) {
       toast({
        title: "Terjadi Kesalahan",
        description: error.message || "Gagal menyimpan produk.",
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-1 pr-4">
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
                <Input id="unit" value={formData.unit} onChange={(e) => setFormData(p => ({ ...p, unit: e.target.value }))} placeholder="Contoh: PCS" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="category_id">ID Kategori</Label>
                <Input id="category_id" type="text" value={formData.category_id} onChange={(e) => setFormData(p => ({ ...p, category_id: e.target.value }))} placeholder="Contoh: 43" required />
            </div>
          </div>
           {!isEditMode && (
             <div className="space-y-2">
                <Label htmlFor="store_id">ID Toko</Label>
                <Input id="store_id" type="text" value={formData.store_id} onChange={(e) => setFormData(p => ({ ...p, store_id: e.target.value }))} placeholder="Contoh: 10997" required />
              </div>
           )}
           <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Harga</Label>
                    <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} placeholder="150000" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price_promo">Harga Promo</Label>
                    <Input id="price_promo" type="number" value={formData.price_promo} onChange={(e) => setFormData(p => ({ ...p, price_promo: parseFloat(e.target.value) || 0 }))} placeholder="99000" />
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>URL Gambar</Label>
        {imageUrls.map((url, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={url}
              onChange={(e) => handleImageUrlChange(index, e.target.value)}
              onBlur={() => handleUrlInputBlur(index)}
              placeholder="Tempel link Google Drive di sini"
            />
            {imageUrls.length > 1 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => removeImageUrlInput(index)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
         <Button type="button" variant="outline" size="sm" onClick={addImageUrlInput} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Tambah URL
        </Button>
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