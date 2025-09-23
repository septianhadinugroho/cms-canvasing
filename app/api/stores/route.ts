import { type NextRequest, NextResponse } from "next/server"

// Mock stores database
const stores = [
  {
    id: "1",
    name: "Toko Jakarta Pusat",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    city: "jakarta",
    phone: "+62 21 1234 5678",
    manager: "Budi Santoso",
    status: "active",
    totalProducts: 245,
    monthlySales: 45200000,
    coordinates: { lat: -6.2088, lng: 106.8456 },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Toko Bandung Utara",
    address: "Jl. Dago No. 45, Bandung",
    city: "bandung",
    phone: "+62 22 9876 5432",
    manager: "Sari Dewi",
    status: "active",
    totalProducts: 189,
    monthlySales: 32500000,
    coordinates: { lat: -6.8951, lng: 107.6084 },
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let filteredStores = [...stores]

    if (city && city !== "all") {
      filteredStores = filteredStores.filter((s) => s.city === city)
    }
    if (status && status !== "all") {
      filteredStores = filteredStores.filter((s) => s.status === status)
    }
    if (search) {
      filteredStores = filteredStores.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.address.toLowerCase().includes(search.toLowerCase()) ||
          s.manager.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredStores,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch stores" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const requiredFields = ["name", "address", "city", "phone", "manager"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Field '${field}' is required` }, { status: 400 })
      }
    }

    const newStore = {
      id: (stores.length + 1).toString(),
      ...body,
      status: body.status || "active",
      totalProducts: 0,
      monthlySales: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    stores.push(newStore)

    return NextResponse.json(
      {
        success: true,
        data: newStore,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create store" }, { status: 500 })
  }
}
