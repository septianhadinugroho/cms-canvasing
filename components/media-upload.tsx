"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileImage, CheckCircle, AlertCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface UploadFile {
  file: File
  preview: string
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
}

interface MediaUploadProps {
  onClose: () => void
}

export function MediaUpload({ onClose }: MediaUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [selectedFolder, setSelectedFolder] = useState("products")
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "pending" as const,
    }))
    setUploadFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
      "video/*": [".mp4", ".avi", ".mov", ".wmv"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const removeFile = (index: number) => {
    setUploadFiles((prev) => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const simulateUpload = async (file: UploadFile, index: number) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setUploadFiles((prev) => {
        const newFiles = [...prev]
        newFiles[index] = { ...newFiles[index], progress, status: "uploading" }
        return newFiles
      })
    }

    // Simulate success or error
    const success = Math.random() > 0.1 // 90% success rate
    setUploadFiles((prev) => {
      const newFiles = [...prev]
      newFiles[index] = {
        ...newFiles[index],
        status: success ? "success" : "error",
        error: success ? undefined : "Upload failed. Please try again.",
      }
      return newFiles
    })
  }

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return

    setIsUploading(true)

    // Upload all files concurrently
    const uploadPromises = uploadFiles.map((file, index) => simulateUpload(file, index))
    await Promise.all(uploadPromises)

    setIsUploading(false)

    // Auto close after successful upload
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <FileImage className="h-8 w-8 text-blue-500" />
    }
    return <FileImage className="h-8 w-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div className="space-y-6">
      {/* Folder Selection */}
      <div className="space-y-2">
        <Label htmlFor="folder">Upload ke Folder</Label>
        <Select value={selectedFolder} onValueChange={setSelectedFolder}>
          <SelectTrigger className="bg-background border-border">
            <SelectValue placeholder="Pilih folder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="products">Produk</SelectItem>
            <SelectItem value="stores">Toko</SelectItem>
            <SelectItem value="banners">Banner</SelectItem>
            <SelectItem value="logos">Logo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
        <CardContent className="p-8">
          <div {...getRootProps()} className="text-center cursor-pointer">
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg text-primary">Drop files di sini...</p>
            ) : (
              <div>
                <p className="text-lg text-foreground mb-2">Drag & drop files atau klik untuk browse</p>
                <p className="text-sm text-muted-foreground">Mendukung gambar, video, dan PDF hingga 10MB per file</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {uploadFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Files untuk diupload ({uploadFiles.length})</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {uploadFiles.map((uploadFile, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {uploadFile.file.type.startsWith("image/") ? (
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                          <img
                            src={uploadFile.preview || "/placeholder.svg"}
                            alt={uploadFile.file.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        getFileIcon(uploadFile.file)
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{uploadFile.file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(uploadFile.file.size)}</p>

                      {uploadFile.status === "uploading" && (
                        <div className="mt-2">
                          <Progress value={uploadFile.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{uploadFile.progress}% uploaded</p>
                        </div>
                      )}

                      {uploadFile.status === "success" && (
                        <div className="flex items-center mt-2 text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">Upload berhasil</span>
                        </div>
                      )}

                      {uploadFile.status === "error" && (
                        <div className="flex items-center mt-2 text-red-600">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">{uploadFile.error}</span>
                        </div>
                      )}
                    </div>

                    {uploadFile.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
          Batal
        </Button>
        <Button
          onClick={handleUpload}
          disabled={uploadFiles.length === 0 || isUploading}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isUploading ? "Uploading..." : `Upload ${uploadFiles.length} File${uploadFiles.length > 1 ? "s" : ""}`}
        </Button>
      </div>
    </div>
  )
}
