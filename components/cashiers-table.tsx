// components/cashiers-table.tsx
"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { Cashier } from "@/types" // Import tipe Cashier
import { CashierDetailView } from "./cashier-detail-view"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Definisikan props yang diterima komponen
interface CashiersTableProps {
  cashiers: Cashier[];
}

export function CashiersTable({ cashiers }: CashiersTableProps) {
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Cashiers Management</h2>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Store Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashiers.map((cashier) => (
              <TableRow key={cashier.id}>
                <TableCell className="font-medium">{cashier.name}</TableCell>
                <TableCell>{cashier.username}</TableCell>
                <TableCell>{cashier.store_code}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedCashier(cashier)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cashier Details</DialogTitle>
                      </DialogHeader>
                      {selectedCashier && <CashierDetailView cashier={selectedCashier} />}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}