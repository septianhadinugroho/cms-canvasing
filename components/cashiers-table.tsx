// components/cashiers-table.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CashierForm } from "./cashier-form"
import { CashierDetailView } from "./cashier-detail-view"
import { Edit, Trash2, MoreHorizontal, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import type { Cashier } from "@/types"

interface CashiersTableProps {
  key: number;
  onRefresh: () => void;
}

// Dummy Data
const dummyCashiers: Cashier[] = [
    { id: '1', name: 'John Doe', username: 'john.doe', store_code: 'STORE-001', role: 'kasir' },
    { id: '2', name: 'Jane Smith', username: 'jane.smith', store_code: 'STORE-002', role: 'kasir' },
];


export function CashiersTable({ onRefresh }: CashiersTableProps) {
  const [editingCashier, setEditingCashier] = useState<Cashier | null>(null)
  const [detailCashier, setDetailCashier] = useState<Cashier | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [cashiers, setCashiers] = useState<Cashier[]>(dummyCashiers)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleViewDetail = (cashier: Cashier) => {
    setDetailCashier(cashier);
    setIsDetailOpen(true);
  };

  const handleEdit = (cashier: Cashier) => {
    setEditingCashier(cashier);
    setIsEditDialogOpen(true);
  }

  const handleDelete = async (cashierId: string) => {
    if (window.confirm(`Are you sure you want to delete this cashier?`)) {
        // Dummy delete
        setCashiers(cashiers.filter(c => c.id !== cashierId));
        toast({ title: "Success!", description: `Cashier successfully deleted.` });
        onRefresh();
    }
  }

  if (isLoading) return <div className="text-center py-12">Loading cashiers...</div>;

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
            {cashiers.map((cashier) => (
              <TableRow key={cashier.id}>
                <TableCell className="font-medium">{cashier.name}</TableCell>
                <TableCell>{cashier.username}</TableCell>
                <TableCell>{cashier.store_code}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetail(cashier)}><Eye className="h-4 w-4 mr-2" />View Detail</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(cashier)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(cashier.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {cashiers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No cashiers found.</p>
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Cashier</DialogTitle></DialogHeader>
          {editingCashier && (
            <CashierForm
              cashier={editingCashier}
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
            <DialogTitle>{detailCashier?.name || "Cashier Detail"}</DialogTitle>
          </DialogHeader>
           {detailCashier && <CashierDetailView cashier={detailCashier} />}
        </DialogContent>
      </Dialog>
    </>
  )
}