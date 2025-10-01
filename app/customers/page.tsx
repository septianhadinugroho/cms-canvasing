"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CustomersTable } from "@/components/customers-table"
import { useAuth } from "@/components/auth-provider"

export default function CustomersPage() {
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-foreground mb-2">Customer Management</h1>
                <p className="text-muted-foreground">View all customer data in the system</p>
              </div>
            </div>
            
            <CustomersTable />

          </div>
        </main>
      </div>
    </div>
  )
}