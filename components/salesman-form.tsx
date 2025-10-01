"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { Salesman } from "@/types"
import { api } from "@/lib/api"

interface SalesmanFormProps {
  salesman: Salesman
  onClose: () => void
  onSave: () => void
}

export function SalesmanForm({ salesman, onClose, onSave }: SalesmanFormProps) {
  const [formData, setFormData] = useState({
    name: salesman?.name || "",
    // Default 'Y' jika properti tidak ada saat komponen pertama kali render
    isActive: salesman?.isActive ?? "Y",
    enabled: salesman?.enabled ?? "Y",
  })

  useEffect(() => {
    if (salesman) {
      setFormData({
        name: salesman.name,
        // PERBAIKAN: Berikan nilai default 'Y' jika salesman.isActive undefined
        isActive: salesman.isActive ?? "Y",
        // PERBAIKAN: Berikan nilai default 'Y' jika salesman.enabled undefined
        enabled: salesman.enabled ?? "Y",
      });
    }
  }, [salesman]);

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
        await api.put(`/salesman/${salesman.id}`, formData);
        toast({ title: "Success!", description: "Salesman updated successfully." });
        onSave();
        onClose();
    } catch (error: any) {
        toast({ title: "Failed", description: error.message, variant: "destructive" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={salesman.username} disabled />
        </div>
         <div className="space-y-2">
            <Label htmlFor="store_code">Store Code</Label>
            <Input id="store_code" value={salesman.store_code} disabled />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="isActive" checked={formData.isActive === "Y"} onCheckedChange={(checked) => setFormData(p => ({ ...p, isActive: checked ? "Y" : "N" }))}/>
          <Label htmlFor="isActive">Active</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="enabled" checked={formData.enabled === "Y"} onCheckedChange={(checked) => setFormData(p => ({ ...p, enabled: checked ? "Y" : "N" }))}/>
          <Label htmlFor="enabled">Enabled</Label>
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Update Salesman</Button>
      </div>
    </form>
  )
}