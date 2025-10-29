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
          {/* PERBAIKAN UTAMA: Ganti `order.address` menjadi `order.customer_address` */}
          <p>{order.customer_address || 'Tidak ada alamat'}</p>
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
            <Badge
              variant={
                statusText === 'COMPLETED' || statusText === 'PAID'
                  ? 'default'
                  : statusText === 'PENDING CASHIER' || statusText === 'PENDING' || statusText === 'UNPAID'
                  ? 'destructive'
                  : statusText === 'CANCELLED'
                  ? 'destructive'
                  : 'secondary'
              }
            >
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
              {/* <-- AWAL PERUBAHAN LOGIKA HARGA --> */}
              {order.items.map((item, index) => {
                // Ambil nilai harga, konversi ke Number. Default ke 0 jika tidak valid.
                const customPrice = Number(item.custom_price) || 0;
                const promoPrice = Number(item.price_promo) || 0;
                const regularPrice = Number(item.price) || 0;

                // Terapkan logika prioritas sesuai permintaan
                let displayPrice: number;
                if (customPrice > 0) {
                  displayPrice = customPrice; // Prioritas 1: Custom Price
                } else if (promoPrice > 0) {
                  displayPrice = promoPrice; // Prioritas 2: Promo Price
                } else {
                  displayPrice = regularPrice; // Prioritas 3: Regular Price
                }

                // Hitung total baris berdasarkan harga yang sudah ditentukan
                const totalRowPrice = item.quantity * displayPrice;

                return (
                  <tr key={index} className="border-b last:border-none">
                    <td className="p-2">{item.product_name}</td>
                    <td className="p-2 text-right">{item.quantity}</td>
                    {/* Tampilkan harga yang sudah diproses */}
                    <td className="p-2 text-right">Rp{displayPrice.toLocaleString('id-ID')}</td>
                    {/* Hitung total berdasarkan harga yang diproses */}
                    <td className="p-2 text-right">Rp{totalRowPrice.toLocaleString('id-ID')}</td>
                  </tr>
                );
              })}
              {/* <-- AKHIR PERUBAHAN LOGIKA HARGA --> */}
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