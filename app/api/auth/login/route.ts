import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const apiKey = process.env.NEXT_PUBLIC_AUTH_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "Auth API key is missing. Please add NEXT_PUBLIC_AUTH_API_KEY to your .env.local file." },
        { status: 500 },
      )
    }

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // In a real app, you would authenticate against your auth provider
    // This is a placeholder implementation
    // You would typically use Firebase Auth, Auth0, or your own auth system

    // Mock successful login
    const user = {
      id: "123",
      name: "Sattu",
      email: email,
      // Don't include password in the response
    }

    return NextResponse.json({
      user,
      token: "mock-jwt-token",
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

