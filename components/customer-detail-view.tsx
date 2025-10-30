// components/customer-detail-view.tsx

import type { Customer } from "@/types";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface CustomerDetailViewProps {
  customer: Customer;
}

export function CustomerDetailView({ customer }: CustomerDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Customer's Basic Details */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Customer Details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <p className="text-muted-foreground">Name:</p>
          <p>{customer.customer_name}</p>
          <p className="text-muted-foreground">Email:</p>
          <p>{customer.email}</p>
          <p className="text-muted-foreground">Phone:</p>
          <p>{customer.phone}</p>
          <p className="text-muted-foreground">NIK:</p>
          <p>{customer.nik || '-'}</p>
          <p className="text-muted-foreground">Place, Date of Birth:</p>
          <p>{customer.pob && customer.dob ? `${customer.pob}, ${customer.dob}` : '-'}</p>
          <p className="text-muted-foreground">Gender:</p>
          <p>{customer.gender || '-'}</p>
          <p className="text-muted-foreground">Nationality:</p>
          <p>{customer.nationality || '-'}</p>
          <p className="text-muted-foreground">NPWP:</p>
          <p>{customer.npwp || '-'}</p>
          <p className="text-muted-foreground">Nama NPWP:</p>
          <p>{customer.nama_npwp || '-'}</p>
        </div>
      </div>

      {/* Address List - Now in a Card with ScrollArea */}
      <Card>
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          {customer.addresses && customer.addresses.length > 0 ? (
            // Menambahkan ScrollArea dengan tinggi tetap agar bisa scroll
            <ScrollArea className="h-[250px] w-full pr-4">
              <div className="space-y-4">
                {customer.addresses.map((address) => (
                  <div key={address.id_address} className="border p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-base">{address.label}</h4>
                      {address.is_primary === 1 && (
                        <Badge variant="default">Primary</Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground">{address.address}</p>
                    {address.detail_address && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Detail: {address.detail_address}
                      </p>
                    )}
                    <div className="text-sm text-muted-foreground mt-2">
                      <p>Latitude: {address.latitude}</p>
                      <p>Longitude: {address.longitude}</p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                    >
                      View on Google Maps
                    </a>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">
              No addresses found for this customer.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}