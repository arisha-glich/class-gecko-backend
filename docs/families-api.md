# Families API Documentation

Complete API documentation for the Families management system, including CRUD operations, search, filtering, children management, and payment tracking.

## Base URL

```
http://localhost:8080
```

All requests require an authenticated organization session (Better Auth cookie `better-auth.session_token`). In fetch requests, set `credentials: 'include'`.

---

## Data Model Overview

### Family
```json
{
  "id": 1,
  "organizationId": "org-user-id",
  "userId": "family-account-user-id",
  "familyName": "Doe Family",
  "primaryParentFirstName": "John",
  "primaryParentLastName": "Doe",
  "primaryParentEmail": "john@example.com",
  "primaryParentPhoneCountry": "+1",
  "primaryParentPhoneNumber": "5551234567",
  "sendPortalInvitation": true,
  "status": "ACTIVE",
  "notes": "Additional notes about the family",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "students": []
}
```

### Family List Item
```json
{
  "id": 1,
  "familyName": "Doe Family",
  "email": "john@example.com",
  "phone": "+1 5551234567",
  "students": 2,
  "status": "ACTIVE",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Family Detail
```json
{
  "id": 1,
  "familyName": "Doe Family",
  "primaryParentFirstName": "John",
  "primaryParentLastName": "Doe",
  "primaryParentEmail": "john@example.com",
  "primaryParentPhoneCountry": "+1",
  "primaryParentPhoneNumber": "5551234567",
  "status": "ACTIVE",
  "notes": "Additional notes",
  "memberSince": "2025-01-01T00:00:00.000Z",
  "contactInfo": {
    "email": "john@example.com",
    "phone": "+1 5551234567",
    "linkedBusiness": "Greenwood Academy"
  },
  "address": {
    "street": "123 Main Street",
    "city": "San Francisco",
    "state": "CA",
    "zipcode": "94102",
    "country": "USA"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relation": "Spouse",
    "phone": "+1 5559876543",
    "email": "jane@example.com"
  },
  "user": {
    "id": "user_cuid",
    "email": "john@example.com",
    "name": "John Doe",
    "phoneNo": "+1 5551234567"
  }
}
```

### Student
```json
{
  "id": 10,
  "familyId": 1,
  "firstName": "Emma",
  "lastName": "Doe",
  "dateOfBirth": "2015-09-02T00:00:00.000Z",
  "gender": "Female",
  "medicalInfo": "Peanut allergy",
  "photoVideoConsent": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Child with Enrolled Classes
```json
{
  "id": 10,
  "firstName": "Emma",
  "lastName": "Doe",
  "dateOfBirth": "2015-09-02T00:00:00.000Z",
  "age": 9,
  "overallStatus": "Enrolled",
  "enrolledClasses": [
    {
      "id": 5,
      "title": "Math Basics",
      "classType": "ONGOING_CLASS"
    },
    {
      "id": 6,
      "title": "Art & Craft",
      "classType": "ONGOING_CLASS"
    }
  ]
}
```

### Payment Summary
```json
{
  "summary": {
    "totalPaid": 276.00,
    "totalInvoices": 4,
    "due": 0.00
  },
  "invoices": [
    {
      "invoiceId": "INV-001",
      "date": "2023-10-26",
      "description": "Term 1 - Class A",
      "amount": 100.00,
      "status": "Paid"
    },
    {
      "invoiceId": "INV-002",
      "date": "2023-10-27",
      "description": "Term 1 - Class B",
      "amount": 75.00,
      "status": "Pending"
    }
  ]
}
```

---

## Endpoints

### 1. Create Family
**POST** `/families`

Creates:
1. A `user` record (role `FAMILY`) with the provided password.
2. A `family` record tied to the authenticated organization and the new user.

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SuperSecure123!",
  "phoneCountryCode": "+1",
  "phoneNumber": "5551234567",
  "sendPortalInvitation": true,
  "familyName": "Doe Family"
}
```

#### Response (201 Created)
```json
{
  "message": "Family created successfully",
  "success": true,
  "data": {
    "family": { ...familyObject },
    "user": {
      "id": "user_cuid",
      "email": "john@example.com",
      "role": "FAMILY",
      "name": "John Doe",
      "phoneNo": "+1 5551234567"
    }
  }
}
```

#### Errors
- `401 Unauthorized` – missing session
- `409 Conflict` – email already exists
- `500 Internal Server Error` – failure while creating user/family

---

### 2. Get Families (List with Search & Filter)
**GET** `/families`

Returns a paginated list of families belonging to the authenticated organization with optional search and status filtering.

#### Query Parameters
- `search` (optional) - Search by family name, email, or phone number
- `status` (optional) - Filter by status: `ACTIVE`, `INACTIVE`, or `ALL` (default: all)
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

#### Example Request
```
GET /families?search=john&status=ACTIVE&page=1&limit=10
```

#### Response (200 OK)
```json
{
  "message": "Families retrieved successfully",
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "familyName": "Doe Family",
        "email": "john@example.com",
        "phone": "+1 5551234567",
        "students": 2,
        "status": "ACTIVE",
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### Errors
- `401 Unauthorized` – missing session
- `500 Internal Server Error` – server error

---

### 3. Get Family by ID
**GET** `/families/{id}`

Retrieves detailed information about a specific family including contact info, address, emergency contact, and member since date.

#### Path Parameters
- `id` (required) - Family ID

#### Response (200 OK)
```json
{
  "message": "Family retrieved successfully",
  "success": true,
  "data": {
    "id": 1,
    "familyName": "Doe Family",
    "primaryParentFirstName": "John",
    "primaryParentLastName": "Doe",
    "primaryParentEmail": "john@example.com",
    "primaryParentPhoneCountry": "+1",
    "primaryParentPhoneNumber": "5551234567",
    "status": "ACTIVE",
    "notes": "Additional notes",
    "memberSince": "2025-01-01T00:00:00.000Z",
    "contactInfo": {
      "email": "john@example.com",
      "phone": "+1 5551234567",
      "linkedBusiness": "Greenwood Academy"
    },
    "address": {
      "street": "123 Main Street",
      "city": "San Francisco",
      "state": "CA",
      "zipcode": "94102",
      "country": "USA"
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "relation": "Spouse",
      "phone": "+1 5559876543",
      "email": "jane@example.com"
    },
    "user": {
      "id": "user_cuid",
      "email": "john@example.com",
      "name": "John Doe",
      "phoneNo": "+1 5551234567"
    }
  }
}
```

#### Errors
- `401 Unauthorized` – missing session
- `404 Not Found` – family not found or doesn't belong to organization
- `500 Internal Server Error` – server error

---

### 4. Update Family
**PATCH** `/families/{id}`

Updates family details including contact information, address, and emergency contact. Only provided fields are updated.

#### Path Parameters
- `id` (required) - Family ID

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.updated@example.com",
  "phoneCountryCode": "+1",
  "phoneNumber": "5551234567",
  "familyName": "Updated Family Name",
  "status": "ACTIVE",
  "notes": "Updated notes",
  "address": {
    "street": "456 New Street",
    "city": "Los Angeles",
    "state": "CA",
    "zipcode": "90001",
    "country": "USA"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relation": "Spouse",
    "phoneNo": "+1 5559876543",
    "email": "jane@example.com",
    "useInEmergency": true
  }
}
```

#### Response (200 OK)
```json
{
  "message": "Family updated successfully",
  "success": true,
  "data": { ...familyDetailObject }
}
```

#### Errors
- `401 Unauthorized` – missing session
- `404 Not Found` – family not found
- `409 Conflict` – email already used by another user
- `500 Internal Server Error` – server error

---

### 5. Delete Family
**DELETE** `/families/{id}`

Permanently deletes a family and associated user account. This action cannot be undone.

#### Path Parameters
- `id` (required) - Family ID

#### Response (200 OK)
```json
{
  "message": "Family deleted successfully",
  "success": true,
  "data": {
    "success": true
  }
}
```

#### Errors
- `401 Unauthorized` – missing session
- `404 Not Found` – family not found
- `500 Internal Server Error` – server error

---

### 6. Suspend/Activate Family
**PATCH** `/families/{id}/suspend`

Updates the status of a family (ACTIVE, INACTIVE, etc.).

#### Path Parameters
- `id` (required) - Family ID

#### Request Body
```json
{
  "status": "INACTIVE"
}
```

#### Response (200 OK)
```json
{
  "message": "Family status updated successfully",
  "success": true,
  "data": { ...familyObject }
}
```

#### Errors
- `401 Unauthorized` – missing session
- `404 Not Found` – family not found
- `500 Internal Server Error` – server error

---

### 7. Get Family Children
**GET** `/families/{id}/children`

Retrieves all children belonging to a family along with their enrolled classes and enrollment status.

#### Path Parameters
- `id` (required) - Family ID

#### Response (200 OK)
```json
{
  "message": "Family children retrieved successfully",
  "success": true,
  "data": [
    {
      "id": 10,
      "firstName": "Emma",
      "lastName": "Doe",
      "dateOfBirth": "2015-09-02T00:00:00.000Z",
      "age": 9,
      "overallStatus": "Enrolled",
      "enrolledClasses": [
        {
          "id": 5,
          "title": "Math Basics",
          "classType": "ONGOING_CLASS"
        },
        {
          "id": 6,
          "title": "Art & Craft",
          "classType": "ONGOING_CLASS"
        }
      ]
    },
    {
      "id": 11,
      "firstName": "Liam",
      "lastName": "Doe",
      "dateOfBirth": "2017-03-15T00:00:00.000Z",
      "age": 7,
      "overallStatus": "Enrolled",
      "enrolledClasses": [
        {
          "id": 7,
          "title": "Music",
          "classType": "ONGOING_CLASS"
        },
        {
          "id": 8,
          "title": "Robotics",
          "classType": "ONGOING_CLASS"
        }
      ]
    }
  ]
}
```

#### Errors
- `401 Unauthorized` – missing session
- `404 Not Found` – family not found
- `500 Internal Server Error` – server error

---

### 8. Get Family Payments
**GET** `/families/{id}/payments`

Retrieves payment summary and invoice history for a family.

#### Path Parameters
- `id` (required) - Family ID

#### Response (200 OK)
```json
{
  "message": "Payment history retrieved successfully",
  "success": true,
  "data": {
    "summary": {
      "totalPaid": 276.00,
      "totalInvoices": 4,
      "due": 0.00
    },
    "invoices": [
      {
        "invoiceId": "INV-001",
        "date": "2023-10-26",
        "description": "Term 1 - Class A",
        "amount": 100.00,
        "status": "Paid"
      },
      {
        "invoiceId": "INV-002",
        "date": "2023-10-27",
        "description": "Term 1 - Class B",
        "amount": 75.00,
        "status": "Pending"
      },
      {
        "invoiceId": "INV-003",
        "date": "2023-10-28",
        "description": "Term 1 - Class C",
        "amount": 101.00,
        "status": "Paid"
      },
      {
        "invoiceId": "INV-004",
        "date": "2023-10-29",
        "description": "Term 1 - Class D",
        "amount": 50.00,
        "status": "Pending"
      }
    ]
  }
}
```

#### Errors
- `401 Unauthorized` – missing session
- `404 Not Found` – family not found
- `500 Internal Server Error` – server error

---

### 9. Create Student for Family
**POST** `/families/{id}/students`

Adds a child to the selected family.

#### Path Parameters
- `id` (required) - Family ID

#### Request Body
```json
{
  "firstName": "Emma",
  "lastName": "Doe",
  "dateOfBirth": "2015-09-02T00:00:00Z",
  "gender": "Female",
  "medicalInfo": "Peanut allergy",
  "photoVideoConsent": true
}
```

#### Response (201 Created)
```json
{
  "message": "Student created successfully",
  "success": true,
  "data": {
    "id": 10,
    "familyId": 1,
    "firstName": "Emma",
    "lastName": "Doe",
    "dateOfBirth": "2015-09-02T00:00:00.000Z",
    "gender": "Female",
    "medicalInfo": "Peanut allergy",
    "photoVideoConsent": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Errors
- `401 Unauthorized` – missing session
- `404 Not Found` – family not found
- `500 Internal Server Error` – server error

---

## Example Usage (TypeScript/Fetch)

### Create Family
```typescript
async function createFamily(payload: {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneCountryCode?: string
  phoneNumber?: string
  sendPortalInvitation?: boolean
  familyName?: string
}) {
  const response = await fetch('http://localhost:8080/families', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create family')
  }

  return response.json()
}
```

### Get Families with Search and Filter
```typescript
async function getFamilies(params: {
  search?: string
  status?: string
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (params.search) queryParams.append('search', params.search)
  if (params.status) queryParams.append('status', params.status)
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())

  const response = await fetch(`http://localhost:8080/families?${queryParams}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to retrieve families')
  }

  return response.json()
}
```

### Get Family Details
```typescript
async function getFamilyById(familyId: number) {
  const response = await fetch(`http://localhost:8080/families/${familyId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to retrieve family')
  }

  return response.json()
}
```

### Update Family
```typescript
async function updateFamily(familyId: number, payload: {
  firstName?: string
  lastName?: string
  email?: string
  phoneCountryCode?: string
  phoneNumber?: string
  familyName?: string
  status?: string
  notes?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipcode?: string
    country?: string
  }
  emergencyContact?: {
    name?: string
    relation?: string
    phoneNo?: string
    email?: string
    useInEmergency?: boolean
  }
}) {
  const response = await fetch(`http://localhost:8080/families/${familyId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update family')
  }

  return response.json()
}
```

### Delete Family
```typescript
async function deleteFamily(familyId: number) {
  const response = await fetch(`http://localhost:8080/families/${familyId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete family')
  }

  return response.json()
}
```

### Suspend Family
```typescript
async function suspendFamily(familyId: number, status: string) {
  const response = await fetch(`http://localhost:8080/families/${familyId}/suspend`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update family status')
  }

  return response.json()
}
```

### Get Family Children
```typescript
async function getFamilyChildren(familyId: number) {
  const response = await fetch(`http://localhost:8080/families/${familyId}/children`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to retrieve children')
  }

  return response.json()
}
```

### Get Family Payments
```typescript
async function getFamilyPayments(familyId: number) {
  const response = await fetch(`http://localhost:8080/families/${familyId}/payments`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to retrieve payment history')
  }

  return response.json()
}
```

### Add Student to Family
```typescript
async function addStudent(familyId: number, payload: {
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: string
  medicalInfo?: string
  photoVideoConsent?: boolean
}) {
  const response = await fetch(`http://localhost:8080/families/${familyId}/students`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create student')
  }

  return response.json()
}
```

---

## Testing (cURL)

### Create Family
```bash
curl -X POST http://localhost:8080/families \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "password": "SuperSecure123!",
        "phoneCountryCode": "+1",
        "phoneNumber": "5551234567",
        "sendPortalInvitation": true,
        "familyName": "Doe Family"
      }'
```

### Get Families with Search
```bash
curl -X GET "http://localhost:8080/families?search=john&status=ACTIVE&page=1&limit=10" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"
```

### Get Family by ID
```bash
curl -X GET http://localhost:8080/families/1 \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"
```

### Update Family
```bash
curl -X PATCH http://localhost:8080/families/1 \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "firstName": "John",
        "lastName": "Doe",
        "notes": "Updated notes",
        "address": {
          "street": "456 New Street",
          "city": "Los Angeles",
          "state": "CA",
          "zipcode": "90001",
          "country": "USA"
        }
      }'
```

### Delete Family
```bash
curl -X DELETE http://localhost:8080/families/1 \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"
```

### Suspend Family
```bash
curl -X PATCH http://localhost:8080/families/1/suspend \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "INACTIVE"}'
```

### Get Family Children
```bash
curl -X GET http://localhost:8080/families/1/children \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"
```

### Get Family Payments
```bash
curl -X GET http://localhost:8080/families/1/payments \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"
```

### Add Student
```bash
curl -X POST http://localhost:8080/families/1/students \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "firstName": "Emma",
        "lastName": "Doe",
        "dateOfBirth": "2015-09-02T00:00:00Z",
        "gender": "Female",
        "medicalInfo": "Peanut allergy",
        "photoVideoConsent": true
      }'
```

---

## Notes

- Every family owns its own portal user (role `FAMILY`). Password is hashed via `Bun.password.hash`.
- Email addresses are unique across all users; attempting to reuse an email returns `409 Conflict`.
- Students no longer create separate `user` records; they are stored under the `Student` model tied to a `Family`.
- Search functionality searches across family name, parent first/last name, email, and phone number.
- Status filtering supports `ACTIVE`, `INACTIVE`, or `ALL` (default shows all).
- Pagination defaults to page 1 with 10 items per page.
- Age calculation for children is based on date of birth and current date.
- Payment summary calculates total paid, total invoices, and due amount from order history.
- Invoice IDs are auto-generated in the format `INV-001`, `INV-002`, etc.
- Address and emergency contact are optional and can be updated independently.
- Family deletion is permanent and cascades to associated user account.

## References

- Schema: `prisma/schema.prisma` (`Family`, `Student`, `User`, `Address`, `ContactInfo`)
- Service logic: `src/services/families.service.ts`
- Routes: `src/routes/families/*`
- Handlers: `src/routes/families/families.handler.ts`
