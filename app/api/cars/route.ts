import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const make = searchParams.get("make")
  const maxPrice = searchParams.get("maxPrice")

  const cars = await prisma.car.findMany({
    where: {
      ...(make ? { make: { equals: make, mode: "insensitive" } } : {}),
      ...(maxPrice ? { price: { lte: Number(maxPrice) } } : {})
    }
  })

  return NextResponse.json(cars)
}

export async function POST(request: Request) {
  const body = await request.json()
  const car = await prisma.car.create({
    data: {
      make: body.make,
      model: body.model,
      year: Number(body.year),
      price: Number(body.price),
      quantity: Number(body.quantity),
    },
  })
  return NextResponse.json(car, { status: 201 })
}
