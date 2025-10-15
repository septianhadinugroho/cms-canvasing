"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapModal } from "@/components/map-modal" // Import the new MapModal component
import type { Store } from "@/types"

interface StoreFormProps {
  store?: Store
  onClose: () => void
  onSave: (storeData: Partial<Store>) => Promise<void>
}

export function StoreForm({ store, onClose, onSave }: StoreFormProps) {
  const [formData, setFormData] = useState({
    store_name: store?.store_name || "",
    store_code: store?.store_code || "",
    address: store?.address || "",
    latitude: store?.latitude || 0,
    longitude: store?.longitude || 0,
    mid: store?.mid || "",
    tid: store?.tid || "",
    hotline: store?.hotline || "",
    mac_address: store?.mac_address || "",
    phone_number: store?.phone_number || "",
    status: (store?.status === 0 || store?.status === 'inactive') ? 'inactive' : 'active',
    npwp: store?.npwp || "",
    ip_address: store?.ip_address || "",
    ip_pos_web: store?.ip_pos_web || "",
    cashier_id: store?.cashier_id || "9000",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isMapModalOpen, setMapModalOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const statusAsInteger = formData.status === 'active' ? 1 : 0

    const storeDataToSave: Partial<Store> = {
      id: store?.id,
      ...formData,
      status: statusAsInteger,
    }
    
    await onSave(storeDataToSave)
    
    setIsSaving(false)
  }

  const handleMapSave = (location: { address: string; latitude: number; longitude: number }) => {
    setFormData(prev => ({
      ...prev,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    }))
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
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
            <Button type="button" variant="link" onClick={() => setMapModalOpen(true)}>
              Set Address on Map
            </Button>
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

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="hotline">Hotline</Label>
                <Input id="hotline" value={formData.hotline || ''} onChange={(e) => setFormData(p => ({ ...p, hotline: e.target.value }))} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input id="phone_number" value={formData.phone_number || ''} onChange={(e) => setFormData(p => ({ ...p, phone_number: e.target.value }))} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="mac_address">MAC Address</Label>
                <Input id="mac_address" value={formData.mac_address || ''} onChange={(e) => setFormData(p => ({ ...p, mac_address: e.target.value }))} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="npwp">NPWP</Label>
                <Input id="npwp" value={formData.npwp || ''} onChange={(e) => setFormData(p => ({ ...p, npwp: e.target.value }))} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(p => ({ ...p, status: value }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="ip_address">IP Address</Label>
                <Input id="ip_address" value={formData.ip_address || ''} onChange={(e) => setFormData(p => ({ ...p, ip_address: e.target.value }))} />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="ip_pos_web">IP POS Web</Label>
                <Input id="ip_pos_web" value={formData.ip_pos_web || ''} onChange={(e) => setFormData(p => ({ ...p, ip_pos_web: e.target.value }))} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="cashier_id">Cashier ID</Label>
                <Input id="cashier_id" value={formData.cashier_id || ''} onChange={(e) => setFormData(p => ({ ...p, cashier_id: e.target.value }))} disabled />
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
      
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setMapModalOpen(false)}
        onSave={handleMapSave}
        initialPosition={store?.latitude && store?.longitude ? { lat: store.latitude, lng: store.longitude } : undefined}
      />
    </>
  )
}