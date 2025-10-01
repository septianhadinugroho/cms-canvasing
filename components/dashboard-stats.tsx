"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Store, Users, User } from "lucide-react" // Import new icons
import { api } from "@/lib/api"
import type { Product, Store as StoreType, Salesman, Customer } from "@/types"

interface ProductApiResponse {
  items: Product[]
  pagination: { totalData: number }
}

export function DashboardStats() {
  const [totalProducts, setTotalProducts] = useState<number | string>("...")
  const [totalStores, setTotalStores] = useState<number | string>("...")
  const [totalSalesmen, setTotalSalesmen] = useState<number | string>("...")
  const [totalCustomers, setTotalCustomers] = useState<number | string>("...")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data concurrently
        const [
          productsResponse, 
          storesResponse, 
          salesmenResponse, 
          customersResponse
        ] = await Promise.all([
          api.get<ProductApiResponse>('/products/all', { limit: 1 }),
          api.get<StoreType[]>('/stores/all'),
          api.get<Salesman[]>('/salesman'),
          api.get<Customer[]>('/customers/all')
        ]);
        
        setTotalProducts(productsResponse.pagination.totalData);
        setTotalStores(storesResponse.length);
        setTotalSalesmen(salesmenResponse.length);
        setTotalCustomers(customersResponse.length);

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setTotalProducts("Error");
        setTotalStores("Error");
        setTotalSalesmen("Error");
        setTotalCustomers("Error");
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
    },
    {
      title: "Total Stores",
      value: totalStores,
      icon: Store,
    },
    {
      title: "Total Salesmen",
      value: totalSalesmen,
      icon: Users,
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: User,
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}