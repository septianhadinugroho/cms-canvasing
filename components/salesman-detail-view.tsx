"use client"

import type { Salesman } from "@/types";

interface SalesmanDetailViewProps {
  salesman: Salesman;
}

export function SalesmanDetailView({ salesman }: SalesmanDetailViewProps) {
  return (
    <div className="space-y-4 p-2">
      <h3 className="font-semibold text-lg">{salesman.name}</h3>
      <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
        <span className="text-muted-foreground">ID</span>
        <span className="col-span-2 font-mono">{salesman.id}</span>
        
        <span className="text-muted-foreground">Username</span>
        <span className="col-span-2 font-mono">{salesman.username}</span>

        <span className="text-muted-foreground">Store Name</span>
        <span className="col-span-2">{salesman.store_name}</span>
        
        <span className="text-muted-foreground">Store Code</span>
        <span className="col-span-2 font-mono">{salesman.store_code}</span>
        
        <span className="text-muted-foreground">Address</span>
        <span className="col-span-2">{salesman.address || '-'}</span>

        <span className="text-muted-foreground">MID</span>
        <span className="col-span-2 font-mono">{salesman.mid || '-'}</span>
        
        <span className="text-muted-foreground">TID</span>
        <span className="col-span-2 font-mono">{salesman.tid || '-'}</span>

        <span className="text-muted-foreground">Hotline</span>
        <span className="col-span-2 font-mono">{salesman.hotline || '-'}</span>

        <span className="text-muted-foreground">MAC Address</span>
        <span className="col-span-2 font-mono">{salesman.mac_address || '-'}</span>

        <span className="text-muted-foreground">NPWP</span>
        <span className="col-span-2 font-mono">{salesman.npwp || '-'}</span>
      </div>
    </div>
  );
}