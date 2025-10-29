"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Product, TierPrice } from "@/types"

// Definisikan state untuk form tier BARU
interface NewTierForm {
  min_quantity: string;
  price: string;
  price_promo: string;
  custom_price: string;
}

const initialFormState: NewTierForm = {
  min_quantity: "",
  price: "",
  price_promo: "0",
  custom_price: "0",
}

interface TierPriceModalProps {
  product: Product;
  children: React.ReactNode; 
  onTiersUpdate: () => void;
}

// Helper untuk format mata uang
const formatCurrency = (value: number | string) => {
  const num = Number(value);
  if (isNaN(num) || num === 0) return "-";
  return `Rp ${num.toLocaleString("id-ID")}`;
}

export function TierPriceModal({
  product,
  children,
  onTiersUpdate,
}: TierPriceModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tiers, setTiers] = useState<TierPrice[]>(product.tiers || [])
  const [newTier, setNewTier] = useState<NewTierForm>(initialFormState)
  const { toast } = useToast()

  useEffect(() => {
    // Selalu update 'tiers' state jika data produk dari parent berubah
    setTiers(product.tiers || [])
  }, [product.tiers, isOpen]) // 'isOpen' memastikan data fresh saat modal dibuka

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof NewTierForm
  ) => {
    setNewTier(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleAddTier = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const minQty = parseInt(newTier.min_quantity, 10)
    const price = parseFloat(newTier.price)

    // --- 1. VALIDASI BARU: Blokir Min Qty 1 ---
    if (minQty === 1) {
      toast({
        title: "Invalid Quantity",
        description: "Cannot add tier for Min. Qty 1. Please update it from the main product form.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    // --- AKHIR VALIDASI BARU ---

    // --- 2. VALIDASI DUPLIKAT (Tetap ada) ---
    const existingTier = tiers.find(t => t.min_quantity === minQty);
    if (existingTier) {
      toast({
        title: "Duplicate Quantity",
        description: `A tier for Min. Quantity ${minQty} already exists.`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // 3. Validasi input
    if (!minQty || minQty <= 0 || !price || price <= 0) {
      toast({
        title: "Invalid Input",
        description: "Min. Quantity and Price are required and must be > 0.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // 4. Buat payload (ini sudah benar)
    const payload = {
      store_id: product.store_id,
      product_id: product.product_id,
      min_quantity: minQty,
      price: price,
      price_promo: parseFloat(newTier.price_promo) || 0,
      custom_price: parseFloat(newTier.custom_price) || 0,
    }

    // 5. Kirim ke BE
    try {
      await api.post("/products/tiering", payload)
      toast({
        title: "Success!",
        description: "New price tier added.",
      })
      setNewTier(initialFormState) 
      onTiersUpdate() 
    } catch (error: any) {
      toast({
        title: "An error occurred",
        description: error.response?.data?.message || error.message || "Failed to save the price tier.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Manage Prices for: {product.product_name}
          </DialogTitle>
        </DialogHeader>

        {/* Bagian 1: Tampilkan Tier yang Ada */}
        <div className="max-h-[300px] overflow-y-auto border rounded-md">
          <Table>
            <TableHeader className="sticky top-0 bg-secondary">
              <TableRow>
                <TableHead>Min. Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Promo Price</TableHead>
                <TableHead>Custom Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers.length > 0 ? (
                tiers
                  .sort((a, b) => a.min_quantity - b.min_quantity)
                  .map((tier, index) => (
                    <TableRow key={index}>
                      <TableCell>{tier.min_quantity}</TableCell>
                      <TableCell>{formatCurrency(tier.price)}</TableCell>
                      <TableCell>{formatCurrency(tier.price_promo)}</TableCell>
                      <TableCell>{formatCurrency(tier.custom_price || 0)}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No prices set. Add one below.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Bagian 2: Form untuk Menambah Tier Baru */}
        <form onSubmit={handleAddTier} className="space-y-4 pt-4">
          <h4 className="font-medium">Add New Price Tier</h4>
          
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-2">
              <Label htmlFor="min_quantity">
                Min. Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="min_quantity"
                type="number"
                placeholder="e.g., 5"
                value={newTier.min_quantity}
                onChange={e => handleFormChange(e, "min_quantity")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 95000"
                value={newTier.price}
                onChange={e => handleFormChange(e, "price")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_promo">
                Promo Price <span className="text-red-500">**</span>
              </Label>
              <Input
                id="price_promo"
                type="number"
                placeholder="e.g., 90000"
                value={newTier.price_promo}
                onChange={e => handleFormChange(e, "price_promo")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom_price">
                Custom Price <span className="text-red-500">**</span>
              </Label>
              <Input
                id="custom_price"
                type="number"
                placeholder="e.g., 85000"
                value={newTier.custom_price}
                onChange={e => handleFormChange(e, "custom_price")}
              />
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p><span className="text-red-500 inline-block w-3">*</span> Required</p>
            <p><span className="text-red-500 inline-block w-3">**</span> Optional</p>
          </div>
          
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2"
            >
              {isLoading ? "Saving..." : "Add New Tier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}