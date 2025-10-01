import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    action: "New Product Added",
    item: "Nike Air Max",
    time: "2 minutes ago",
    status: "success",
  },
  {
    id: 2,
    action: "Store Updated",
    item: "Store JKT-001 details were modified.",
    time: "15 minutes ago",
    status: "info",
  },
  {
    id: 3,
    action: "Salesman Deleted",
    item: "Salesman 'budi.santoso' was removed.",
    time: "1 hour ago",
    status: "warning",
  },
  {
    id: 4,
    action: "New Customer Registered",
    item: "salman (saf4291@gmail.com)",
    time: "3 hours ago",
    status: "success",
  },
]

export function RecentActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
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
                    activity.status === "success" ? "default" : activity.status === "warning" ? "destructive" : "secondary"
                  }
                  className="text-xs capitalize"
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