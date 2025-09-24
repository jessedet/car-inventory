"use client"

import { useEffect, useState } from "react"
import type { Car } from "@prisma/client"

export default function Home() {
  const [cars, setCars] = useState<Car[]>([])
  const [make, setMake] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sortBy, setSortBy] = useState("year")

  useEffect(() => {
    let url = "/api/cars"

    const params = new URLSearchParams()
    if (make) params.append("make", make)
    if (maxPrice) params.append("maxPrice", maxPrice)
    if (params.toString()) url += `?${params.toString()}`

    fetch(url)
      .then((res) => res.json())
      .then((data: Car[]) => {
        const sorted = [...data] // ✅ const instead of let
        if (sortBy === "year") {
          sorted.sort((a, b) => b.year - a.year)
        } else if (sortBy === "price") {
          sorted.sort((a, b) => a.price - b.price)
        }
        setCars(sorted)
      })
  }, [make, maxPrice, sortBy])

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
        🚗 Dealership Inventory
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
        <select
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="border border-gray-400 px-3 py-2 rounded-md text-gray-900"
        >
          <option value="">All Makes</option>
          <option value="Toyota">Toyota</option>
          <option value="Honda">Honda</option>
          <option value="Ford">Ford</option>
          <option value="Chevrolet">Chevrolet</option>
          <option value="Tesla">Tesla</option>
          <option value="Jeep">Jeep</option>
          <option value="BMW">BMW</option>
          <option value="Mercedes-Benz">Mercedes-Benz</option>
        </select>

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border border-gray-400 px-3 py-2 rounded-md text-gray-900 placeholder-gray-500"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-400 px-3 py-2 rounded-md text-gray-900"
        >
          <option value="year">Sort by Year (Newest)</option>
          <option value="price">Sort by Price (Lowest)</option>
        </select>
      </div>

      {/* Table */}
      {cars.length === 0 ? (
        <p className="text-center text-gray-600">No cars found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 shadow-sm rounded-lg bg-white">
            <thead className="bg-gray-100 text-gray-900 text-left">
              <tr>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Make</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => (
                <tr
                  key={car.id}
                  className={`border-t ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } text-gray-800 hover:bg-gray-100`}
                >
                  <td className="py-2 px-4">{car.year}</td>
                  <td className="py-2 px-4 font-semibold">{car.make}</td>
                  <td className="py-2 px-4">{car.model}</td>
                  <td className="py-2 px-4 text-green-600 font-medium">
                    ${car.price.toLocaleString()}
                  </td>
                  <td className="py-2 px-4">{car.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
