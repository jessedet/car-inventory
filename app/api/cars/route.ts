import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

// ✅ Prevents too many connections in Vercel serverless
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma =
  globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const make = searchParams.get("make")
  const maxPrice = searchParams.get("maxPrice")

  const cars = await prisma.car.findMany({
    where: {
      ...(make ? { make: { equals: make, mode: "insensitive" as const } } : {}),
      ...(maxPrice ? { price: { lte: Number(maxPrice) } } : {}),
    },
    orderBy: { year: "desc" }, // ✅ default sorting on server
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
