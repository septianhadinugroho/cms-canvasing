"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CustomerDetailView } from "./customer-detail-view"
import { Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Customer } from "@/types"

export function CustomersTable() {
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
        const data = await api.get<Customer[]>('/customers/all');
        setCustomers(data);
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleViewDetail = (customer: Customer) => {
    setDetailCustomer(customer);
    setIsDetailOpen(true);
  };
  
  if (isLoading) return <div className="text-center py-12">Loading customer data...</div>;

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Store ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.customer_name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.store_id}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleViewDetail(customer)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {customers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No customers found.</p>
          </div>
        )}
      </div>
      
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{detailCustomer?.customer_name || "Customer Detail"}</DialogTitle>
          </DialogHeader>
           {detailCustomer && <CustomerDetailView customer={detailCustomer} />}
        </DialogContent>
      </Dialog>
    </>
  )
}