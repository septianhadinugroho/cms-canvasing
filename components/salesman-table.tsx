"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SalesmanForm } from "./salesman-form"
import { SalesmanDetailView } from "./salesman-detail-view"
import { Edit, Trash2, MoreHorizontal, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Salesman } from "@/types"

interface SalesmanTableProps {
  key: number;
  onRefresh: () => void;
}

export function SalesmanTable({ key: refreshKey, onRefresh }: SalesmanTableProps) {
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

  const handleDelete = async (salesmanId: string) => {
    if (window.confirm(`Are you sure you want to delete this salesman?`)) {
        try {
            await api.delete(`/salesman/${salesmanId}`);
            toast({ title: "Success!", description: `Salesman successfully deleted.` });
            onRefresh();
        } catch(error: any) {
            toast({ title: "Failed", description: error.message, variant: "destructive"});
        }
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
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesmen.map((salesman) => (
              <TableRow key={salesman.id}>
                <TableCell className="font-medium">{salesman.name}</TableCell>
                <TableCell>{salesman.username}</TableCell>
                <TableCell>{salesman.store_name}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetail(salesman)}><Eye className="h-4 w-4 mr-2" />View Detail</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(salesman)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(salesman.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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