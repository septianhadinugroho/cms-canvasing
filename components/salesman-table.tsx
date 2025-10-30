// components/salesman-table.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog" // Import AlertDialog
import { SalesmanForm } from "./salesman-form"
import { SalesmanDetailView } from "./salesman-detail-view"
import { Edit, Trash2, Eye } from "lucide-react" // Hapus MoreHorizontal
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Salesman } from "@/types"

interface SalesmanTableProps {
  refreshKey: number;
  onRefresh: () => void;
}

export function SalesmanTable({ refreshKey, onRefresh }: SalesmanTableProps) {
  const [editingSalesman, setEditingSalesman] = useState<Salesman | null>(null)
  const [detailSalesman, setDetailSalesman] = useState<Salesman | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [salesmen, setSalesmen] = useState<Salesman[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchSalesmen = useCallback(async () => {
    setIsLoading(true);
    try {
        const data = await api.get<Salesman[]>('/salesman');
        setSalesmen(data);
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSalesmen();
  }, [fetchSalesmen, refreshKey]);

  const handleViewDetail = (salesman: Salesman) => {
    setDetailSalesman(salesman);
    setIsDetailOpen(true);
  };

  const handleEdit = (salesman: Salesman) => {
    setEditingSalesman(salesman);
    setIsEditDialogOpen(true);
  }

  // Ganti nama handleDelete menjadi performDelete dan hapus window.confirm
  const performDelete = async (salesmanId: string) => {
    try {
        await api.delete(`/salesman/${salesmanId}`);
        toast({ title: "Success!", description: `Salesman successfully deleted.` });
        onRefresh();
    } catch(error: any) {
        toast({ title: "Failed", description: error.message, variant: "destructive"});
    }
  }

  if (isLoading) return <div className="text-center py-12">Loading salesmen...</div>;

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Store</TableHead>
              {/* Ganti TableHead untuk kolom Actions */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesmen.map((salesman) => (
              <TableRow key={salesman.id}>
                <TableCell className="font-medium">{salesman.name}</TableCell>
                <TableCell>{salesman.username}</TableCell>
                <TableCell>{salesman.store_name}</TableCell>
                {/* Ganti DropdownMenu dengan Button langsung */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewDetail(salesman)}
                      aria-label={`View detail for ${salesman.name}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(salesman)}
                      aria-label={`Edit ${salesman.name}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* Tambahkan AlertDialog untuk Delete */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          aria-label={`Delete ${salesman.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will delete {salesman.name}. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => performDelete(salesman.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {salesmen.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No salesmen found.</p>
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Salesman</DialogTitle></DialogHeader>
          {editingSalesman && (
            <SalesmanForm
              salesman={editingSalesman}
              onClose={() => setIsEditDialogOpen(false)}
              onSave={() => {
                setIsEditDialogOpen(false);
                onRefresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{detailSalesman?.name || "Salesman Detail"}</DialogTitle>
          </DialogHeader>
           {detailSalesman && <SalesmanDetailView salesman={detailSalesman} />}
        </DialogContent>
      </Dialog>
    </>
  )
}