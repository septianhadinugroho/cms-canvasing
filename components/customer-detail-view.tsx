"use client"

import type { Customer } from "@/types";

interface CustomerDetailViewProps {
  customer: Customer;
}

export function CustomerDetailView({ customer }: CustomerDetailViewProps) {
  // Find the primary address, or default to the first address if none is marked as primary
  const primaryAddress = customer.addresses.find(addr => addr.is_primary === 1) || customer.addresses[0];

  return (
    <div className="space-y-4 p-2">
      <h3 className="font-semibold text-lg">{customer.customer_name}</h3>
      <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
        <span className="text-muted-foreground">ID</span>
        <span className="col-span-2 font-mono">{customer.id}</span>
        
        <span className="text-muted-foreground">Email</span>
        <span className="col-span-2">{customer.email}</span>

        <span className="text-muted-foreground">Phone</span>
        <span className="col-span-2">{customer.phone}</span>
        
        <span className="text-muted-foreground">Store ID</span>
        <span className="col-span-2 font-mono">{customer.store_id}</span>
        
        {primaryAddress && (
          <>
            <span className="text-muted-foreground">Address</span>
            <span className="col-span-2">{primaryAddress.address || '-'}</span>

            <span className="text-muted-foreground">Latitude</span>
            <span className="col-span-2 font-mono">{primaryAddress.latitude || '-'}</span>
            
            <span className="text-muted-foreground">Longitude</span>
            <span className="col-span-2 font-mono">{primaryAddress.longitude || '-'}</span>
          </>
        )}
        
        <span className="text-muted-foreground">Created At</span>
        <span className="col-span-2">{new Date(customer.created_at).toLocaleString()}</span>

        <span className="text-muted-foreground">Updated At</span>
        <span className="col-span-2">{new Date(customer.updated_at).toLocaleString()}</span>
      </div>
    </div>
  );
}