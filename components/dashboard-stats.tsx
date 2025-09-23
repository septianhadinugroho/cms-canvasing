import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Store, TrendingUp, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Total Produk",
    value: "1,234",
    change: "+12%",
    icon: Package,
  },
  {
    title: "Toko Aktif",
    value: "23",
    change: "+3%",
    icon: Store,
  },
  {
    title: "Penjualan Bulan Ini",
    value: "Rp 45.2M",
    change: "+18%",
    icon: TrendingUp,
  },
  {
    title: "Rata-rata Harga",
    value: "Rp 125K",
    change: "+5%",
    icon: DollarSign,
  },
]

export function DashboardStats() {
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
            <p className="text-xs text-green-500 mt-1">{stat.change} dari bulan lalu</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
