import { NextResponse } from "next/server"
import { getCurrencyApiKey } from "@/lib/api-keys"

// Mock exchange rates for when API key is missing
const mockExchangeRates = {
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  JPY: 1.78,
  AUD: 0.018,
  CAD: 0.016,
  SGD: 0.016,
  AED: 0.044,
  SAR: 0.045,
  INR: 1.0,
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const amount = Number.parseFloat(searchParams.get("amount") || "1")
    const from = searchParams.get("from") || "INR"
    const to = searchParams.get("to") || "USD"
    const apiKey = getCurrencyApiKey()

    if (isNaN(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    if (!apiKey) {
      console.warn("Currency API key is missing. Using mock data.")

      // Calculate conversion using mock rates
      const fromRate = mockExchangeRates[from as keyof typeof mockExchangeRates] || 1
      const toRate = mockExchangeRates[to as keyof typeof mockExchangeRates] || 1
      const conversionRate = toRate / fromRate
      const convertedAmount = amount * conversionRate

      return NextResponse.json({
        from,
        to,
        amount,
        convertedAmount,
        rate: conversionRate,
        timestamp: new Date().toISOString(),
        note: "Using mock data. Add NEXT_PUBLIC_CURRENCY_API_KEY to your .env.local file for real data.",
      })
    }

    // Using ExchangeRate-API as an example
    // Adjust the URL based on your chosen currency API provider
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`)

    if (!response.ok) {
      throw new Error(`Currency API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      from,
      to,
      amount,
      convertedAmount: data.conversion_result,
      rate: data.conversion_rate,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Currency conversion error:", error)
    return NextResponse.json({ error: "Failed to convert currency. Please try again later." }, { status: 500 })
  }
}

