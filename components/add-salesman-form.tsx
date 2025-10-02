// components/add-salesman-form.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { Store } from "@/types"
import { api } from "@/lib/api"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"


interface AddSalesmanFormProps {
  onClose: () => void
  onSave: () => void
}

export function AddSalesmanForm({ onClose, onSave }: AddSalesmanFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    store_id: "",
  })
  const [stores, setStores] = useState<Store[]>([]);
  const [isStorePopoverOpen, setStorePopoverOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storeData = await api.get<Store[]>('/stores/all');
        setStores(storeData);
      } catch (error) {
        console.error("Failed to fetch stores", error);
        toast({
          title: "Error",
          description: "Failed to load store data.",
          variant: "destructive",
        })
      }
    };
    fetchStores();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
        await api.post(`/auth/regis`, formData);
        toast({ title: "Success!", description: "Salesman added successfully." });
        onSave();
        onClose();
    } catch (error: any) {
        toast({ title: "Failed", description: error.message, variant: "destructive" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={formData.username} onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))} placeholder="john.doe" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="store_id">Store</Label>
            <Popover open={isStorePopoverOpen} onOpenChange={setStorePopoverOpen} modal={false}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isStorePopoverOpen}
                  className="w-full justify-between font-normal"
                >
                  {formData.store_id
                    ? stores.find((store) => store.store_code === formData.store_id)?.store_name
                    : "Select store..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search store..." />
                  <CommandList>
                    <CommandEmpty>No store found.</CommandEmpty>
                    <CommandGroup>
                      {stores.map((store) => (
                        <CommandItem
                          key={store.id}
                          value={`${store.store_code} - ${store.store_name}`}
                          onSelect={() => {
                            setFormData(prev => ({ ...prev, store_id: store.store_code }))
                            setStorePopoverOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.store_id === store.store_code ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="font-mono text-xs w-16">{store.store_code}</span>
                          <span className="truncate">{store.store_name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Add Salesman</Button>
      </div>
    </form>
  )
}