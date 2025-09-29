"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  Store,
  ImageIcon,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Image as BannerIcon,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Banners", href: "/banners", icon: BannerIcon },
  { name: "Stores", href: "/stores", icon: Store },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && <h2 className="text-lg font-semibold text-sidebar-foreground">Canvasing CMS</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                <Link key={item.name} href={item.href} className={cn("flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors", isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent", collapsed && "justify-center")}>
                    <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                    {!collapsed && item.name}
                </Link>
                )
            })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          {!collapsed && (
            <div className="mb-3">
              <p className="text-xs text-sidebar-foreground/70">Logged in as:</p>
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || "User"}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className={cn(
              "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed ? "h-8 w-8 p-0" : "justify-start",
            )}
          >
            <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </div>
    </div>
  )
}