"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserForm } from "./user-form"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  status: "active" | "inactive"
  lastLogin: string
  avatar: string
}

interface UsersTableProps {
  searchTerm: string
  roleFilter: string
  statusFilter: string
}

export function UsersTable({ searchTerm, roleFilter, statusFilter }: UsersTableProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            // Nanti query params bisa ditambahkan di sini
            const fetchedUsers = await api.get<User[]>('/users');
            // Logika filter sementara di frontend
            const filtered = fetchedUsers.filter(user => 
                (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (roleFilter === 'all' || user.role === roleFilter) &&
                (statusFilter === 'all' || user.status === statusFilter)
            );
            setUsers(filtered);
        } catch (error) {
            toast({ title: "Error", description: "Gagal memuat data pengguna.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    fetchUsers();
  }, [searchTerm, roleFilter, statusFilter, toast]);

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge variant="default">Aktif</Badge>
    }
    return <Badge variant="secondary">Nonaktif</Badge>
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (user: User) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna ${user.name}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
      toast({
        title: "Berhasil!",
        description: `Pengguna ${user.name} berhasil dihapus`,
      })
    }
  }

  const handleUserUpdate = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
  }
  
  if (isLoading) return <div className="text-center py-12">Memuat data pengguna...</div>;

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Pengguna</TableHead>
              <TableHead className="text-muted-foreground">Peran</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Terakhir Login</TableHead>
              <TableHead className="text-muted-foreground w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-border hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={user.avatar || "/placeholder-user.jpg"}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-foreground">
                  {new Date(user.lastLogin).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(user)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {users.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada pengguna yang ditemukan</p>
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm
              user={editingUser}
              onClose={() => {
                setIsEditDialogOpen(false)
                setEditingUser(null)
              }}
              onSave={handleUserUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}