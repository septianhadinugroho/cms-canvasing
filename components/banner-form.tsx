"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface Banner {
  id: string
  image_url: string
  text: string
  status: number // 0 or 1
  created_at?: string
  updated_at?: string
}

interface BannerFormProps {
  banner?: Banner
  onClose: () => void
  onSave?: (banner: Banner) => void
}

export function BannerForm({ banner, onClose, onSave }: BannerFormProps) {
  const [formData, setFormData] = useState({
    image_url: banner?.image_url || "",
    text: banner?.text || "",
    status: banner?.status !== undefined ? banner.status : 1,
  })

  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image_url) {
      toast({
        title: "Error",
        description: "URL Gambar wajib diisi",
        variant: "destructive",
      })
      return
    }

    const bannerData = {
      id: banner?.id || Date.now().toString(),
      ...formData,
    }

    if (onSave) {
      onSave(bannerData)
    }

    toast({
      title: "Berhasil!",
      description: banner ? "Banner berhasil diupdate" : "Banner berhasil ditambahkan",
    })

    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image_url">URL Gambar</Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
            placeholder="https://example.com/image.png"
            className="bg-background border-border"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="text">Teks Banner</Label>
          <Textarea
            id="text"
            value={formData.text}
            onChange={(e) => setFormData((prev) => ({ ...prev, text: e.target.value }))}
            placeholder="Masukkan teks deskripsi untuk banner"
            className="bg-background border-border"
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="status"
            checked={formData.status === 1}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, status: checked ? 1 : 0 }))
            }
          />
          <Label htmlFor="status">Aktif</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          {banner ? "Update Banner" : "Tambah Banner"}
        </Button>
      </div>
    </form>
  )
}