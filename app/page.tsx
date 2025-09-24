"use client"

import { useEffect, useState } from "react"
import type { Prisma } from "@prisma/client"

// ✅ Prisma-safe type for Car (fixed lint issue)
type Car = Prisma.CarGetPayload<true>

export default function Home() {
  const [cars, setCars] = useState<Car[]>([])
  const [make, setMake] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sortBy, setSortBy] = useState("year")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [newCar, setNewCar] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    quantity: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let url = "/api/cars"

    const params = new URLSearchParams()
    if (make) params.append("make", make)
    if (maxPrice) params.append("maxPrice", maxPrice)
    if (params.toString()) url += `?${params.toString()}`

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        // Check if data is an array
        if (Array.isArray(data)) {
          const sorted = [...data]
          if (sortBy === "year") {
            sorted.sort((a, b) => b.year - a.year)
          } else if (sortBy === "price") {
            sorted.sort((a, b) => a.price - b.price)
          }
          setCars(sorted)
        } else {
          console.error("API returned non-array data:", data)
          setCars([])
        }
      })
      .catch((error) => {
        console.error("Error fetching cars:", error)
        setCars([])
      })
  }, [make, maxPrice, sortBy])

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCar),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add car")
      }

      const addedCar = await response.json()
      setCars([...cars, addedCar])
      setNewCar({ make: "", model: "", year: "", price: "", quantity: "" })
      setShowAddForm(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add car")
    } finally {
      setLoading(false)
    }
  }

  const handleEditCar = (car: Car) => {
    setEditingCar(car)
    setNewCar({
      make: car.make,
      model: car.model,
      year: car.year.toString(),
      price: car.price.toString(),
      quantity: car.quantity.toString()
    })
    setShowEditForm(true)
    setShowAddForm(false)
  }

  const handleUpdateCar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCar) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/cars", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingCar.id,
          ...newCar
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update car")
      }

      const updatedCar = await response.json()
      setCars(cars.map(car => car.id === updatedCar.id ? updatedCar : car))
      setNewCar({ make: "", model: "", year: "", price: "", quantity: "" })
      setShowEditForm(false)
      setEditingCar(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update car")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCar = async (carId: string) => {
    if (!confirm("Are you sure you want to delete this car?")) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/cars?id=${carId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete car")
      }

      setCars(cars.filter(car => car.id !== carId))
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete car")
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setShowEditForm(false)
    setEditingCar(null)
    setNewCar({ make: "", model: "", year: "", price: "", quantity: "" })
  }


  return (
    <div className="min-h-screen bg-gray-50 p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">
          🚗 Dealership Inventory
        </h1>
        <div className="text-gray-600">
          Open Car Inventory System
        </div>
      </div>

      {/* Add Car Button */}
      <div className="mb-6 text-center">
        <button
          onClick={() => {
            setShowAddForm(!showAddForm)
            setShowEditForm(false)
            setEditingCar(null)
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
        >
          {showAddForm ? "Cancel" : "Add New Car"}
        </button>
      </div>

      {/* Add Car Form */}
      {showAddForm && (
        <div className="max-w-md mx-auto mb-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">Add New Car</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleAddCar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Make
              </label>
              <input
                type="text"
                required
                value={newCar.make}
                onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                required
                value={newCar.model}
                onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                required
                value={newCar.year}
                onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                required
                value={newCar.price}
                onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                required
                value={newCar.quantity}
                onChange={(e) => setNewCar({ ...newCar, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Car"}
            </button>
          </form>
        </div>
      )}

      {/* Edit Car Form */}
      {showEditForm && editingCar && (
        <div className="max-w-md mx-auto mb-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">Edit Car</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleUpdateCar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Make
              </label>
              <input
                type="text"
                required
                value={newCar.make}
                onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                required
                value={newCar.model}
                onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                required
                value={newCar.year}
                onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                required
                value={newCar.price}
                onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                required
                value={newCar.quantity}
                onChange={(e) => setNewCar({ ...newCar, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Car"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
          className="border border-gray-400 px-3 py-2 rounded-md text-black placeholder-gray-500 bg-white"
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
                <th className="py-3 px-4">Actions</th>
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
                  <td className="py-2 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCar(car)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
