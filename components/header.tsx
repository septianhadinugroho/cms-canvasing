"use client"

import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { DateTimeDisplay } from "@/components/date-time-display"

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <DateTimeDisplay />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-foreground hover:bg-accent" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  )
}
