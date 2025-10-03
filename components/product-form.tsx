// components/product-form.tsx

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Product, ProductFormData, Store, Category } from "@/types"
import { api } from "@/lib/api"
import { X, Plus, ChevronsUpDown, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


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
    url_image: product?.url_image || "",
    short_name: product?.short_name || "",
    unit: product?.unit || "UNIT",
    description: product?.description || "",
    category_id: product?.category_id || "",
    store_id: product?.store_id || "",
    price: product?.price?.toString() || "",
    price_promo: "0",
    vat: product?.vat?.toString() || "",
    departmentCode: product?.departmentCode || "",
    stock: product?.stock?.toString() || "0",
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

  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isCategoryPopoverOpen, setCategoryPopoverOpen] = useState(false)
  const [isStorePopoverOpen, setStorePopoverOpen] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, storesRes] = await Promise.all([
          api.get<Category[]>('/categories'),
          api.get<Store[]>('/stores/all')
        ]);
        
        // Log data kategori untuk debugging
        console.log("Categories fetched from API:", categoriesRes);

        setCategories(categoriesRes);
        setStores(storesRes);
      } catch (error) {
        console.error("Failed to fetch categories or stores", error);
        toast({
          title: "Error",
          description: "Failed to load category or store data.",
          variant: "destructive",
        })
      }
    };

    fetchData();
  }, [toast]);


  // Fill form data when product prop changes (for edit mode)
  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name || "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        slug: product.slug || "",
        url_image: product.url_image || "",
        short_name: product.short_name || "",
        unit: product.unit || "UNIT",
        description: product.description || "",
        category_id: product.category_id || "",
        store_id: product.store_id || "",
        price: product.price?.toString() || "",
        price_promo: "0", 
        vat: product.vat?.toString() || "",
        departmentCode: product.departmentCode || "",
        stock: product.stock?.toString() || "0",
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
        description: "Required fields cannot be empty.",
        variant: "destructive",
      })
      return
    }

    const processedImageUrls = imageUrls
      .map(url => convertGoogleDriveUrl(url))
      .filter(url => url.trim() !== "");
      
    const payload: ProductFormData & { url_image: string, store_id?: string } = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        price_promo: parseFloat(formData.price_promo) || 0,
        vat: parseFloat(formData.vat) || 0,
        departmentCode: formData.departmentCode,
        stock: parseInt(formData.stock, 10) || 0,
        url_image: JSON.stringify(processedImageUrls),
    };

    if (!isEditMode) {
        payload.store_id = formData.store_id;
    }

    try {
      if (isEditMode && product) {
        await api.put(`/products/${product.product_id}`, payload);
        toast({ title: "Success!", description: "Product updated successfully." });
      } else {
        await api.post("/products", payload);
        toast({ title: "Success!", description: "Product added successfully." });
      }
      onSave();
      onClose();
    } catch (error: any) {
       toast({
        title: "An error occurred",
        description: error.message || "Failed to save the product.",
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-1 pr-4">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product_name">Product Name</Label>
            <Input id="product_name" value={formData.product_name} onChange={(e) => setFormData((prev) => ({ ...prev, product_name: e.target.value }))} placeholder="e.g., Nike Air Max" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="short_name">Short Name</Label>
            <Input id="short_name" value={formData.short_name} onChange={(e) => setFormData((prev) => ({ ...prev, short_name: e.target.value }))} placeholder="e.g., Air Max" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} placeholder="e.g., nike-air-max" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vat">VAT</Label>
            <Input id="vat" type="number" value={formData.vat} onChange={(e) => setFormData((prev) => ({ ...prev, vat: e.target.value }))} placeholder="e.g., 10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="departmentCode">Department Code</Label>
            <Input id="departmentCode" value={formData.departmentCode} onChange={(e) => setFormData((prev) => ({ ...prev, departmentCode: e.target.value }))} placeholder="e.g., DPT-001" />
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
                <Select value={formData.unit} onValueChange={(value) => setFormData(p => ({ ...p, unit: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNIT">UNIT</SelectItem>
                    <SelectItem value="PCS">PCS</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <Popover open={isCategoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isCategoryPopoverOpen}
                      className="w-full justify-between font-normal"
                    >
                      {formData.category_id
                        ? categories.find((cat) => cat.id.toString() === formData.category_id)?.name
                        : "Select category..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((cat) => (
                            <CommandItem
                              key={cat.id}
                              value={`${cat.id} - ${cat.name}`} // Diubah untuk search by ID or name
                              onSelect={() => {
                                setFormData(prev => ({ ...prev, category_id: cat.id.toString() }))
                                setCategoryPopoverOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.category_id === cat.id.toString() ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {/* Tampilkan ID dan Nama */}
                              <div className="flex items-center w-full">
                                <span className="font-mono text-xs w-12 text-right mr-2 opacity-70">{cat.id}</span>
                                <span className="truncate">{cat.name}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
            </div>
          </div>
           {!isEditMode && (
             <div className="space-y-2">
                <Label htmlFor="store_id">Store</Label>
                <Popover open={isStorePopoverOpen} onOpenChange={setStorePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isStorePopoverOpen}
                      className="w-full justify-between font-normal"
                    >
                      {formData.store_id
                        ? stores.find((store) => store.id.toString() === formData.store_id)?.store_name
                        : "Select store..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search store..." />
                      <CommandList>
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup>
                          {stores.map((store) => (
                            <CommandItem
                              key={store.id}
                              value={`${store.id} - ${store.store_name}`} // Diubah untuk search by ID or name
                              onSelect={() => {
                                setFormData(prev => ({ ...prev, store_id: store.id.toString() }))
                                setStorePopoverOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.store_id === store.id.toString() ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {/* Tampilkan ID dan Nama */}
                              <div className="flex items-center w-full">
                                <span className="font-mono text-xs w-12 text-right mr-2 opacity-70">{store.id}</span>
                                <span className="truncate">{store.store_name}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
           )}
           <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))} placeholder="150000" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price_promo">Promo Price</Label>
                    <Input id="price_promo" type="number" value={formData.price_promo} onChange={(e) => setFormData(p => ({ ...p, price_promo: e.target.value }))} placeholder="99000" />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData(p => ({ ...p, stock: e.target.value }))} placeholder="100" required />
            </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image URLs</Label>
        {imageUrls.map((url, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={url}
              onChange={(e) => handleImageUrlChange(index, e.target.value)}
              onBlur={() => handleUrlInputBlur(index)}
              placeholder="https://images.tokopedia.net/"
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
            Add URL
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Enter product description" rows={3} />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{product ? "Update Product" : "Add Product"}</Button>
      </div>
    </form>
  )
}