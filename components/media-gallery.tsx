"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Download, Trash2, Edit, Eye, Copy, FileImage, FileVideo, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface MediaFile {
  id: string
  name: string
  type: "image" | "video" | "document"
  size: number
  folder: string
  url: string
  uploadDate: string
  dimensions?: {
    width: number
    height: number
  }
}

const mockMediaFiles: MediaFile[] = [
  {
    id: "1",
    name: "nike-air-max-270.jpg",
    type: "image",
    size: 2048576,
    folder: "products",
    url: "/product-1.png",
    uploadDate: "2024-01-15",
    dimensions: { width: 800, height: 600 },
  },
  {
    id: "2",
    name: "adidas-ultraboost.jpg",
    type: "image",
    size: 1536000,
    folder: "products",
    url: "/product-2.png",
    uploadDate: "2024-01-14",
    dimensions: { width: 1024, height: 768 },
  },
  {
    id: "3",
    name: "eiger-backpack.jpg",
    type: "image",
    size: 1024000,
    folder: "products",
    url: "/eiger-backpack.jpg",
    uploadDate: "2024-01-13",
    dimensions: { width: 600, height: 800 },
  },
  {
    id: "4",
    name: "store-banner.jpg",
    type: "image",
    size: 3072000,
    folder: "banners",
    url: "/generic-store-banner.png",
    uploadDate: "2024-01-12",
    dimensions: { width: 1200, height: 400 },
  },
  {
    id: "5",
    name: "company-logo.png",
    type: "image",
    size: 512000,
    folder: "logos",
    url: "/generic-company-logo.png",
    uploadDate: "2024-01-11",
    dimensions: { width: 200, height: 200 },
  },
  {
    id: "6",
    name: "product-catalog.pdf",
    type: "document",
    size: 5120000,
    folder: "products",
    url: "#",
    uploadDate: "2024-01-10",
  },
]

interface MediaGalleryProps {
  searchTerm: string
  typeFilter: string
  folderFilter: string
  viewMode: "grid" | "list"
}

export function MediaGallery({ searchTerm, typeFilter, folderFilter, viewMode }: MediaGalleryProps) {
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { toast } = useToast()

  const filteredFiles = mockMediaFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || file.type === typeFilter
    const matchesFolder = folderFilter === "all" || file.folder === folderFilter

    return matchesSearch && matchesType && matchesFolder
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <FileImage className="h-5 w-5" />
      case "video":
        return <FileVideo className="h-5 w-5" />
      case "document":
        return <FileText className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const handlePreview = (file: MediaFile) => {
    setSelectedFile(file)
    setIsPreviewOpen(true)
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "URL disalin",
      description: "URL media berhasil disalin ke clipboard",
    })
  }

  const handleDownload = (file: MediaFile) => {
    console.log("Downloading file:", file.name)
    toast({
      title: "Download dimulai",
      description: `File ${file.name} sedang didownload`,
    })
  }

  const handleDelete = (file: MediaFile) => {
    console.log("Deleting file:", file.id)
    toast({
      title: "File dihapus",
      description: `File ${file.name} berhasil dihapus`,
      variant: "destructive",
    })
  }

  const handleRename = (file: MediaFile) => {
    console.log("Renaming file:", file.id)
    toast({
      title: "File diubah nama",
      description: `File ${file.name} berhasil diubah nama`,
    })
  }

  if (viewMode === "list") {
    return (
      <>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">File</TableHead>
                <TableHead className="text-muted-foreground">Tipe</TableHead>
                <TableHead className="text-muted-foreground">Ukuran</TableHead>
                <TableHead className="text-muted-foreground">Folder</TableHead>
                <TableHead className="text-muted-foreground">Tanggal Upload</TableHead>
                <TableHead className="text-muted-foreground w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id} className="border-border hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {file.type === "image" ? (
                          <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
                        ) : (
                          getFileIcon(file.type)
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{file.name}</div>
                        {file.dimensions && (
                          <div className="text-sm text-muted-foreground">
                            {file.dimensions.width} × {file.dimensions.height}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {file.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground">{formatFileSize(file.size)}</TableCell>
                  <TableCell className="text-foreground capitalize">{file.folder}</TableCell>
                  <TableCell className="text-foreground">{file.uploadDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem onClick={() => handlePreview(file)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(file)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRename(file)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(file)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <MediaPreviewDialog
          file={selectedFile}
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false)
            setSelectedFile(null)
          }}
        />
      </>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredFiles.map((file) => (
          <Card
            key={file.id}
            className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => handlePreview(file)}
          >
            <CardContent className="p-3">
              <div className="aspect-square relative rounded-md overflow-hidden bg-muted mb-3">
                {file.type === "image" ? (
                  <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {getFileIcon(file.type)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" size="sm" onClick={() => handlePreview(file)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground truncate" title={file.name}>
                  {file.name}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="capitalize">{file.folder}</span>
                  <span>{formatFileSize(file.size)}</span>
                </div>
                {file.dimensions && (
                  <p className="text-xs text-muted-foreground">
                    {file.dimensions.width} × {file.dimensions.height}
                  </p>
                )}
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="h-6 w-6 p-0" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(file)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRename(file)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(file)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Tidak ada media yang ditemukan</p>
        </div>
      )}

      <MediaPreviewDialog
        file={selectedFile}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false)
          setSelectedFile(null)
        }}
      />
    </>
  )
}

interface MediaPreviewDialogProps {
  file: MediaFile | null
  isOpen: boolean
  onClose: () => void
}

function MediaPreviewDialog({ file, isOpen, onClose }: MediaPreviewDialogProps) {
  const { toast } = useToast()

  const handleDownload = (file: MediaFile) => {
    console.log("Downloading file:", file.name)
    toast({
      title: "Download dimulai",
      description: `File ${file.name} sedang didownload`,
    })
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "URL disalin",
      description: "URL media berhasil disalin ke clipboard",
    })
  }

  const handleDelete = (file: MediaFile) => {
    console.log("Deleting file:", file.id)
    toast({
      title: "File dihapus",
      description: `File ${file.name} berhasil dihapus`,
      variant: "destructive",
    })
  }

  if (!file) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {file.type === "image" ? (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-contain" />
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Preview tidak tersedia untuk tipe file ini</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Detail File</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nama:</span>
                  <span className="text-foreground">{file.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipe:</span>
                  <Badge variant="outline" className="capitalize">
                    {file.type}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ukuran:</span>
                  <span className="text-foreground">{formatFileSize(file.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Folder:</span>
                  <span className="text-foreground capitalize">{file.folder}</span>
                </div>
                {file.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensi:</span>
                    <span className="text-foreground">
                      {file.dimensions.width} × {file.dimensions.height}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Upload:</span>
                  <span className="text-foreground">{file.uploadDate}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full bg-transparent" variant="outline" onClick={() => handleDownload(file)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button className="w-full bg-transparent" variant="outline" onClick={() => copyToClipboard(file.url)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                onClick={() => {
                  handleDelete(file)
                  onClose()
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
