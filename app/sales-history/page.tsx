// app/sales-history/page.tsx
"use client"

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-provider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SalesOrderDetail } from "@/components/sales-order-detail";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { ApiOrder } from "@/types";

export default function SalesHistoryPage() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [salesHistory, setSalesHistory] = useState<ApiOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'CASHIER') {
      fetchOrders();
    }
  }, [isAuthenticated, user, toast]);

  const fetchOrders = async () => {
    try {
      const response = await api.get<{ items: ApiOrder[] }>("/cashier/orders");
      setSalesHistory(response.items);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to fetch sales history: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleMarkAsPaid = async (orderNumber: string) => {
    try {
      await api.put("/cashier/orders/status", { order_number: orderNumber });
      toast({
        title: "Success",
        description: `Order ${orderNumber} has been marked as paid.`,
      });
      fetchOrders(); // Muat ulang data setelah berhasil
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update order status: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Unpaid';
      case 1: return 'Pending';
      case 2: return 'Paid';
      case 3: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  if (!isAuthenticated) return null;

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
                      <TableRow key={order.order_number}>
                        <TableCell className="font-mono">{order.order_number}</TableCell>
                        <TableCell>Rp {order.total_amount.toLocaleString('id-ID')}</TableCell>
                        <TableCell>
                          <Badge variant={ getStatusText(order.status) === 'Paid' ? 'default' : getStatusText(order.status) === 'Pending' ? 'secondary' : 'destructive' }>
                            {getStatusText(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {getStatusText(order.status) === 'Pending' && (
                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <CheckCircle className="h-5 w-5 text-green-500" />
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent><p>Mark as Paid</p></TooltipContent>
                              </Tooltip>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>This action will mark order {order.order_number} as paid.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleMarkAsPaid(order.order_number)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                           <Dialog onOpenChange={(open) => !open && setSelectedOrder(null)}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                   <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                                      <Eye className="h-5 w-5" />
                                    </Button>
                                  </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent><p>View Details</p></TooltipContent>
                              </Tooltip>
                               <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Order Details</DialogTitle>
                                </DialogHeader>
                                 {selectedOrder && (
                                   <SalesOrderDetail 
                                      order={selectedOrder} 
                                      statusText={getStatusText(selectedOrder.status)} 
                                   />
                                  )}
                              </DialogContent>
                            </Dialog>
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
  );
}