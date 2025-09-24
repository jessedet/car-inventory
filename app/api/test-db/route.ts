import { NextResponse } from "next/server"
import { prisma } from "@/app/api/cars/route"

export async function GET() {
  try {
    console.log("Testing database connection...")
    
    // Test basic connection
    await prisma.$connect()
    console.log("Database connected successfully")
    
    // Test query
    const userCount = await prisma.user.count()
    const carCount = await prisma.car.count()
    
    console.log(`Found ${userCount} users and ${carCount} cars`)
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: {
        userCount,
        carCount,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error("Database test failed:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
