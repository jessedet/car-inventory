# OpenAI Integration Example for Car Inventory API

## Production API Endpoint
Your car inventory API is deployed at: **https://car-inventory-black.vercel.app/api/cars**

## OpenAI Function Schema Usage

### 1. Function Definition
```json
{
  "name": "car_inventory_api",
  "description": "A comprehensive car inventory management API with CRUD operations",
  "parameters": {
    "type": "object",
    "properties": {
      "operation": {
        "type": "string",
        "enum": ["get_cars", "create_car", "update_car", "delete_car"],
        "description": "The operation to perform on the car inventory"
      },
      "filters": {
        "type": "object",
        "properties": {
          "make": {
            "type": "string",
            "description": "Filter cars by manufacturer (e.g., 'Toyota', 'Honda', 'Ford')"
          },
          "maxPrice": {
            "type": "number",
            "description": "Filter cars by maximum price"
          }
        },
        "description": "Optional filters for GET operations"
      },
      "car_data": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Car ID (required for update/delete operations)"
          },
          "make": {
            "type": "string",
            "minLength": 1,
            "maxLength": 50,
            "description": "Car manufacturer (required for create/update)"
          },
          "model": {
            "type": "string",
            "minLength": 1,
            "maxLength": 50,
            "description": "Car model (required for create/update)"
          },
          "year": {
            "type": "integer",
            "minimum": 1900,
            "maximum": 2025,
            "description": "Car year (required for create/update)"
          },
          "price": {
            "type": "number",
            "minimum": 0.01,
            "maximum": 1000000,
            "description": "Car price in USD (required for create/update)"
          },
          "quantity": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1000,
            "description": "Available quantity (required for create/update)"
          }
        },
        "description": "Car data for create/update operations"
      }
    },
    "required": ["operation"],
    "additionalProperties": false
  }
}
```

### 2. Example API Calls

#### Get All Cars
```bash
curl https://car-inventory-black.vercel.app/api/cars
```

#### Get Toyota Cars
```bash
curl "https://car-inventory-black.vercel.app/api/cars?make=Toyota"
```

#### Get Cars Under $30,000
```bash
curl "https://car-inventory-black.vercel.app/api/cars?maxPrice=30000"
```

#### Create New Car
```bash
curl -X POST https://car-inventory-black.vercel.app/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "make": "Tesla",
    "model": "Model S",
    "year": 2024,
    "price": 75000,
    "quantity": 2
  }'
```

#### Update Car
```bash
curl -X PUT https://car-inventory-black.vercel.app/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "id": "car_id_here",
    "make": "BMW",
    "model": "X5",
    "year": 2022,
    "price": 58000,
    "quantity": 3
  }'
```

#### Delete Car
```bash
curl -X DELETE "https://car-inventory-black.vercel.app/api/cars?id=car_id_here"
```

### 3. Current Inventory
Your API currently returns cars from these manufacturers:
- Toyota (Camry, RAV4, Tacoma)
- Honda (Civic, Accord, CR-V)
- Ford (F-150, Escape, Mustang)
- Chevrolet (Silverado, Equinox, Tahoe)
- Tesla (Model 3, Model Y)
- Jeep (Wrangler, Grand Cherokee)
- BMW (X5, 3 Series)
- Mercedes-Benz (C-Class, GLC)

### 4. Frontend Issue
Note: Your frontend at https://car-inventory-black.vercel.app shows "No cars found" even though the API is working. This suggests a frontend data fetching issue that should be investigated.

## Integration with OpenAI Assistant

When setting up your OpenAI assistant, use the function schema from `openai-schema.json` and configure the API endpoint as `https://car-inventory-black.vercel.app/api/cars`.

The assistant will be able to:
- Search for cars by make or price
- Add new cars to inventory
- Update existing car information
- Remove cars from inventory
- Provide inventory summaries and statistics
