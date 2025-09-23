"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Key, Globe, Webhook, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("cms_live_sk_1234567890abcdef")
  const [webhookUrl, setWebhookUrl] = useState("https://your-canvasing-site.com/api/webhook")
  const [webhookSecret, setWebhookSecret] = useState("whsec_1234567890abcdef")
  const [syncEnabled, setSyncEnabled] = useState(true)
  const [autoSync, setAutoSync] = useState(false)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  if (!isAuthenticated) {
    return null
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Disalin ke clipboard",
      description: "Teks berhasil disalin ke clipboard",
    })
  }

  const regenerateApiKey = () => {
    const newKey = `cms_live_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setApiKey(newKey)
    toast({
      title: "API Key diperbarui",
      description: "API Key baru berhasil dibuat",
    })
  }

  const testWebhook = async () => {
    console.log("Testing webhook connection...")
    toast({
      title: "Testing webhook...",
      description: "Mengirim test webhook ke endpoint",
    })

    // Simulate webhook test delay
    setTimeout(() => {
      toast({
        title: "Webhook berhasil",
        description: "Koneksi webhook berhasil ditest",
      })
    }, 2000)
  }

  const saveWebhookConfig = () => {
    console.log("Saving webhook configuration...")
    toast({
      title: "Konfigurasi disimpan",
      description: "Pengaturan webhook berhasil disimpan",
    })
  }

  const syncNow = (type: string) => {
    console.log(`Syncing ${type}...`)
    toast({
      title: "Sinkronisasi dimulai",
      description: `Memulai sinkronisasi data ${type}`,
    })

    setTimeout(() => {
      toast({
        title: "Sinkronisasi selesai",
        description: `Data ${type} berhasil disinkronkan`,
      })
    }, 3000)
  }

  const saveGeneralSettings = () => {
    console.log("Saving general settings...")
    toast({
      title: "Pengaturan disimpan",
      description: "Pengaturan umum berhasil disimpan",
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2">Pengaturan</h1>
              <p className="text-muted-foreground">Kelola integrasi API dan konfigurasi sistem</p>
            </div>

            <Tabs defaultValue="api" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="api">API Integration</TabsTrigger>
                <TabsTrigger value="webhook">Webhooks</TabsTrigger>
                <TabsTrigger value="sync">Sinkronisasi</TabsTrigger>
                <TabsTrigger value="general">Umum</TabsTrigger>
              </TabsList>

              <TabsContent value="api" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center text-card-foreground">
                      <Key className="h-5 w-5 mr-2" />
                      API Keys
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key" className="text-card-foreground">
                        API Key
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="api-key"
                          value={apiKey}
                          readOnly
                          className="bg-muted border-border font-mono text-sm text-foreground"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey)}
                          className="border-border bg-transparent text-foreground hover:bg-accent"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={regenerateApiKey}
                          className="border-border bg-transparent text-foreground hover:bg-accent"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Gunakan API key ini untuk mengakses data dari website canvasing Anda
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-card-foreground">API Endpoints</Label>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div>
                            <code className="text-foreground">GET /api/products</code>
                            <p className="text-muted-foreground">Ambil daftar produk</p>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div>
                            <code className="text-foreground">GET /api/stores</code>
                            <p className="text-muted-foreground">Ambil daftar toko</p>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div>
                            <code className="text-foreground">POST /api/webhook/canvasing</code>
                            <p className="text-muted-foreground">Webhook untuk sinkronisasi</p>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="webhook" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center text-card-foreground">
                      <Webhook className="h-5 w-5 mr-2" />
                      Webhook Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url" className="text-card-foreground">
                        Webhook URL
                      </Label>
                      <Input
                        id="webhook-url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://your-canvasing-site.com/api/webhook"
                        className="bg-background border-border text-foreground"
                      />
                      <p className="text-sm text-muted-foreground">
                        URL endpoint di website canvasing untuk menerima update dari CMS
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="webhook-secret" className="text-card-foreground">
                        Webhook Secret
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="webhook-secret"
                          value={webhookSecret}
                          readOnly
                          className="bg-muted border-border font-mono text-sm text-foreground"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(webhookSecret)}
                          className="border-border bg-transparent text-foreground hover:bg-accent"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-card-foreground">Webhook Events</Label>
                      <div className="space-y-2">
                        {[
                          { event: "product.created", description: "Produk baru ditambahkan" },
                          { event: "product.updated", description: "Produk diperbarui" },
                          { event: "product.deleted", description: "Produk dihapus" },
                          { event: "store.created", description: "Toko baru ditambahkan" },
                          { event: "store.updated", description: "Toko diperbarui" },
                        ].map((item) => (
                          <div key={item.event} className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <div>
                              <code className="text-foreground text-sm">{item.event}</code>
                              <p className="text-muted-foreground text-sm">{item.description}</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={testWebhook} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Test Webhook
                      </Button>
                      <Button
                        variant="outline"
                        className="border-border bg-transparent text-foreground hover:bg-accent"
                        onClick={saveWebhookConfig}
                      >
                        Save Configuration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sync" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Sinkronisasi Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sync-enabled">Aktifkan Sinkronisasi</Label>
                        <p className="text-sm text-muted-foreground">
                          Sinkronkan data otomatis dengan website canvasing
                        </p>
                      </div>
                      <Switch id="sync-enabled" checked={syncEnabled} onCheckedChange={setSyncEnabled} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-sync">Sinkronisasi Otomatis</Label>
                        <p className="text-sm text-muted-foreground">Sinkronkan perubahan secara real-time</p>
                      </div>
                      <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} disabled={!syncEnabled} />
                    </div>

                    <div className="space-y-3">
                      <Label>Status Sinkronisasi</Label>
                      <div className="space-y-2">
                        {[
                          { item: "Produk", status: "success", lastSync: "2 menit yang lalu", count: 245 },
                          { item: "Toko", status: "success", lastSync: "5 menit yang lalu", count: 4 },
                          { item: "Media", status: "warning", lastSync: "1 jam yang lalu", count: 156 },
                        ].map((sync) => (
                          <div key={sync.item} className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <div className="flex items-center space-x-3">
                              {sync.status === "success" ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                              )}
                              <div>
                                <p className="font-medium text-foreground">{sync.item}</p>
                                <p className="text-sm text-muted-foreground">
                                  {sync.count} item • Terakhir: {sync.lastSync}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border bg-transparent"
                              onClick={() => syncNow(sync.item)}
                            >
                              Sync Now
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="general" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Pengaturan Umum</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-name" className="text-card-foreground">
                        Nama Website
                      </Label>
                      <Input
                        id="site-name"
                        defaultValue="Canvasing CMS"
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="site-description" className="text-card-foreground">
                        Deskripsi
                      </Label>
                      <Textarea
                        id="site-description"
                        defaultValue="Content Management System untuk website canvasing"
                        className="bg-background border-border text-foreground"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-email" className="text-card-foreground">
                        Email Kontak
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        defaultValue="admin@canvasing.com"
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={saveGeneralSettings}
                    >
                      Simpan Pengaturan
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
