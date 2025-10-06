"use client"

import { useState } from "react";
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-provider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SalesOrderDetail } from "@/components/sales-order-detail"; // Import komponen baru
import { useToast } from "@/hooks/use-toast";

// Dummy data for sales history
const initialSalesHistory = [
  { orderNumber: "ORD-001", status: "Paid", amount: 150000 },
  { orderNumber: "ORD-002", status: "Pending", amount: 250000 },
  { orderNumber: "ORD-003", status: "Paid", amount: 75000 },
  { orderNumber: "ORD-004", status: "Cancelled", amount: 320000 },
  { orderNumber: "ORD-005", status: "Paid", amount: 50000 },
];

export default function SalesHistoryPage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [salesHistory, setSalesHistory] = useState(initialSalesHistory);
  const [selectedOrder, setSelectedOrder] = useState<(typeof initialSalesHistory)[0] | null>(null);

  const handleMarkAsPaid = (orderNumber: string) => {
    setSalesHistory(currentHistory =>
      currentHistory.map(order =>
        order.orderNumber === orderNumber ? { ...order, status: 'Paid' } : order
      )
    );
    toast({
      title: "Success",
      description: `Order ${orderNumber} has been marked as paid.`,
    })
  };

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <TooltipProvider>
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-semibold text-foreground mb-8">Sales History</h1>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesHistory.map((order) => (
                      <TableRow key={order.orderNumber}>
                        <TableCell className="font-mono">{order.orderNumber}</TableCell>
                        <TableCell>Rp {order.amount.toLocaleString('id-ID')}</TableCell>
                        <TableCell>
                          <Badge variant={
                            order.status === 'Paid' ? 'default' :
                            order.status === 'Pending' ? 'secondary' : 'destructive'
                          }>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {order.status === 'Pending' && (
                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <CheckCircle className="h-5 w-5 text-green-500" />
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Mark as Paid</p>
                                </TooltipContent>
                              </Tooltip>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action will mark order {order.orderNumber} as paid. This cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleMarkAsPaid(order.orderNumber)}>
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          {(order.status === 'Paid' || order.status === 'Cancelled') && (
                             <Dialog onOpenChange={(open) => !open && setSelectedOrder(null)}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                   <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                                      <Eye className="h-5 w-5" />
                                    </Button>
                                  </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Details</p>
                                </TooltipContent>
                              </Tooltip>
                               <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Order Details</DialogTitle>
                                </DialogHeader>
                                {selectedOrder && <SalesOrderDetail order={selectedOrder} />}
                              </DialogContent>
                            </Dialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TooltipProvider>
        </main>
      </div>
    </div>
  )
}