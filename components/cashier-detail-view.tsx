// components/cashier-detail-view.tsx
"use client"

import type { Cashier } from "@/types";

interface CashierDetailViewProps {
  cashier: Cashier;
}

export function CashierDetailView({ cashier }: CashierDetailViewProps) {
  return (
    <div className="space-y-4 p-2">
      <h3 className="font-semibold text-lg">{cashier.name}</h3>
      <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
        <span className="text-muted-foreground">ID</span>
        <span className="col-span-2 font-mono">{cashier.id}</span>
        
        <span className="text-muted-foreground">Username</span>
        <span className="col-span-2 font-mono">{cashier.username}</span>

        <span className="text-muted-foreground">Store Code</span>
        <span className="col-span-2 font-mono">{cashier.store_code}</span>
        
        <span className="text-muted-foreground">Role</span>
        <span className="col-span-2">{cashier.role}</span>
      </div>
    </div>
  );
}