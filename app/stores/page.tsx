"use client"

import { useState, useCallback, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StoresGrid } from "@/components/stores-grid"
import { StoreForm } from "@/components/store-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { Plus, Search } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Store } from "@/types"

export default function AllStoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStoreCode, setSelectedStoreCode] = useState("")
  const [storeOptions, setStoreOptions] = useState<{ value: string; label: string }[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchStoreCodes = async () => {
      try {
        const stores = await api.get<Store[]>('/stores/all');
        const options = stores.map(store => ({
          value: store.store_code.toLowerCase(),
          label: store.store_code
        }));
        // Tambahkan opsi "All" di paling atas
        setStoreOptions([{ value: "all", label: "All Store Codes" }, ...options]);
      } catch (error) {
        console.error("Failed to fetch store codes for filter.");
      }
    };
    fetchStoreCodes();
  }, [refreshKey]);


  const handleRefresh = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  const handleAddStore = async (storeData: Partial<Store>) => {
    try {
      await api.post("/stores", storeData);
      toast({ title: "Success!", description: "Store successfully added." });
      setIsAddDialogOpen(false);
      handleRefresh();
    } catch (error: any) {
      toast({
        title: "Feature In Development",
        description: `Could not add store: The backend API is not ready yet.`,
        variant: "destructive"
      });
    }
  };

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
                <h1 className="text-3xl font-semibold text-foreground mb-2">Store Management</h1>
                <p className="text-muted-foreground">View and manage all stores in the system</p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Store
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Add New Store</DialogTitle>
                  </DialogHeader>
                  <StoreForm
                    onClose={() => setIsAddDialogOpen(false)}
                    onSave={handleAddStore}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 mb-6 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search within filtered results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              {/* === KOMPONEN COMBOBOX BARU === */}
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isFilterOpen}
                    className="w-[280px] justify-between"
                  >
                    {selectedStoreCode
                      ? storeOptions.find((option) => option.value === selectedStoreCode)?.label
                      : "Filter by Store Code"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0">
                  <Command>
                    <CommandInput placeholder="Search store code..." />
                    <CommandList>
                      <CommandEmpty>No store code found.</CommandEmpty>
                      <CommandGroup>
                        {storeOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            // Perbaikan di sini: tambahkan tipe string
                            onSelect={(currentValue: string) => {
                              const finalValue = currentValue === selectedStoreCode ? "" : currentValue;
                              setSelectedStoreCode(finalValue === "all" ? "" : finalValue)
                              setIsFilterOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedStoreCode === option.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <StoresGrid
              key={refreshKey}
              searchTerm={searchTerm}
              selectedStoreCode={selectedStoreCode}
              endpoint="/stores/all"
              onRefresh={handleRefresh}
            />
          </div>
        </main>
      </div>
    </div>
  )
}