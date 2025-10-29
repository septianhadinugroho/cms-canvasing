"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
// 'TierPrice' JANGAN di-import di sini
import type { Product, ProductFormData, Store, Category } from "@/types" 
import { api } from "@/lib/api"
import { X, Plus, ChevronsUpDown, Check, BadgePercent } from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TierPriceModal } from "./tier-price-modal"

// ... (Interface CategoryWithChildren dan flattenCategories tetap sama) ...
interface CategoryWithChildren {
  id: number; name: string; slug: string; children?: CategoryWithChildren[];
}
const flattenCategories = (cats: CategoryWithChildren[]): Category[] => {
  let flatList: Category[] = [];
  cats.forEach(cat => {
    flatList.push({ id: cat.id, name: cat.name, slug: cat.slug });
    if (cat.children && cat.children.length > 0) {
      flatList = flatList.concat(flattenCategories(cat.children));
    }
  });
  return flatList;
};

interface ProductFormProps {
  product?: Product
  onClose: () => void
  onSave: () => void
}

export function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const isEditMode = !!product;

  // KEMBALIKAN 'price', 'price_promo', 'custom_price' ke state
  const [formData, setFormData] = useState({
    product_name: product?.product_name || "",
    sku: product?.sku || "",
    barcode: product?.barcode || "",
    slug: product?.slug || "",
    url_image: product?.url_image || "",
    short_name: product?.short_name || "",
    unit: product?.unit || "UNIT",
    description: product?.description || "",
    category_id: product?.category_id?.toString() || "",
    store_id: product?.store_id || "",
    vat: product?.vat?.toString() || "",
    departmentCode: product?.departmentCode || "",
    stock: product?.stock?.toString() || "0",
    
    // Ini adalah state untuk tier min_quantity: 1
    price: "0",
    price_promo: "0",
    custom_price: "0",
  });
  
  // ... (useState untuk imageUrls, categories, stores, popovers tetap sama) ...
  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    if (!product?.url_image) return [""];
    try { const parsed = JSON.parse(product.url_image);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
    } catch { return [String(product.url_image)]; }
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isCategoryPopoverOpen, setCategoryPopoverOpen] = useState(false)
  const [isStorePopoverOpen, setStorePopoverOpen] = useState(false)
  const { toast } = useToast()

  // ... (useEffect fetchData tetap sama) ...
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, storesRes] = await Promise.all([
          api.get<CategoryWithChildren[]>('/categories'),
          api.get<Store[]>('/stores/all')
        ]);
        const flatCategories = flattenCategories(categoriesRes);
        setCategories(flatCategories);
        setStores(storesRes);
      } catch (error) {
        console.error("Failed to fetch categories or stores", error);
        toast({ title: "Error", description: "Failed to load category or store data.", variant: "destructive" })
      }
    };
    fetchData();
  }, [toast]);


  useEffect(() => {
    if (product && categories.length > 0) {
      
      let foundCategoryId = "";
      // ... (logika foundCategoryId tetap sama) ...
      if (product.category_id) { foundCategoryId = product.category_id.toString(); } 
      else if (product.name_category) {
        const slug = product.name_category.trim().toUpperCase();
        const catBySlug = categories.find((cat) => (cat.slug || "").trim().toUpperCase() === slug);
        if (catBySlug) { foundCategoryId = catBySlug.id.toString(); } 
        else { const catByName = categories.find((cat) => (cat.name || "").trim().toUpperCase() === slug);
           if (catByName) { foundCategoryId = catByName.id.toString(); }
        }
      }

      // Cari data tier untuk min_quantity: 1
      // Gunakan 'product.price' sebagai fallback jika 'tiers' tidak ada
      const tierOne = product.tiers?.find(t => t.min_quantity === 1);

      setFormData({
        product_name: product.product_name || "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        slug: product.slug || "",
        url_image: product.url_image || "",
        short_name: product.short_name || "",
        unit: product.unit || "UNIT",
        description: product.description || "",
        category_id: foundCategoryId,
        store_id: product.store_id || "",
        vat: product.vat?.toString() || "",
        departmentCode: product.departmentCode || "",
        stock: product.stock?.toString() || "0",
        
        // Isi state dengan data tier 1
        price: tierOne?.price?.toString() || product.price?.toString() || "0",
        price_promo: tierOne?.price_promo?.toString() || "0",
        custom_price: tierOne?.custom_price?.toString() || "0",
      });

      // ... (logika imageUrls tetap sama) ...
      try {
        const parsedImages = JSON.parse(product.url_image);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          setImageUrls(parsedImages);
        } else { setImageUrls([product.url_image || ""]); }
      } catch { setImageUrls([product.url_image || ""]); }
    
    } else if (!isEditMode) {
      // Untuk produk BARU, kita siapkan input harga
      // 'price' akan dikirim ke 'createProduct'
      setFormData(prev => ({
        ...prev,
        price: "",
        price_promo: "0",
        custom_price: "0",
      }));
    }
  }, [product, categories, isEditMode]);

  // ... (handler image tetap sama) ...
  const convertGoogleDriveUrl = (url: string): string => {
    const regex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) { return `https://drive.google.com/uc?export=view&id=${match[1]}`; }
    return url;
  };
  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls]; newUrls[index] = value; setImageUrls(newUrls);
  };
  const handleUrlInputBlur = (index: number) => {
    const newUrls = [...imageUrls];
    const convertedUrl = convertGoogleDriveUrl(newUrls[index]);
    if (newUrls[index] !== convertedUrl) { newUrls[index] = convertedUrl; setImageUrls(newUrls); }
  };
  const addImageUrlInput = () => { setImageUrls([...imageUrls, ""]); };
  const removeImageUrlInput = (index: number) => {
    if (imageUrls.length > 1) { const newUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newUrls);
    }
  };

  // Handler untuk input harga (tier 1)
  const handlePriceChange = (field: 'price' | 'price_promo' | 'custom_price', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_name || !formData.sku || (!isEditMode && !formData.store_id) || !formData.category_id) {
      toast({ title: "Error", description: "Required fields cannot be empty.", variant: "destructive" });
      return
    }
    // Validasi harga tier 1 (wajib ada 'price')
    if (parseFloat(formData.price) <= 0) {
      toast({ title: "Invalid Price", description: "Price for Min. Qty 1 must be greater than 0.", variant: "destructive" });
      return
    }

    const processedImageUrls = imageUrls
      .map(url => convertGoogleDriveUrl(url))
      .filter(url => url.trim() !== "");
      
    // PERBAIKI PAYLOAD - Kembalikan price, price_promo, custom_price
    const payload: ProductFormData & { url_image: string, store_id?: string } = {
        ...formData,
        vat: parseFloat(formData.vat) || 0,
        departmentCode: formData.departmentCode,
        stock: parseInt(formData.stock, 10) || 0,
        url_image: JSON.stringify(processedImageUrls),
        
        // Ini akan dikirim ke BE dan digunakan oleh 'updateProduct' / 'createProduct'
        price: parseFloat(formData.price) || 0,
        price_promo: parseFloat(formData.price_promo) || 0,
        custom_price: parseFloat(formData.custom_price) || 0,
    };

    if (!isEditMode) {
        payload.store_id = formData.store_id;
    }

    try {
      if (isEditMode && product) {
        // Panggilan ini sekarang akan BERHASIL karena payload-nya lengkap
        await api.put(`/products/${product.product_id}`, payload);
        toast({ title: "Success!", description: "Product updated successfully." });
      } else {
        // 'createProduct' di BE Anda juga butuh 'price', 'price_promo', 'custom_price'
        await api.post("/products", payload);
        toast({ title: "Success!", description: "Product added successfully." });
      }
      onSave(); // onSave akan memicu refresh data
      onClose();
    } catch (error: any) {
       toast({
        title: "An error occurred",
        description: error.response?.data?.message || error.message || "Failed to save the product.",
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-1 pr-4">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* ... (Field Nama, Short Name, Slug, VAT, Dept Code tetap sama) ... */}
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
          {/* ... (Field SKU, Barcode, Unit, Kategori, Store tetap sama) ... */}
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
                  <SelectTrigger><SelectValue placeholder="Select a unit" /></SelectTrigger>
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
                    <Button variant="outline" role="combobox" aria-expanded={isCategoryPopoverOpen} className="w-full justify-between font-normal">
                      {formData.category_id ? categories.find((cat) => cat.id.toString() === formData.category_id)?.name : "Select category..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandList><CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((cat) => (
                            <CommandItem
                              key={cat.id} value={`${cat.id} - ${cat.name}`}
                              onSelect={() => {
                                setFormData(prev => ({ ...prev, category_id: cat.id.toString() }))
                                setCategoryPopoverOpen(false)
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", formData.category_id === cat.id.toString() ? "opacity-100" : "opacity-0")} />
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
                    <Button variant="outline" role="combobox" aria-expanded={isStorePopoverOpen} className="w-full justify-between font-normal">
                      {formData.store_id ? stores.find((store) => store.id.toString() === formData.store_id)?.store_name : "Select store..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search store..." />
                      <CommandList><CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup>
                          {stores.map((store) => (
                            <CommandItem
                              key={store.id} value={`${store.id} - ${store.store_name}`}
                              onSelect={() => {
                                setFormData(prev => ({ ...prev, store_id: store.id.toString() }))
                                setStorePopoverOpen(false)
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", formData.store_id === store.id.toString() ? "opacity-100" : "opacity-0")} />
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
           
           <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData(p => ({ ...p, stock: e.target.value }))} placeholder="100" required />
          </div>
        </div>
      </div>

      {/* --- BAGIAN BARU: Input Harga untuk Tier 1 & Tombol Modal --- */}
      <Card>
        <CardHeader>
          <CardTitle>Product Prices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Price for Min. Quantity: 1</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 100000"
                  value={formData.price}
                  onChange={e => handlePriceChange('price', e.target.value)}
                  disabled={!isEditMode && !formData.store_id} // Disable jika add mode & store blm dipilih
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_promo">Promo Price <span className="text-red-500">**</span></Label>
                <Input
                  id="price_promo"
                  type="number"
                  placeholder="e.g., 90000"
                  value={formData.price_promo}
                  onChange={e => handlePriceChange('price_promo', e.target.value)}
                  disabled={!isEditMode && !formData.store_id}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom_price">Custom Price <span className="text-red-500">**</span></Label>
                <Input
                  id="custom_price"
                  type="number"
                  placeholder="e.g., 85000"
                  value={formData.custom_price}
                  onChange={e => handlePriceChange('custom_price', e.target.value)}
                  disabled={!isEditMode && !formData.store_id}
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1 mt-3">
              <p><span className="text-red-500 inline-block w-3">*</span> Required</p>
              <p><span className="text-red-500 inline-block w-3">**</span> Optional (Price will be used if 0)</p>
            </div>
          </div>
          
          {/* Tombol Modal HANYA muncul saat EDIT MODE */}
          {isEditMode && product && (
            <div className="border-t pt-4">
               <h4 className="text-sm font-medium mb-2">Other Prices (Wholesale)</h4>
               <p className="text-sm text-muted-foreground mb-3">
                 Add or view other price tiers (e.g., for Min. Qty 5, 10, etc.)
               </p>
              <TierPriceModal product={product} onTiersUpdate={onSave}>
                <Button type="button" variant="outline" size="sm">
                  <BadgePercent className="h-4 w-4 mr-2" />
                  Manage Other Prices
                </Button>
              </TierPriceModal>
            </div>
          )}
        </CardContent>
      </Card>
      {/* --- AKHIR BAGIAN BARU --- */}


      {/* ... (Bagian Image URLs dan Description tetap sama) ... */}
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

      {/* Footer Bawah */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{product ? "Update Product" : "Add Product"}</Button>
      </div>
    </form>
  )
}