"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Store, TrendingUp, DollarSign } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "./auth-provider"
import type { Product, Store as StoreType } from "@/types"

interface ProductApiResponse {
  items: Product[]
  pagination: { totalData: number }
}

export function DashboardStats() {
  const [totalProducts, setTotalProducts] = useState<number | string>("...")
  const [activeStores, setActiveStores] = useState<number | string>("...")
  const { user } = useAuth()

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.store_code) {
          setTotalProducts(0);
          setActiveStores(0);
          return;
      };

      try {
        const [productsResponse, storesResponse] = await Promise.all([
          api.get<ProductApiResponse>('/products/all', { storeCode: user.store_code, limit: 1 }),
          api.get<StoreType[]>('/stores/all')
        ]);
        
        setTotalProducts(productsResponse.pagination.totalData);
        setActiveStores(storesResponse.length);

      } catch (error) {
        console.error("Gagal mengambil data statistik dashboard:", error);
        setTotalProducts("Error");
        setActiveStores("Error");
      }
    };

    fetchStats();
  }, [user]);

  const stats = [
    {
      title: "Total Produk",
      value: totalProducts,
      change: "", 
      icon: Package,
    },
    {
      title: "Toko Aktif",
      value: activeStores,
      change: "", 
      icon: Store,
    },
    {
      title: "Penjualan Bulan Ini",
      value: "Rp 0",
      change: "N/A",
      icon: TrendingUp,
    },
    {
      title: "Rata-rata Harga",
      value: "Rp 0",
      change: "N/A",
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            {stat.change && (
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}