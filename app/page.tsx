"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { useAuth } from "@/components/auth-provider"

export default function Dashboard() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <p className="text-muted-foreground">Kelola produk, harga, stok, dan toko Anda dengan mudah</p>
            </div>

            <DashboardStats />
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  )
}
