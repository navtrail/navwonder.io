"use client"

import type React from "react"

interface TravelChecklistProps {
  items: {
    id: number
    label: string
    completed: boolean
  }[]
  onItemToggle: (id: number) => void
}

const TravelChecklist: React.FC<TravelChecklistProps> = ({ items, onItemToggle }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <label>
            <input type="checkbox" checked={item.completed} onChange={() => onItemToggle(item.id)} />
            {item.label}
          </label>
        </li>
      ))}
    </ul>
  )
}

export default TravelChecklist

