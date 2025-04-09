import { CurrencyConverter } from "@/components/currency-converter"

export default function CurrencyPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Currency Converter</h1>
      <p className="text-muted-foreground mb-8">
        Convert between Indian Rupees (INR) and other major currencies with real-time exchange rates.
      </p>
      <CurrencyConverter className="mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">About Indian Rupee (INR)</h2>
          <p className="text-muted-foreground mb-4">
            The Indian Rupee (₹) is the official currency of India. The currency code for the Rupee is INR and the
            currency symbol is ₹.
          </p>
          <p className="text-muted-foreground mb-4">
            The Indian Rupee is subdivided into 100 paise, although coins of less than 1 rupee are no longer in
            circulation.
          </p>
          <p className="text-muted-foreground">
            The Reserve Bank of India (RBI) is the central bank of India and controls the issuance and supply of the
            Indian Rupee.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Travel Tips</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              • It's advisable to carry some cash in Indian Rupees when traveling in India, especially in rural areas.
            </li>
            <li>• ATMs are widely available in cities and towns across India.</li>
            <li>• Major credit cards are accepted in most hotels, restaurants, and shops in urban areas.</li>
            <li>• Notify your bank before traveling to India to avoid any issues with your cards.</li>
            <li>• Keep track of the exchange rate to ensure you're getting a fair deal when exchanging currency.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

