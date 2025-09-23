"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Store {
  id: string
  name: string
  address: string
  city: string
  phone: string
  manager: string
  status: "active" | "inactive" | "maintenance"
  totalProducts: number
  monthlySales: number
}

interface StoreFormProps {
  store?: Store
  onClose: () => void
  onSave?: (store: Store) => void
}

export function StoreForm({ store, onClose, onSave }: StoreFormProps) {
  const [formData, setFormData] = useState({
    name: store?.name || "",
    address: store?.address || "",
    city: store?.city || "",
    phone: store?.phone || "",
    manager: store?.manager || "",
    status: store?.status || "active",
  })

  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.address || !formData.city || !formData.phone || !formData.manager) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      })
      return
    }

    const storeData = {
      id: store?.id || Date.now().toString(),
      ...formData,
      totalProducts: store?.totalProducts || 0,
      monthlySales: store?.monthlySales || 0,
    }

    if (onSave) {
      onSave(storeData)
    }

    console.log("Store form submitted:", storeData)

    toast({
      title: "Berhasil!",
      description: store ? "Toko berhasil diupdate" : "Toko berhasil ditambahkan",
    })

    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informasi Toko
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Toko</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Masukkan nama toko"
                  className="bg-background border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Kota</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, city: value }))}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Pilih kota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jakarta">Jakarta</SelectItem>
                    <SelectItem value="bandung">Bandung</SelectItem>
                    <SelectItem value="surabaya">Surabaya</SelectItem>
                    <SelectItem value="medan">Medan</SelectItem>
                    <SelectItem value="yogyakarta">Yogyakarta</SelectItem>
                    <SelectItem value="semarang">Semarang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Masukkan alamat lengkap toko"
                className="bg-background border-border min-h-20"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager">Nama Manager</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => setFormData((prev) => ({ ...prev, manager: e.target.value }))}
                  placeholder="Masukkan nama manager"
                  className="bg-background border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+62 21 1234 5678"
                  className="bg-background border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Toko</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive" | "maintenance") =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Nonaktif</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          {store ? "Update Toko" : "Tambah Toko"}
        </Button>
      </div>
    </form>
  )
}
