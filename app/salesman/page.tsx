"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SalesmanTable } from "@/components/salesman-table"
import { useAuth } from "@/components/auth-provider"

export default function SalesmanPage() {
  const [refreshKey, setRefreshKey] = useState(0); 
  const { isAuthenticated } = useAuth()
    
  if (!isAuthenticated) {
    return null
  }

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1) 
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-foreground mb-2">Salesman Management</h1>
                <p className="text-muted-foreground">View, update, and manage salesmen in the system</p>
              </div>
            </div>
            
            <SalesmanTable key={refreshKey} onRefresh={handleRefresh} />

          </div>
        </main>
      </div>
    </div>
  )
}