import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    // Mock data for Indian locations
    const places = [
      {
        id: "1",
        name: "Taj Mahal",
        location: "Agra, Uttar Pradesh, India",
        type: "attraction",
        rating: 4.9,
        imageUrl: "/placeholder.svg?height=150&width=300",
      },
      {
        id: "2",
        name: "Gateway of India",
        location: "Mumbai, Maharashtra, India",
        type: "attraction",
        rating: 4.7,
        imageUrl: "/placeholder.svg?height=150&width=300",
      },
      {
        id: "3",
        name: "Taj Palace Hotel",
        location: "New Delhi, India",
        type: "hotel",
        rating: 4.8,
        imageUrl: "/placeholder.svg?height=150&width=300",
      },
      {
        id: "4",
        name: "Bukhara Restaurant",
        location: "New Delhi, India",
        type: "restaurant",
        rating: 4.9,
        imageUrl: "/placeholder.svg?height=150&width=300",
      },
      {
        id: "5",
        name: "Jaipur City Palace",
        location: "Jaipur, Rajasthan, India",
        type: "attraction",
        rating: 4.6,
        imageUrl: "/placeholder.svg?height=150&width=300",
      },
      {
        id: "6",
        name: "Mysore Palace",
        location: "Mysore, Karnataka, India",
        type: "attraction",
        rating: 4.7,
        imageUrl: "/placeholder.svg?height=150&width=300",
      },
    ]

    // Filter places based on query
    const filteredPlaces = query
      ? places.filter(
          (place) =>
            place.name.toLowerCase().includes(query.toLowerCase()) ||
            place.location.toLowerCase().includes(query.toLowerCase()),
        )
      : places

    return NextResponse.json({ places: filteredPlaces })
  } catch (error) {
    console.error("Places search error:", error)
    return NextResponse.json({ error: "Failed to search places" }, { status: 500 })
  }
}

