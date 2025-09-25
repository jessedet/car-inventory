// TypeScript interfaces for Car Inventory API
// These match the OpenAI function schema and your API routes

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  quantity: number;
}

export interface CarFilters {
  make?: string;
  maxPrice?: number;
}

export interface CreateCarData {
  make: string;
  model: string;
  year: number;
  price: number;
  quantity: number;
}

export interface UpdateCarData extends CreateCarData {
  id: string;
}

export interface DeleteCarData {
  id: string;
}

export type CarOperation = 'get_cars' | 'create_car' | 'update_car' | 'delete_car';

export interface CarInventoryRequest {
  operation: CarOperation;
  filters?: CarFilters;
  car_data?: CreateCarData | UpdateCarData | DeleteCarData;
}

// API Response types
export interface CarApiResponse {
  success: boolean;
  data?: Car | Car[];
  error?: string;
  details?: any;
}

// OpenAI Function Schema (matches the JSON schema)
export const carInventoryFunctionSchema = {
  name: "car_inventory_api",
  description: "A comprehensive car inventory management API with CRUD operations",
  parameters: {
    type: "object",
    properties: {
      operation: {
        type: "string",
        enum: ["get_cars", "create_car", "update_car", "delete_car"],
        description: "The operation to perform on the car inventory"
      },
      filters: {
        type: "object",
        properties: {
          make: {
            type: "string",
            description: "Filter cars by manufacturer (e.g., 'Toyota', 'Honda', 'Ford')"
          },
          maxPrice: {
            type: "number",
            description: "Filter cars by maximum price"
          }
        },
        description: "Optional filters for GET operations"
      },
      car_data: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Car ID (required for update/delete operations)"
          },
          make: {
            type: "string",
            minLength: 1,
            maxLength: 50,
            description: "Car manufacturer (required for create/update)"
          },
          model: {
            type: "string",
            minLength: 1,
            maxLength: 50,
            description: "Car model (required for create/update)"
          },
          year: {
            type: "integer",
            minimum: 1900,
            maximum: 2025,
            description: "Car year (required for create/update)"
          },
          price: {
            type: "number",
            minimum: 0.01,
            maximum: 1000000,
            description: "Car price in USD (required for create/update)"
          },
          quantity: {
            type: "integer",
            minimum: 0,
            maximum: 1000,
            description: "Available quantity (required for create/update)"
          }
        },
        description: "Car data for create/update operations"
      }
    },
    required: ["operation"],
    additionalProperties: false
  }
} as const;

// Helper functions for API calls
export class CarInventoryAPI {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  async getCars(filters?: CarFilters): Promise<Car[]> {
    const params = new URLSearchParams();
    if (filters?.make) params.append('make', filters.make);
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    
    const response = await fetch(`${this.baseUrl}/cars?${params}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  async createCar(carData: CreateCarData): Promise<Car> {
    const response = await fetch(`${this.baseUrl}/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  async updateCar(carData: UpdateCarData): Promise<Car> {
    const response = await fetch(`${this.baseUrl}/cars`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  async deleteCar(id: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/cars?id=${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
}
