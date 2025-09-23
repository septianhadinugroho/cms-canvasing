import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    action: "Produk baru ditambahkan",
    item: "Sepatu Nike Air Max",
    time: "2 menit yang lalu",
    status: "success",
  },
  {
    id: 2,
    action: "Stok diperbarui",
    item: "Tas Adidas Original",
    time: "15 menit yang lalu",
    status: "info",
  },
  {
    id: 3,
    action: "Harga diubah",
    item: "Jaket Uniqlo",
    time: "1 jam yang lalu",
    status: "warning",
  },
  {
    id: 4,
    action: "Toko baru ditambahkan",
    item: "Toko Pusat Jakarta",
    time: "3 jam yang lalu",
    status: "success",
  },
]

export function RecentActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.item}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    activity.status === "success" ? "default" : activity.status === "warning" ? "secondary" : "outline"
                  }
                  className="text-xs"
                >
                  {activity.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
