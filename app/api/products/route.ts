import { type NextRequest, NextResponse } from "next/server"

// Mock database - in real app, this would be your actual database
const products = [
  {
    id: "1",
    name: "Nike Air Max 270",
    category: "sepatu",
    price: 1250000,
    stock: 25,
    store: "jakarta",
    status: "active",
    image: "/product-1.png",
    description: "Sepatu olahraga premium dengan teknologi Air Max",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Adidas Ultraboost 22",
    category: "sepatu",
    price: 1800000,
    stock: 0,
    store: "bandung",
    status: "out-of-stock",
    image: "/product-2.png",
    description: "Sepatu lari dengan teknologi Boost terdepan",
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const store = searchParams.get("store")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let filteredProducts = [...products]

    // Apply filters
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.category === category)
    }
    if (store && store !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.store === store)
    }
    if (status && status !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.status === status)
    }
    if (search) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply pagination
    const total = filteredProducts.length
    const paginatedProducts = filteredProducts.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "category", "price", "stock", "store"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Field '${field}' is required` }, { status: 400 })
      }
    }

    const newProduct = {
      id: (products.length + 1).toString(),
      ...body,
      status: body.status || "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    products.push(newProduct)

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
