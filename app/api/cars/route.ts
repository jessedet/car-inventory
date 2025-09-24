import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { requireAuth } from "@/lib/auth"
import { carSchema, querySchema } from "@/lib/validation"
import { createRateLimit } from "@/lib/rate-limit"

// ✅ Prevents too many connections in Vercel serverless
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma =
  globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitCheck = await createRateLimit(request)
    if (!rateLimitCheck) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      )
    }

    // Input validation
    const { searchParams } = new URL(request.url)
    const validationResult = querySchema.safeParse({
      make: searchParams.get("make"),
      maxPrice: searchParams.get("maxPrice")
    })

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { make, maxPrice } = validationResult.data

    const cars = await prisma.car.findMany({
      where: {
        ...(make ? { make: { equals: make, mode: "insensitive" as const } } : {}),
        ...(maxPrice ? { price: { lte: Number(maxPrice) } } : {}),
      },
      orderBy: { year: "desc" },
    })

    return NextResponse.json(cars)
  } catch (error) {
    console.error("GET /api/cars error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentication required for POST
    await requireAuth(request)

    // Rate limiting
    const rateLimitCheck = await createRateLimit(request)
    if (!rateLimitCheck) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    
    // Input validation
    const validationResult = carSchema.safeParse({
      make: body.make,
      model: body.model,
      year: Number(body.year),
      price: Number(body.price),
      quantity: Number(body.quantity),
    })

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    const car = await prisma.car.create({
      data: validatedData,
    })

    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    console.error("POST /api/cars error:", error)
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
