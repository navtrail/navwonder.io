import type React from "react"

interface TravelVisasProps {
  visaRequirements: {
    country: string
    does: string
    not: string
    need: string
    any: string
    modifications: string
  }[]
}

const TravelVisas: React.FC<TravelVisasProps> = ({ visaRequirements }) => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Visa Requirements</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Country</th>
              <th className="py-2 px-4 border-b">Does</th>
              <th className="py-2 px-4 border-b">Not</th>
              <th className="py-2 px-4 border-b">Need</th>
              <th className="py-2 px-4 border-b">Any</th>
              <th className="py-2 px-4 border-b">Modifications</th>
            </tr>
          </thead>
          <tbody>
            {visaRequirements.map((visa, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-4 border-b">{visa.country}</td>
                <td className="py-2 px-4 border-b">{visa.does}</td>
                <td className="py-2 px-4 border-b">{visa.not}</td>
                <td className="py-2 px-4 border-b">{visa.need}</td>
                <td className="py-2 px-4 border-b">{visa.any}</td>
                <td className="py-2 px-4 border-b">{visa.modifications}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TravelVisas

