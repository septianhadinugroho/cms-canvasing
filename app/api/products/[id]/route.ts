import { type NextRequest, NextResponse } from "next/server"

// Mock database - same as above
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
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = products.find((p) => p.id === params.id)

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const productIndex = products.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    const updatedProduct = {
      ...products[productIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    products[productIndex] = updatedProduct

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productIndex = products.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    const deletedProduct = products[productIndex]
    products.splice(productIndex, 1)

    return NextResponse.json({
      success: true,
      data: deletedProduct,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
