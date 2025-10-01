// components/store-detail-view.tsx

"use client"

import type { Store } from "@/types";
import { Badge } from "@/components/ui/badge";

interface StoreDetailViewProps {
  store: Store;
}

export function StoreDetailView({ store }: StoreDetailViewProps) {
  const getStatusVariant = (status: string | null | undefined) => {
    if (!status) return "secondary";
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'destructive';
      default:
        return 'secondary';
    }
  }

  return (
    <div className="space-y-4 p-2 max-h-[70vh] overflow-y-auto pr-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{store.store_name}</h3>
        {store.status && (
          <Badge variant={getStatusVariant(store.status)} className="capitalize">
            {store.status}
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
        <span className="text-muted-foreground">Store Code</span>
        <span className="col-span-2 font-mono">{store.store_code}</span>
        
        <span className="text-muted-foreground">Address</span>
        <span className="col-span-2">{store.address || '-'}</span>

        <span className="text-muted-foreground">Phone Number</span>
        <span className="col-span-2">{store.phone_number || '-'}</span>

        <span className="text-muted-foreground">Hotline</span>
        <span className="col-span-2">{store.hotline || '-'}</span>
        
        <span className="text-muted-foreground">MID</span>
        <span className="col-span-2 font-mono">{store.mid || '-'}</span>
        
        <span className="text-muted-foreground">TID</span>
        <span className="col-span-2 font-mono">{store.tid || '-'}</span>

        <span className="text-muted-foreground">NPWP</span>
        <span className="col-span-2 font-mono">{store.npwp || '-'}</span>

        <span className="text-muted-foreground">MAC Address</span>
        <span className="col-span-2 font-mono">{store.mac_address || '-'}</span>
        
        <span className="text-muted-foreground">IP Address</span>
        <span className="col-span-2 font-mono">{store.ip_address || '-'}</span>
        
        <span className="text-muted-foreground">Coordinates</span>
        <span className="col-span-2 font-mono">{store.latitude || '-'}, {store.longitude || '-'}</span>
      </div>
    </div>
  );
}