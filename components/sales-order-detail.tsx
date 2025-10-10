// components/sales-order-detail.tsx

import { ApiOrder } from "@/types";
import { Badge } from "./ui/badge";

interface SalesOrderDetailProps {
  order: ApiOrder;
  statusText: string;
}

export function SalesOrderDetail({ order, statusText }: SalesOrderDetailProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-2">Customer Details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <p className="text-muted-foreground">Name:</p>
          <p>{order.customer_name}</p>
          <p className="text-muted-foreground">Phone:</p>
          <p>{order.customer_phone}</p>
          <p className="text-muted-foreground">Address:</p>
          <p>{order.customer_address}</p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <p className="text-muted-foreground">Order Number:</p>
          <p className="font-mono">{order.order_number}</p>
          <p className="text-muted-foreground">Order Date:</p>
          <p>{order.order_date}</p>
          <p className="text-muted-foreground">Payment:</p>
          <p>{order.payment_source}</p>
          <p className="text-muted-foreground">Status:</p>
          <p>
            <Badge variant={statusText === 'PAID' ? 'default' : statusText === 'PENDING' ? 'secondary' : 'destructive'}>
              {statusText}
            </Badge>
          </p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Items</h3>
        <div className="border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left font-medium">Product</th>
                <th className="p-2 text-right font-medium">Qty</th>
                <th className="p-2 text-right font-medium">Price</th>
                <th className="p-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="p-2">{item.product_name}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2 text-right">Rp{Number(item.price).toLocaleString('id-ID')}</td>
                  <td className="p-2 text-right">Rp{(item.quantity * Number(item.price)).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-right font-bold text-lg">
        Grand Total: Rp{order.grand_total.toLocaleString('id-ID')}
      </div>
    </div>
  );
}