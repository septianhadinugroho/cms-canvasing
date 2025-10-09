// app/cashiers/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { CashiersTable } from "@/components/cashiers-table"
import { useAuth } from "@/components/auth-provider"
import { api } from "@/lib/api"
import { Cashier } from "@/types" // Pastikan tipe Cashier ada di types/index.ts
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function CashiersPage() {
  const { isAuthenticated } = useAuth();
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCashiers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<Cashier[]>("/cashier");
        setCashiers(response);
      } catch (error: any) {
        toast({
          title: "Gagal Memuat Data",
          description: "Tidak dapat mengambil daftar kasir dari server.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCashiers();
    }
  }, [isAuthenticated, toast]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="container mx-auto">
            {isLoading ? (
              <div>
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ) : (
              <CashiersTable cashiers={cashiers} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}