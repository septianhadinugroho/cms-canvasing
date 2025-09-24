import { type NextRequest, NextResponse } from "next/server"

// Mock users database
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
  {
    id: "2",
    name: "Editor Konten",
    email: "editor@canvasing.com",
    role: "editor",
    status: "active",
    lastLogin: "2024-07-28T12:30:00Z",
    avatar: "/placeholder-user.jpg",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let filteredUsers = [...users]

    if (role && role !== "all") {
      filteredUsers = filteredUsers.filter((u) => u.role === role)
    }
    if (status && status !== "all") {
      filteredUsers = filteredUsers.filter((u) => u.status === status)
    }
    if (search) {
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredUsers,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
    try {
      const body = await request.json()
  
      const requiredFields = ["name", "email", "role"]
      for (const field of requiredFields) {
        if (!body[field]) {
          return NextResponse.json({ success: false, error: `Field '${field}' is required` }, { status: 400 })
        }
      }
  
      const newUser = {
        id: (users.length + 1).toString(),
        ...body,
        status: body.status || "active",
        lastLogin: new Date().toISOString(),
        avatar: "/placeholder-user.jpg",
      }
  
      users.push(newUser)
  
      return NextResponse.json(
        {
          success: true,
          data: newUser,
        },
        { status: 201 },
      )
    } catch (error) {
      return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
    }
  }