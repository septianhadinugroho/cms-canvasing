"use client"

import { MapContainer, TileLayer, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import type { Store } from "@/types"
import { Badge } from "@/components/ui/badge"

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

interface StoreDetailViewProps {
  store: Store
}

type StatusVariant = 'default' | 'destructive' | 'secondary'

export function StoreDetailView({ store }: StoreDetailViewProps) {
  const getStatusInfo = (status: string | number | null | undefined): { text: string; variant: StatusVariant } => {
    if (status === 'active' || status === 1) {
        return { text: 'Active', variant: 'default' }
    }
    if (status === 'inactive' || status === 0) {
        return { text: 'Inactive', variant: 'destructive' }
    }
    return { text: 'Unknown', variant: 'secondary' }
  }
  
  const statusInfo = getStatusInfo(store.status)

  const position: L.LatLngExpression = store.latitude && store.longitude ? [store.latitude, store.longitude] : [ -6.200000, 106.816666 ] // Default to Jakarta

  return (
    <div className="space-y-4 p-2 max-h-[70vh] overflow-y-auto pr-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{store.store_name}</h3>
        <Badge variant={statusInfo.variant} className="capitalize">
            {statusInfo.text}
        </Badge>
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

        <span className="text-muted-foreground">IP POS Web</span>
        <span className="col-span-2 font-mono">{store.ip_pos_web || '-'}</span>

        <span className="text-muted-foreground">Cashier ID</span>
        <span className="col-span-2 font-mono">{store.cashier_id || '-'}</span>
        
        <span className="text-muted-foreground">Coordinates</span>
        <span className="col-span-2 font-mono">{store.latitude || '-'}, {store.longitude || '-'}</span>
      </div>

      {store.latitude && store.longitude && (
        <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Store Location</h4>
            <div className="detail-map-container">
                <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}></Marker>
                </MapContainer>
            </div>
        </div>
      )}
    </div>
  )
}