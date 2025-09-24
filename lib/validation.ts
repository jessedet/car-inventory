import { z } from "zod"

export const carSchema = z.object({
  make: z.string().min(1, "Make is required").max(50, "Make too long"),
  model: z.string().min(1, "Model is required").max(50, "Model too long"),
  year: z.number().int().min(1900, "Year too old").max(new Date().getFullYear() + 1, "Year too new"),
  price: z.number().positive("Price must be positive").max(1000000, "Price too high"),
  quantity: z.number().int().min(0, "Quantity cannot be negative").max(1000, "Quantity too high")
})

export const querySchema = z.object({
  make: z.string().max(50).optional().nullable(),
  maxPrice: z.string().optional().nullable()
})

export type CarInput = z.infer<typeof carSchema>
export type QueryInput = z.infer<typeof querySchema>
