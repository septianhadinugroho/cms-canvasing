// components/product-detail-view.tsx

"use client"

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Import the Button component

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

  return (
    <div className="grid md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto p-1 pr-4">
      {/* Galeri Gambar */}
      <div>
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
                key={index}
                variant="outline"
                className={cn(
                  "relative aspect-square w-16 h-16 rounded-md overflow-hidden p-0",
                  mainImage === url ? "border-primary" : ""
                )}
                onClick={() => setMainImage(url)}
                aria-label={`View image ${index + 1}`} // Accessibility fix
              >
                <Image
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
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

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Harga</span>
              <span className="text-2xl font-bold text-primary">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Stok</span>
              <span className="font-semibold">{product.stock} {product.unit}</span>
            </div>
          </CardContent>
        </Card>

        {product.description && (
          <div>
            <h3 className="font-semibold mb-2">Deskripsi</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        )}

        <div>
           <h3 className="font-semibold mb-2">Detail Lainnya</h3>
           <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">SKU</span>
              <span className="font-mono">{product.sku}</span>
              <span className="text-muted-foreground">Barcode</span>
              <span className="font-mono">{product.barcode || '-'}</span>
              <span className="text-muted-foreground">Product ID</span>
              <span className="font-mono">{product.product_id}</span>
           </div>
        </div>
      </div>
    </div>
  );
}