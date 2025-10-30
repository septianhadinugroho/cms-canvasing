"use client"

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; 

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const imageUrls: string[] = (() => {
    try {
      const parsed = JSON.parse(product.url_image);
      return Array.isArray(parsed) ? parsed : [product.url_image];
    } catch {
      return [product.url_image || "/placeholder.svg"];
    }
  })();

  const [mainImage, setMainImage] = useState(imageUrls[0] || "/placeholder.svg");

  const formatCurrency = (value: number | string) => {
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) { return '-'; }
    // Jangan tampilkan 0
    if (numberValue === 0) { return '-'; } 
    return `Rp ${numberValue.toLocaleString('id-ID')}`;
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto p-1 pr-4">
      {/* Galeri Gambar */}
      <div>
        {/* ... (Kode galeri gambar tetap sama) ... */}
        <div className="relative aspect-square w-full rounded-lg overflow-hidden border mb-4">
          <Image
            src={mainImage}
            alt={product.product_name}
            fill
            className="object-cover"
            onError={() => setMainImage('/placeholder.svg')}
          />
        </div>
        {imageUrls.length > 1 && (
          <div className="flex gap-2">
            {imageUrls.map((url, index) => (
              <Button
                key={index} variant="outline"
                className={cn("relative aspect-square w-16 h-16 rounded-md overflow-hidden p-0", mainImage === url ? "border-primary" : "")}
                onClick={() => setMainImage(url)}
                aria-label={`View image ${index + 1}`}
              >
                <Image src={url} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Info Produk */}
      <div className="space-y-6">
        <div>
          <Badge variant="secondary" className="mb-2">{product.name_category}</Badge>
          <h1 className="text-3xl font-bold">{product.product_name}</h1>
          {product.short_name && <p className="text-lg text-muted-foreground">{product.short_name}</p>}
        </div>

        {/* --- HAPUS CARD "BASE PRICE" DARI SINI --- */}

        {/* Tampilkan Stok & VAT di sini saja */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Stock</span>
              <span className="font-semibold">{product.stock} {product.unit}</span>
            </div>
            {product.vat != null && product.vat > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">VAT</span>
                <span className="font-semibold">{product.vat}%</span>
              </div>
            )}
          </CardContent>
        </Card>


        {/* --- DIPERBARUI: Tampilkan SEMUA Harga di sini --- */}
        {product.tiers && product.tiers.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Product Prices</h3>
            <Card>
              <CardContent className="p-4 space-y-3">
                {product.tiers
                  .sort((a, b) => a.min_quantity - b.min_quantity)
                  .map((tier, index) => {
                    
                    // --- Logika Prioritas 3-Level (Custom > Promo > Price) ---
                    const priceNormal = parseFloat(String(tier.price))
                    const pricePromo = parseFloat(String(tier.price_promo))
                    // Tambahkan '|| "0"' untuk mengatasi undefined/null
                    const priceCustom = parseFloat(String(tier.custom_price || "0")) 

                    let finalPrice = priceNormal
                    let hasStrikethrough = false

                    if (priceCustom > 0) {
                      finalPrice = priceCustom
                      hasStrikethrough = true
                    } else if (pricePromo > 0) {
                      finalPrice = pricePromo
                      hasStrikethrough = true
                    }
                    // --- AKHIR LOGIKA ---
                    
                    return (
                      <div key={index} className="flex justify-between items-center text-sm gap-4">
                        <span className="text-muted-foreground whitespace-nowrap">
                          {/* Beri label khusus untuk tier 1 */}
                          {tier.min_quantity === 1 ? <strong>Min. 1 {product.unit}</strong> : `Min. ${tier.min_quantity} ${product.unit}`}
                        </span>
                        <div className="text-right flex-shrink-0">
                          {hasStrikethrough && (
                            <span className="text-xs text-muted-foreground line-through mr-2">
                              {formatCurrency(priceNormal)}
                            </span>
                          )}
                          <span className="font-semibold text-primary">
                            {formatCurrency(finalPrice)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </CardContent>
            </Card>
          </div>
        )}
        {/* --- AKHIR PEMBARUAN --- */}

        {product.description && (
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        )}

        <div>
           <h3 className="font-semibold mb-2">Other Details</h3>
           <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">SKU</span>
              <span className="font-mono">{product.sku}</span>
              <span className="text-muted-foreground">Barcode</span>
              <span className="font-mono">{product.barcode || '-'}</span>
              <span className="text-muted-foreground">Dept. Code</span>
              <span className="font-mono">{product.departmentCode || '-'}</span>
              <span className="text-muted-foreground">Product ID</span>
              <span className="font-mono">{product.product_id}</span>
              {/* --- BARIS BARU --- */}
              <span className="text-muted-foreground">Store ID</span>
              <span className="font-mono">{product.store_id}</span>
           </div>
        </div>
      </div>
    </div>
  );
}