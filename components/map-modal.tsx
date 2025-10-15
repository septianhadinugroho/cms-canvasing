"use client"

import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L, { LatLng } from "leaflet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (location: { address: string; latitude: number; longitude: number }) => void
  initialPosition?: { lat: number; lng: number }
}

interface LocationMarkerProps {
  position: LatLng | null;
  setPosition: Dispatch<SetStateAction<LatLng | null>>;
  setAddress: Dispatch<SetStateAction<string>>;
}


function LocationMarker({ position, setPosition, setAddress }: LocationMarkerProps) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
      // Fetch address from coordinates
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(response => response.json())
        .then(data => {
          setAddress(data.display_name || "Address not found")
        })
        .catch(err => {
          console.error("Error fetching address: ", err)
          setAddress("Could not fetch address")
        })
    },
  })

  return position === null ? null : <Marker position={position}></Marker>
}

export function MapModal({ isOpen, onClose, onSave, initialPosition }: MapModalProps) {
  const [position, setPosition] = useState<LatLng | null>(initialPosition ? new L.LatLng(initialPosition.lat, initialPosition.lng) : null)
  const [address, setAddress] = useState("")

  useEffect(() => {
    if (initialPosition) {
      const latLng = new L.LatLng(initialPosition.lat, initialPosition.lng)
      setPosition(latLng)
      // Fetch initial address if position is provided
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${initialPosition.lat}&lon=${initialPosition.lng}`)
        .then(response => response.json())
        .then(data => {
          setAddress(data.display_name || "")
        })
        .catch(err => console.error("Error fetching initial address: ", err))
    }
  }, [initialPosition])

  const handleSave = () => {
    if (position) {
      onSave({
        address,
        latitude: position.lat,
        longitude: position.lng,
      })
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle>Set Store Location</DialogTitle>
        </DialogHeader>
        <div className="map-container">
          <MapContainer
            center={initialPosition || [ -6.200000, 106.816666 ]} // Default to Jakarta
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} />
          </MapContainer>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Address will be auto-filled by clicking the map" />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={!position}>
            Save Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}