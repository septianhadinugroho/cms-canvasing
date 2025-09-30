"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Store } from "@/types"

interface StoreFormProps {
  store?: Store
  onClose: () => void
  onSave: (storeData: Partial<Store>) => Promise<void> // Diubah untuk menandakan ini adalah proses async
}

export function StoreForm({ store, onClose, onSave }: StoreFormProps) {
  const [formData, setFormData] = useState({
    store_name: store?.store_name || "",
    store_code: store?.store_code || "",
    address: store?.address || "",
    latitude: store?.latitude || "",
    longitude: store?.longitude || "",
    mid: store?.mid || "",
    tid: store?.tid || "",
  })
  const [isSaving, setIsSaving] = useState(false); // State untuk loading

  // Jadikan fungsi ini async
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true); // Mulai loading

    const storeDataToSave: Partial<Store> = {
      id: store?.id,
      ...formData,
      latitude: parseFloat(String(formData.latitude)) || 0,
      longitude: parseFloat(String(formData.longitude)) || 0,
    };
    
    // Tunggu proses onSave selesai
    await onSave(storeDataToSave);
    
    setIsSaving(false); // Hentikan loading
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (kode form lainnya tidak berubah) ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="store_name">Store Name</Label>
                <Input id="store_name" value={formData.store_name} onChange={(e) => setFormData(p => ({ ...p, store_name: e.target.value }))} placeholder="e.g., Canvasing Grand Indonesia" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="store_code">Store Code</Label>
                <Input id="store_code" value={formData.store_code} onChange={(e) => setFormData(p => ({ ...p, store_code: e.target.value }))} placeholder="e.g., JKT-001" required />
            </div>
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" value={formData.address} onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))} placeholder="Enter full store address" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" type="number" step="any" value={formData.latitude} onChange={(e) => setFormData(p => ({ ...p, latitude: e.target.value }))} placeholder="-6.123456" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" type="number" step="any" value={formData.longitude} onChange={(e) => setFormData(p => ({ ...p, longitude: e.target.value }))} placeholder="106.123456" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="mid">MID</Label>
                <Input id="mid" value={formData.mid} onChange={(e) => setFormData(p => ({ ...p, mid: e.target.value }))} placeholder="Merchant ID" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="tid">TID</Label>
                <Input id="tid" value={formData.tid} onChange={(e) => setFormData(p => ({ ...p, tid: e.target.value }))} placeholder="Terminal ID" />
            </div>
        </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSaving}>
          {isSaving ? "Saving..." : (store ? "Update Store" : "Add Store")}
        </Button>
      </div>
    </form>
  )
}