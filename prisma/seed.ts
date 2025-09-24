import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.car.createMany({
    data: [
      // Toyota
      { make: "Toyota", model: "Camry", year: 2022, price: 27000, quantity: 6 },
      { make: "Toyota", model: "RAV4", year: 2023, price: 32000, quantity: 4 },
      { make: "Toyota", model: "Tacoma", year: 2021, price: 35000, quantity: 3 },

      // Honda
      { make: "Honda", model: "Civic", year: 2022, price: 24000, quantity: 8 },
      { make: "Honda", model: "Accord", year: 2023, price: 29000, quantity: 5 },
      { make: "Honda", model: "CR-V", year: 2023, price: 31000, quantity: 4 },

      // Ford
      { make: "Ford", model: "F-150", year: 2022, price: 42000, quantity: 7 },
      { make: "Ford", model: "Escape", year: 2021, price: 27000, quantity: 3 },
      { make: "Ford", model: "Mustang", year: 2023, price: 46000, quantity: 2 },

      // Chevrolet
      { make: "Chevrolet", model: "Silverado 1500", year: 2022, price: 41000, quantity: 6 },
      { make: "Chevrolet", model: "Equinox", year: 2021, price: 26000, quantity: 4 },
      { make: "Chevrolet", model: "Tahoe", year: 2023, price: 55000, quantity: 2 },

      // Tesla
      { make: "Tesla", model: "Model 3", year: 2023, price: 42000, quantity: 5 },
      { make: "Tesla", model: "Model Y", year: 2023, price: 52000, quantity: 3 },

      // Jeep
      { make: "Jeep", model: "Wrangler", year: 2022, price: 38000, quantity: 4 },
      { make: "Jeep", model: "Grand Cherokee", year: 2021, price: 40000, quantity: 3 },

      // BMW
      { make: "BMW", model: "X5", year: 2022, price: 60000, quantity: 2 },
      { make: "BMW", model: "3 Series", year: 2023, price: 47000, quantity: 3 },

      // Mercedes
      { make: "Mercedes-Benz", model: "C-Class", year: 2022, price: 48000, quantity: 2 },
      { make: "Mercedes-Benz", model: "GLC", year: 2023, price: 54000, quantity: 2 }
    ]
  })
}

main()
  .then(() => console.log("✅ Dealership inventory seeded!"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
