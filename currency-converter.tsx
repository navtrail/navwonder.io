"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, RefreshCw, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getCurrencyApiKey } from "@/lib/api-keys"

interface CurrencyConverterProps {
  className?: string
}

interface ConversionResult {
  from: string
  to: string
  amount: number
  convertedAmount: number
  rate: number
}

export function CurrencyConverter({ className }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<number>(1000)
  const [fromCurrency, setFromCurrency] = useState<string>("INR")
  const [toCurrency, setToCurrency] = useState<string>("USD")
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [rates, setRates] = useState<Record<string, number> | null>(null)
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(true)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)

  // Fetch available rates on component mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setIsLoadingRates(true)

        // Check if API key exists
        const apiKey = getCurrencyApiKey()
        if (!apiKey) {
          setApiKeyMissing(true)
          setIsLoadingRates(false)
          return
        }

        const response = await fetch(`/api/currency/rates?base=INR`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch currency rates")
        }

        const data = await response.json()
        setRates(data.rates)
      } catch (err) {
        console.error("Currency rates fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch currency rates")
      } finally {
        setIsLoadingRates(false)
      }
    }

    fetchRates()
  }, [])

  const handleConvert = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/currency/convert?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to convert currency")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error("Currency conversion error:", err)
      setError(err instanceof Error ? err.message : "Failed to convert currency")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
    // Clear the result
    setResult(null)
  }

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Common currencies for India
  const popularCurrencies = [
    { code: "INR", name: "Indian Rupee (₹)" },
    { code: "USD", name: "US Dollar ($)" },
    { code: "EUR", name: "Euro (€)" },
    { code: "GBP", name: "British Pound (£)" },
    { code: "JPY", name: "Japanese Yen (¥)" },
    { code: "AUD", name: "Australian Dollar ($)" },
    { code: "CAD", name: "Canadian Dollar ($)" },
    { code: "SGD", name: "Singapore Dollar ($)" },
    { code: "AED", name: "UAE Dirham (د.إ)" },
    { code: "SAR", name: "Saudi Riyal (﷼)" },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert between Indian Rupees and other currencies</CardDescription>
      </CardHeader>
      <CardContent>
        {apiKeyMissing ? (
          <div className="text-center p-4">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="font-medium mb-1">Currency API Key Missing</p>
            <p className="text-sm text-muted-foreground mb-3">
              Add NEXT_PUBLIC_CURRENCY_API_KEY to your .env.local file to enable currency conversion.
            </p>
            <Button variant="outline" size="sm" onClick={() => (window.location.href = "/api-status")}>
              Check API Status
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            {isLoadingRates ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-2">
                <div>
                  <Label htmlFor="from-currency">From</Label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger id="from-currency" className="mt-1">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularCurrencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="ghost" size="icon" onClick={handleSwapCurrencies} className="mb-1">
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div>
                  <Label htmlFor="to-currency">To</Label>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger id="to-currency" className="mt-1">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularCurrencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {error && (
              <div className="p-2 bg-destructive/10 text-destructive rounded-md flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p>{error}</p>
                  <p className="text-sm mt-1">Please check your API key in .env.local</p>
                </div>
              </div>
            )}

            {result && (
              <div className="p-4 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">Result:</div>
                <div className="text-xl font-bold mt-1">
                  {formatCurrency(result.amount, result.from)} = {formatCurrency(result.convertedAmount, result.to)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Exchange Rate: 1 {result.from} = {formatCurrency(result.rate, result.to)}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleConvert}
          disabled={isLoading || amount <= 0 || isLoadingRates || apiKeyMissing}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            "Convert"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

