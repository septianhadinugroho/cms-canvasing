"use client"

interface Order {
  orderNumber: string;
  status: string;
  amount: number;
}

interface SalesOrderDetailProps {
  order: Order;
}

export function SalesOrderDetail({ order }: SalesOrderDetailProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg">Order {order.orderNumber}</h3>
        <p className="text-sm text-muted-foreground">
          Status: <span className="font-medium text-primary">{order.status}</span>
        </p>
      </div>
      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Amount</span>
          <span className="font-bold text-lg">Rp {order.amount.toLocaleString('id-ID')}</span>
        </div>
      </div>
      {/* Anda dapat menambahkan lebih banyak detail di sini */}
    </div>
  );
}