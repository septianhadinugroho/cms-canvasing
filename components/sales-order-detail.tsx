// components/sales-order-detail.tsx
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiOrder } from "@/types"; // Import ApiOrder

interface SalesOrderDetailProps {
  order: ApiOrder;
  statusText: string;
}

export function SalesOrderDetail({ order, statusText }: SalesOrderDetailProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Order Number</p>
          <p className="font-mono">{order.order_number}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge
            variant={
              statusText === "Paid" ? "default" : statusText === "Pending" ? "secondary" : "destructive"
            }
          >
            {statusText}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Customer</p>
          {/* Menggunakan properti snake_case langsung */}
          <p>{order.customer_name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="font-semibold">
            Rp {order.total_amount.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Items</p>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    Rp {item.price.toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}