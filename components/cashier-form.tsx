// components/cashier-form.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { Cashier } from "@/types"

interface CashierFormProps {
  cashier?: Cashier
  onClose: () => void
  onSave: () => void
}

export function CashierForm({ cashier, onClose, onSave }: CashierFormProps) {
  const [formData, setFormData] = useState({
    name: cashier?.name || "",
    username: cashier?.username || "",
    password: "",
    store_code: cashier?.store_code || "",
  })

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Dummy save
    toast({ title: "Success!", description: `Cashier ${cashier ? 'updated' : 'added'} successfully.` });
    onSave();
    onClose();
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
            <Input id="username" value={formData.username} onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))} placeholder="john.doe" required />
        </div>
        {!cashier && (
          <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))} required />
          </div>
        )}
        <div className="space-y-2">
            <Label htmlFor="store_code">Store Code</Label>
            <Input id="store_code" value={formData.store_code} onChange={(e) => setFormData(p => ({ ...p, store_code: e.target.value }))} placeholder="STORE-001" required />
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{cashier ? "Update Cashier" : "Add Cashier"}</Button>
      </div>
    </form>
  )
}