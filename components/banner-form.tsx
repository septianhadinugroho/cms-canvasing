"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { Banner, BannerFormData } from "@/types"
import { api } from "@/lib/api"

interface BannerFormProps {
  banner?: Banner
  onClose: () => void
  onSave: () => void
}

export function BannerForm({ banner, onClose, onSave }: BannerFormProps) {
  const [formData, setFormData] = useState({
    image_url: banner?.image_url || "",
    status: banner?.status !== undefined ? banner.status : 1,
  })

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image_url) {
      toast({ title: "Error", description: "URL Gambar wajib diisi", variant: "destructive" })
      return
    }

    try {
        const dataToSave: BannerFormData = {
            image_url: formData.image_url,
            status: formData.status,
        };

        if (banner && banner.id) {
            await api.put(`/banners/${banner.id}`, dataToSave);
            toast({ title: "Berhasil!", description: "Banner berhasil diupdate." });
        } else {
            await api.post("/banners", dataToSave);
            toast({ title: "Berhasil!", description: "Banner baru berhasil ditambahkan." });
        }
        onSave();
        onClose();
    } catch (error: any) {
        toast({ title: "Gagal", description: error.message, variant: "destructive" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image_url">URL Gambar</Label>
          <Input id="image_url" value={formData.image_url} onChange={(e) => setFormData(p => ({ ...p, image_url: e.target.value }))} placeholder="https://example.com/image.png" required />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="status" checked={formData.status === 1} onCheckedChange={(checked) => setFormData(p => ({ ...p, status: checked ? 1 : 0 }))}/>
          <Label htmlFor="status">Aktif</Label>
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
        <Button type="submit">{banner ? "Update Banner" : "Tambah Banner"}</Button>
      </div>
    </form>
  )
}