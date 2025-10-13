"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { CustomerDetailView } from "./customer-detail-view";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, updateCustomerStatus } from "@/lib/api";
import type { Customer } from "@/types";

export function CustomersTable() {
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.get<Customer[]>("/customers/all");
      setCustomers(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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

  const handleStatusChange = async (customer: Customer) => {
    setIsUpdating((prev) => ({ ...prev, [customer.id]: true }));
    
    // PERUBAHAN: Tentukan status baru. Jika aktif ("1"), maka status baru adalah 0 (inactive). Jika tidak, status baru adalah 1 (active).
    const newStatus = customer.enabled === "1" ? 0 : 1;

    try {
      // Kirim id dan status baru ke API
      await updateCustomerStatus(customer.id, newStatus);
      toast({
        title: "Success",
        description: `Customer ${customer.customer_name} status has been updated.`,
      });
      fetchCustomers(); // Ambil data terbaru dari server
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update customer status.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating((prev) => ({ ...prev, [customer.id]: false }));
    }
  };

  if (isLoading)
    return <div className="text-center py-12">Loading customer data...</div>;

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => {
                // PERUBAHAN: Cek jika customer.enabled adalah "1" untuk status aktif
                const isActive = customer.enabled === "1";
                
                return (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.customer_name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={isActive ? "default" : "destructive"}
                        className={
                          isActive
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetail(customer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant={isActive ? "destructive" : "default"}
                            size="sm"
                            disabled={isUpdating[customer.id]}
                            className={
                              !isActive
                                ? "bg-green-500 hover:bg-green-600"
                                : ""
                            }
                          >
                            {isUpdating[customer.id]
                              ? "..."
                              : isActive
                              ? "Deactivate"
                              : "Activate"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will change the status for "
                              {customer.customer_name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleStatusChange(customer)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {customers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No customers found.</p>
          </div>
        )}
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {detailCustomer?.customer_name || "Customer Detail"}
            </DialogTitle>
          </DialogHeader>
          {detailCustomer && <CustomerDetailView customer={detailCustomer} />}
        </DialogContent>
      </Dialog>
    </>
  );
}