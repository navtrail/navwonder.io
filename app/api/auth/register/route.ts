import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Validate input
    if (!userData.email || !userData.password || !userData.name) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // In a real app, you would create a user in your database
    // For now, we'll simulate a successful registration
    const user = {
      id: "123",
      name: userData.name,
      email: userData.email,
      // Don't include password in the response
    }

    return NextResponse.json({ user, token: "mock-jwt-token" })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}

