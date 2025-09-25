"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Store } from "@/types" // <-- Impor tipe baru

interface StoreFormProps {
  store?: Store
  onClose: () => void
  onSave?: (storeData: Partial<Store>) => void
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

  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.store_name || !formData.store_code) {
      toast({
        title: "Error",
        description: "Store Name and Store Code are required.",
        variant: "destructive",
      })
      return
    }

    const storeDataToSave: Partial<Store> = {
      id: store?.id,
      ...formData,
      latitude: parseFloat(String(formData.latitude)) || 0,
      longitude: parseFloat(String(formData.longitude)) || 0,
    };
    
    if (onSave) {
      onSave(storeDataToSave)
    }

    toast({
      title: "Success!",
      description: store ? "Store successfully updated" : "Store successfully added",
    })

    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          {store ? "Update Store" : "Add Store"}
        </Button>
      </div>
    </form>
  )
}