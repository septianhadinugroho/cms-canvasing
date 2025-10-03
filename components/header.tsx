"use client"

import { DateTimeDisplay } from "@/components/date-time-display"

export function Header() {
  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <DateTimeDisplay />
      </div>
    </header>
  )
}