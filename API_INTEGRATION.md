# RentNest API Integration

Base URL:

```text
https://b7-a4-rent-nest-backend.vercel.app
```

## Authentication

Protected endpoints use the authenticated user from the access token/cookie.

Roles used by the project:

- `TENANT`
- `LANDLORD`
- `ADMIN`

---

# 1. Properties

## Get All Public Properties

```http
GET /api/properties
```

Authentication: **Public**

Supported query parameters:

```text
searchTerm
city
division
categoryId
minPrice
maxPrice
bedrooms
bathrooms
page
limit
sortBy
sortOrder
```

Example:

```http
GET /api/properties?page=1&limit=10
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Properties retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 7
  },
  "data": []
}
```

---

## Get Single Property

```http
GET /api/properties/:id
```

Authentication: **Public**

Example:

```http
GET /api/properties/588866b3-0925-4ce5-b7bb-df3c2713a106
```

Returns:

- Property information
- Category
- Landlord
- Reviews

---

# 2. Landlord Property Management

All endpoints in this section require:

```text
Role: LANDLORD
```

## Get My Properties

```http
GET /api/properties/my-properties
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "My properties retrieved successfully",
  "data": []
}
```

Each property includes:

```text
category
_count.rentalRequests
_count.reviews
```

---

## Create Property

```http
POST /api/properties
```

Authentication: **LANDLORD**

Request body:

```json
{
  "categoryId": "category-id",

  "title": "Modern 2 Bedroom Apartment",
  "description": "A fully furnished apartment.",

  "rentPrice": 25000,

  "bedrooms": 2,
  "bathrooms": 2,
  "areaSqft": 1100,

  "address": "Road 12, Block B, Bashundhara R/A",
  "city": "Dhaka",
  "division": "Dhaka",
  "postalCode": "1229",

  "latitude": 23.8103,
  "longitude": 90.4125,

  "availableFrom": "2026-09-01T00:00:00.000Z"
}
```

The backend automatically associates the property with the authenticated landlord.

---

## Update Property

```http
PATCH /api/properties/:id
```

Authentication: **LANDLORD**

Request body fields are optional:

```json
{
  "categoryId": "category-id",

  "title": "Updated Property Title",
  "description": "Updated description",

  "rentPrice": 27000,

  "bedrooms": 3,
  "bathrooms": 2,
  "areaSqft": 1400,

  "address": "Updated address",
  "city": "Dhaka",
  "division": "Dhaka",
  "postalCode": "1212",

  "latitude": 23.8103,
  "longitude": 90.4125,

  "availableFrom": "2026-09-15T00:00:00.000Z"
}
```

The backend verifies that the property belongs to the authenticated landlord.

---

## Delete Property

```http
DELETE /api/properties/:id
```

Authentication: **LANDLORD**

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Property deleted successfully",
  "data": null
}
```

---

# 3. Categories

## Get All Categories

```http
GET /api/categories
```

Authentication: **Public**

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "category-id",
      "name": "Apartment",
      "slug": "apartment",
      "description": "Apartment of all Category",
      "createdAt": "2026-07-24T15:42:43.615Z",
      "updatedAt": "2026-07-24T15:42:43.615Z"
    }
  ]
}
```

The frontend uses this endpoint for the **Add Property category dropdown**.

---

## Get Single Category

```http
GET /api/categories/:id
```

Authentication: **Public**

---

## Create Category

```http
POST /api/categories
```

Request body:

```json
{
  "name": "Apartment",
  "slug": "apartment",
  "description": "Apartment of all Category"
}
```

---

## Update Category

```http
PATCH /api/categories/:id
```

Request body:

```json
{
  "name": "Updated Apartment",
  "slug": "updated-apartment",
  "description": "Updated description"
}
```

---

## Delete Category

```http
DELETE /api/categories/:id
```

---

# 4. Rental Requests

## Create Rental Request

```http
POST /api/rental-requests
```

Authentication: **TENANT**

Request body:

```json
{
  "propertyId": "588866b3-0925-4ce5-b7bb-df3c2713a106",
  "moveInDate": "2026-08-01T00:00:00.000Z",
  "durationMonths": 12
}
```

The authenticated tenant is associated automatically by the backend.

---

## Get My Rental Requests

```http
GET /api/rental-requests/my-requests
```

Authentication: **TENANT**

The response includes:

```text
property
```

and rental request information such as:

```text
id
propertyId
tenantId
moveInDate
durationMonths
message
status
createdAt
updatedAt
```

Possible rental request statuses currently used by the project:

```text
PENDING
APPROVED
REJECTED
CANCELLED
CONFIRMED
```

---

## Get All Rental Requests

```http
GET /api/rental-requests
```

Authentication: **LANDLORD**

Used by the landlord dashboard to view rental requests.

---

## Update Rental Request

```http
PATCH /api/rental-requests/:id
```

Authentication: **LANDLORD**

Request body:

```json
{
  "status": "APPROVED"
}
```

or:

```json
{
  "status": "REJECTED"
}
```

The landlord can accept or reject rental requests from the frontend.

---

# 5. Payments

## Create Stripe Checkout

```http
POST /api/payments/checkout
```

Authentication: **TENANT**

Request body:

```json
{
  "rentalRequestId": "rental-request-id"
}
```

Response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "checkout complete",
  "data": {
    "paymentUrl": "https://checkout.stripe.com/..."
  }
}
```

Frontend behavior:

```text
Click Pay Now
      ↓
POST /api/payments/checkout
      ↓
Receive paymentUrl
      ↓
Redirect tenant to Stripe Checkout
```

---

# 6. Stripe Webhook

```http
POST /api/payments/webhook
```

Authentication: **No application auth middleware**

Stripe signature verification is required.

The Stripe webhook should process:

```text
checkout.session.completed
```

The Stripe checkout session contains metadata including:

```text
tenantId
rentalRequestId
propertyId
```

Successful payment flow:

```text
Stripe Checkout
      ↓
checkout.session.completed
      ↓
Payment → SUCCESS
      ↓
paidAt → current time
      ↓
RentalRequest → CONFIRMED
```

---

# 7. Payment Status

The current Prisma `PaymentStatus` enum is:

```text
PENDING
SUCCESS
FAILED
REFUNDED
```

Therefore, the frontend should check:

```ts
payment.status === "SUCCESS"
```

not:

```ts
payment.status === "PAID"
```

Example:

```tsx
{payment?.status === "SUCCESS" ? (
  <span>Payment Successful</span>
) : (
  <button>Pay Now</button>
)}
```

---

# 8. Rental Request + Payment Frontend Flow

Tenant flow:

```text
Public Properties
       ↓
Property Details
       ↓
Login required
       ↓
Choose move-in date
       ↓
Create Rental Request
       ↓
PENDING
       ↓
Landlord reviews request
       ↓
APPROVED
       ↓
Tenant sees Pay Now
       ↓
Stripe Checkout
       ↓
Stripe Webhook
       ↓
Payment = SUCCESS
       ↓
Rental Request = CONFIRMED
       ↓
Tenant Dashboard shows
"Booking Confirmed"
```

---

# 9. Landlord Dashboard Flow

```text
Landlord Dashboard
│
├── My Properties
│   ├── GET /api/properties/my-properties
│   ├── Add Property
│   │   └── POST /api/properties
│   ├── Edit Property
│   │   └── PATCH /api/properties/:id
│   └── Delete Property
│       └── DELETE /api/properties/:id
│
└── Rental Requests
    ├── GET /api/rental-requests
    ├── Approve
    │   └── PATCH /api/rental-requests/:id
    └── Reject
        └── PATCH /api/rental-requests/:id
```

---

# 10. Important Frontend Rules

## Public property pages

These can call:

```text
GET /api/properties
GET /api/properties/:id
GET /api/categories
```

without requiring login.

## Tenant-only actions

These require authentication:

```text
POST /api/rental-requests
GET /api/rental-requests/my-requests
POST /api/payments/checkout
```

## Landlord-only actions

These require the `LANDLORD` role:

```text
GET /api/properties/my-properties
POST /api/properties
PATCH /api/properties/:id
DELETE /api/properties/:id
GET /api/rental-requests
PATCH /api/rental-requests/:id
```

## Do not trust frontend role checks alone

The frontend can hide/show buttons based on role, but the backend remains responsible for authorization.

---

# 11. Current Frontend Server Action Pattern

For protected API calls, the project uses:

```ts
"use server";

import { serverAxios } from "@/lib/serverAxios";

export async function exampleAction() {
  const api = await serverAxios();

  const response = await api.get(
    "/api/properties/my-properties",
  );

  return response.data;
}
```

This keeps authenticated API communication on the server side.

---

# 12. Current Property Management Frontend

Implemented:

```text
GET my properties       ✅
DELETE property         ✅
UPDATE property         ✅
CREATE property         🚧/in progress
CATEGORY dropdown       🚧/in progress
```

Target:

```text
Landlord Dashboard
       ↓
My Properties
       ├── Add
       ├── Edit
       └── Delete
```

---

# 13. Current Payment Frontend

Implemented flow:

```text
Rental Request
     ↓
APPROVED
     ↓
Pay Now
     ↓
POST /api/payments/checkout
     ↓
Stripe Checkout
```

After webhook success:

```text
Payment.status = SUCCESS
RentalRequest.status = CONFIRMED
```

The tenant dashboard should then display the successful payment/booking state instead of the `Pay Now` button.

---

# Notes

The API contracts documented here are based on the current RentNest backend code and API responses provided during development.

Before adding a new frontend integration, verify the corresponding backend request payload and response shape rather than assuming field names.
