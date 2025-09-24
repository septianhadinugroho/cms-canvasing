import { type NextRequest, NextResponse } from "next/server"

// Mock database
const users = [
    {
      id: "1",
      name: "Admin Utama",
      email: "admin@canvasing.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-07-28T10:00:00Z",
      avatar: "/placeholder-user.jpg",
    },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = users.find((u) => u.id === params.id)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await request.json()
      const userIndex = users.findIndex((u) => u.id === params.id)
  
      if (userIndex === -1) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
      }
  
      const updatedUser = {
        ...users[userIndex],
        ...body,
      }
  
      users[userIndex] = updatedUser
  
      return NextResponse.json({
        success: true,
        data: updatedUser,
      })
    } catch (error) {
      return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
    }
  }

  export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userIndex = users.findIndex((u) => u.id === params.id)
  
      if (userIndex === -1) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
      }
  
      const deletedUser = users[userIndex]
      users.splice(userIndex, 1)
  
      return NextResponse.json({
        success: true,
        data: deletedUser,
      })
    } catch (error) {
      return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 })
    }
  }