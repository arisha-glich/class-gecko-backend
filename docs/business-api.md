# Business/School Management API

This document provides comprehensive API documentation for the Business/School management endpoints in the Class Gecko backend. These endpoints allow you to create, manage, and monitor multiple schools/businesses within the platform.

## Base URL

All API endpoints are prefixed with the base URL:
```
http://localhost:8080
```

## Authentication

All endpoints require authentication. The backend uses **cookie-based sessions** via Better Auth. Include session cookies in your requests.

**Important:** When making requests from a browser, set `credentials: 'include'` in your fetch calls to automatically include cookies.

## Data Model Overview

### Business/School Object
```json
{
  "id": 1,
  "schoolName": "Bright Minds Academy",
  "email": "admin@brightminds.edu",
  "phone": "+1-555-123-4567",
  "status": "Active",
  "user": {
    "id": "clzlz0l2d000108l7f1m9x9k3",
    "email": "admin@brightminds.edu",
    "phoneNo": "+1-555-123-4567"
  }
}
```

### Business Detail Object
```json
{
  "id": 1,
  "schoolName": "Bright Minds Academy",
  "email": "admin@brightminds.edu",
  "phone": "+1-555-123-4567",
  "address": "123 Main St, City, State 12345, Country",
  "website": "https://brightminds.edu",
  "status": "Active",
  "statistics": {
    "students": 87,
    "teachers": 12,
    "revenue": 27890.50,
    "profit": 15430.25
  },
  "contactInfo": {
    "email": "admin@brightminds.edu",
    "phone": "+1-555-123-4567",
    "address": "123 Main St, City, State 12345, Country",
    "website": "https://brightminds.edu"
  },
  "commission": {
    "commissionType": "PERCENTAGE",
    "commissionValue": 100
  },
  "user": {
    "id": "clzlz0l2d000108l7f1m9x9k3",
    "email": "admin@brightminds.edu",
    "phoneNo": "+1-555-123-4567"
  }
}
```

### Student Object (for Business)
```json
{
  "id": 10,
  "studentName": "Alice Smith",
  "email": "parent@example.com",
  "phone": "+1-555-987-6543",
  "status": "Active"
}
```

---

## Endpoints

### GET `/business`

Retrieves a paginated list of all businesses/schools with optional search functionality.

#### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `search` | `string` | No | Search term to filter businesses by name, email, or phone |
| `page` | `string` | No | Page number (default: `1`) |
| `limit` | `string` | No | Number of items per page (default: `10`) |

#### Request Example

```bash
GET /business?search=Bright&page=1&limit=10
```

#### Successful Response (200 OK)

```json
{
  "message": "Businesses retrieved successfully",
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "schoolName": "Bright Minds Academy",
        "email": "admin@brightminds.edu",
        "phone": "+1-555-123-4567",
        "status": "Active",
        "user": {
          "id": "clzlz0l2d000108l7f1m9x9k3",
          "email": "admin@brightminds.edu",
          "phoneNo": "+1-555-123-4567"
        }
      },
      {
        "id": 2,
        "schoolName": "Global Scholars Institute",
        "email": "admin@globalscholars.edu",
        "phone": "+1-555-234-5678",
        "status": "Active",
        "user": {
          "id": "clzlz0l2d000108l7f1m9x9k4",
          "email": "admin@globalscholars.edu",
          "phoneNo": "+1-555-234-5678"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 200,
      "totalPages": 20
    }
  }
}
```

#### Response Fields

**Business Object:**
| Field | Type | Description |
| --- | --- | --- |
| `id` | `number` | Unique identifier for the business |
| `schoolName` | `string` | Name of the school/business |
| `email` | `string` | Contact email address |
| `phone` | `string` | Contact phone number |
| `status` | `string` | Status of the business (`"Active"` or `"Inactive"`) |
| `user` | `object` | Associated user account information |

**Pagination Object:**
| Field | Type | Description |
| --- | --- | --- |
| `page` | `number` | Current page number |
| `limit` | `number` | Items per page |
| `total` | `number` | Total number of businesses |
| `totalPages` | `number` | Total number of pages |

#### Error Responses

- **401 Unauthorized** – Missing or invalid authentication
  ```json
  {
    "message": "Unauthorized"
  }
  ```

- **500 Internal Server Error** – Server error during retrieval
  ```json
  {
    "message": "Failed to retrieve businesses"
  }
  ```

#### Example Usage

**JavaScript/Fetch:**
```javascript
async function getBusinesses(search = '', page = 1, limit = 10) {
  const params = new URLSearchParams({
    ...(search && { search }),
    page: page.toString(),
    limit: limit.toString(),
  })

  const response = await fetch(`http://localhost:8080/business?${params}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch businesses')
  }

  const data = await response.json()
  return data.data
}

// Usage
const result = await getBusinesses('Bright', 1, 10)
console.log('Businesses:', result.data)
console.log('Total:', result.pagination.total)
```

**TypeScript/React:**
```typescript
interface Business {
  id: number
  schoolName: string
  email: string
  phone: string
  status: string
  user: {
    id: string
    email: string
    phoneNo: string | null
  }
}

interface BusinessListResponse {
  data: Business[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

async function getBusinesses(
  search?: string,
  page = 1,
  limit = 10
): Promise<BusinessListResponse> {
  const params = new URLSearchParams({
    ...(search && { search }),
    page: page.toString(),
    limit: limit.toString(),
  })

  const response = await fetch(`http://localhost:8080/business?${params}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch businesses')
  }

  const result = await response.json()
  return result.data
}
```

---

### GET `/business/{id}`

Retrieves detailed information about a specific business, including statistics (students, teachers, revenue, profit) and commission settings.

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Business ID |

#### Successful Response (200 OK)

```json
{
  "message": "Business details retrieved successfully",
  "success": true,
  "data": {
    "id": 1,
    "schoolName": "Bright Minds Academy",
    "email": "admin@brightminds.edu",
    "phone": "+1-555-123-4567",
    "address": "123 Main St, City, State 12345, Country",
    "website": "https://brightminds.edu",
    "status": "Active",
    "statistics": {
      "students": 87,
      "teachers": 12,
      "revenue": 27890.50,
      "profit": 15430.25
    },
    "contactInfo": {
      "email": "admin@brightminds.edu",
      "phone": "+1-555-123-4567",
      "address": "123 Main St, City, State 12345, Country",
      "website": "https://brightminds.edu"
    },
    "commission": {
      "commissionType": "PERCENTAGE",
      "commissionValue": 100
    },
    "user": {
      "id": "clzlz0l2d000108l7f1m9x9k3",
      "email": "admin@brightminds.edu",
      "phoneNo": "+1-555-123-4567"
    }
  }
}
```

#### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `number` | Unique identifier for the business |
| `schoolName` | `string` | Name of the school/business |
| `email` | `string` | Contact email address |
| `phone` | `string` | Contact phone number |
| `address` | `string \| null` | Full address string |
| `website` | `string \| null` | Website URL |
| `status` | `string` | Status (`"Active"` or `"Inactive"`) |
| `statistics` | `object` | Business statistics |
| `statistics.students` | `number` | Total number of students |
| `statistics.teachers` | `number` | Total number of teachers |
| `statistics.revenue` | `number` | Total revenue (calculated from orders) |
| `statistics.profit` | `number` | Profit after commission deduction |
| `contactInfo` | `object` | Contact information object |
| `commission` | `object \| null` | Current commission settings |
| `commission.commissionType` | `string` | Type: `"PERCENTAGE"`, `"FIXED"`, or `"TIERED"` |
| `commission.commissionValue` | `number` | Commission value (percentage or fixed amount) |
| `user` | `object` | Associated user account |

#### Error Responses

- **401 Unauthorized** – Missing authentication
- **404 Not Found** – Business not found
- **500 Internal Server Error** – Server error

#### Example Usage

```typescript
async function getBusinessById(id: number) {
  const response = await fetch(`http://localhost:8080/business/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Business not found')
    }
    throw new Error('Failed to fetch business')
  }

  const result = await response.json()
  return result.data
}

// Usage
const business = await getBusinessById(1)
console.log('Students:', business.statistics.students)
console.log('Revenue:', business.statistics.revenue)
```

---

### POST `/business`

Creates a new business/school with commission settings. This endpoint creates:
1. A new `User` account (role: `ORGANIZATION_ADMIN`)
2. A `BusinessOrganization` record
3. An initial `Commission` record

#### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `schoolName` | `string` | Yes | Name of the school/business |
| `email` | `string` | Yes | Valid email address (must be unique) |
| `phone` | `string` | Yes | Contact phone number |
| `address` | `string` | No | Physical address |
| `website` | `string` | No | Website URL (must be valid URL if provided) |
| `commissionType` | `enum` | Yes | `"PERCENTAGE"`, `"FIXED"`, or `"TIERED"` |
| `commissionValue` | `number` | Yes | Commission value (must be ≥ 0) |
| `status` | `boolean` | No | Active status (default: `true`) |

#### Request Example

```json
{
  "schoolName": "Bright Minds Academy",
  "email": "admin@brightminds.edu",
  "phone": "+1-555-123-4567",
  "address": "123 Main St, City, State 12345",
  "website": "https://brightminds.edu",
  "commissionType": "PERCENTAGE",
  "commissionValue": 100,
  "status": true
}
```

#### Successful Response (201 Created)

```json
{
  "message": "Business created successfully",
  "success": true,
  "data": {
    "id": 1,
    "schoolName": "Bright Minds Academy",
    "email": "admin@brightminds.edu",
    "phone": "+1-555-123-4567",
    "status": "Active",
    "user": {
      "id": "clzlz0l2d000108l7f1m9x9k3",
      "email": "admin@brightminds.edu",
      "phoneNo": "+1-555-123-4567"
    }
  }
}
```

#### Error Responses

- **401 Unauthorized** – Missing authentication
- **409 Conflict** – Email already in use
  ```json
  {
    "message": "Email already in use"
  }
  ```
- **500 Internal Server Error** – Server error during creation

#### Example Usage

```typescript
interface CreateBusinessData {
  schoolName: string
  email: string
  phone: string
  address?: string
  website?: string
  commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
  commissionValue: number
  status?: boolean
}

async function createBusiness(data: CreateBusinessData) {
  const response = await fetch('http://localhost:8080/business', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('Email already in use')
    }
    const error = await response.json()
    throw new Error(error.message || 'Failed to create business')
  }

  const result = await response.json()
  return result.data
}

// Usage
const newBusiness = await createBusiness({
  schoolName: 'Bright Minds Academy',
  email: 'admin@brightminds.edu',
  phone: '+1-555-123-4567',
  address: '123 Main St, City, State 12345',
  website: 'https://brightminds.edu',
  commissionType: 'PERCENTAGE',
  commissionValue: 100,
  status: true,
})

console.log('Created business ID:', newBusiness.id)
```

---

### PATCH `/business/{id}`

Updates business/school information. Only provided fields will be updated.

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Business ID |

#### Request Body

All fields are optional. Only include fields you want to update.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `schoolName` | `string` | No | Updated school name |
| `email` | `string` | No | Updated email address |
| `phone` | `string` | No | Updated phone number |
| `address` | `string` | No | Updated address |
| `website` | `string` | No | Updated website URL |
| `status` | `boolean` | No | Updated status (true = Active, false = Inactive) |

#### Request Example

```json
{
  "schoolName": "Bright Minds Academy Updated",
  "phone": "+1-555-999-8888",
  "status": true
}
```

#### Successful Response (200 OK)

```json
{
  "message": "Business updated successfully",
  "success": true,
  "data": {
    "id": 1,
    "schoolName": "Bright Minds Academy Updated",
    "email": "admin@brightminds.edu",
    "phone": "+1-555-999-8888",
    "status": "Active",
    "user": {
      "id": "clzlz0l2d000108l7f1m9x9k3",
      "email": "admin@brightminds.edu",
      "phoneNo": "+1-555-999-8888"
    }
  }
}
```

#### Error Responses

- **401 Unauthorized** – Missing authentication
- **404 Not Found** – Business not found
- **500 Internal Server Error** – Server error

#### Example Usage

```typescript
interface UpdateBusinessData {
  schoolName?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  status?: boolean
}

async function updateBusiness(id: number, data: UpdateBusinessData) {
  const response = await fetch(`http://localhost:8080/business/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Business not found')
    }
    const error = await response.json()
    throw new Error(error.message || 'Failed to update business')
  }

  const result = await response.json()
  return result.data
}

// Usage
await updateBusiness(1, {
  schoolName: 'Bright Minds Academy Updated',
  phone: '+1-555-999-8888',
})
```

---

### PATCH `/business/{id}/commission`

Updates commission settings for a specific business. This creates a new commission record and deactivates previous active commissions.

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Business ID |

#### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `commissionType` | `enum` | Yes | `"PERCENTAGE"`, `"FIXED"`, or `"TIERED"` |
| `commissionValue` | `number` | Yes | Commission value (must be ≥ 0) |
| `country` | `string` | No | ISO country code (default: `"US"`) |
| `currency` | `string` | No | ISO currency code (default: `"USD"`) |

#### Request Example

```json
{
  "commissionType": "PERCENTAGE",
  "commissionValue": 150,
  "country": "US",
  "currency": "USD"
}
```

#### Successful Response (200 OK)

```json
{
  "message": "Commission updated successfully",
  "success": true,
  "data": {
    "commissionType": "PERCENTAGE",
    "commissionValue": 150
  }
}
```

#### Error Responses

- **401 Unauthorized** – Missing authentication
- **404 Not Found** – Business not found
- **500 Internal Server Error** – Server error

#### Example Usage

```typescript
interface UpdateCommissionData {
  commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
  commissionValue: number
  country?: string
  currency?: string
}

async function updateCommission(id: number, data: UpdateCommissionData) {
  const response = await fetch(`http://localhost:8080/business/${id}/commission`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Business not found')
    }
    const error = await response.json()
    throw new Error(error.message || 'Failed to update commission')
  }

  const result = await response.json()
  return result.data
}

// Usage
await updateCommission(1, {
  commissionType: 'PERCENTAGE',
  commissionValue: 150,
})
```

---

### GET `/business/{id}/students`

Retrieves a paginated list of students belonging to a specific business.

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Business ID |

#### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `page` | `string` | No | Page number (default: `1`) |
| `limit` | `string` | No | Items per page (default: `10`) |

#### Successful Response (200 OK)

```json
{
  "message": "Students retrieved successfully",
  "success": true,
  "data": {
    "data": [
      {
        "id": 10,
        "studentName": "Alice Smith",
        "email": "parent@example.com",
        "phone": "+1-555-987-6543",
        "status": "Active"
      },
      {
        "id": 11,
        "studentName": "Bob Johnson",
        "email": "parent2@example.com",
        "phone": "+1-555-987-6544",
        "status": "Active"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 87,
      "totalPages": 9
    }
  }
}
```

#### Response Fields

**Student Object:**
| Field | Type | Description |
| --- | --- | --- |
| `id` | `number` | Student ID |
| `studentName` | `string` | Full name (firstName + lastName) |
| `email` | `string` | Parent email address |
| `phone` | `string` | Parent phone number |
| `status` | `string` | Status (typically `"Active"`) |

#### Error Responses

- **401 Unauthorized** – Missing authentication
- **404 Not Found** – Business not found
- **500 Internal Server Error** – Server error

#### Example Usage

```typescript
async function getBusinessStudents(businessId: number, page = 1, limit = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  const response = await fetch(
    `http://localhost:8080/business/${businessId}/students?${params}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Business not found')
    }
    throw new Error('Failed to fetch students')
  }

  const result = await response.json()
  return result.data
}

// Usage
const students = await getBusinessStudents(1, 1, 10)
console.log('Students:', students.data)
```

---

### PATCH `/business/{id}/status`

Toggles the active/inactive status of a business.

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Business ID |

#### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `boolean` | Yes | `true` for Active, `false` for Inactive |

#### Request Example

```json
{
  "status": false
}
```

#### Successful Response (200 OK)

```json
{
  "message": "Business status updated successfully",
  "success": true,
  "data": {
    "id": 1,
    "status": "Inactive"
  }
}
```

#### Error Responses

- **401 Unauthorized** – Missing authentication
- **404 Not Found** – Business not found
- **500 Internal Server Error** – Server error

#### Example Usage

```typescript
async function toggleBusinessStatus(id: number, status: boolean) {
  const response = await fetch(`http://localhost:8080/business/${id}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Business not found')
    }
    const error = await response.json()
    throw new Error(error.message || 'Failed to update status')
  }

  const result = await response.json()
  return result.data
}

// Usage
await toggleBusinessStatus(1, false) // Deactivate
await toggleBusinessStatus(1, true)  // Activate
```

---

## Frontend Integration Examples

### React Hook for Business Management

```typescript
import { useState, useEffect, useCallback } from 'react'

interface Business {
  id: number
  schoolName: string
  email: string
  phone: string
  status: string
  user: {
    id: string
    email: string
    phoneNo: string | null
  }
}

interface BusinessDetail extends Business {
  address: string | null
  website: string | null
  statistics: {
    students: number
    teachers: number
    revenue: number
    profit: number
  }
  contactInfo: {
    email: string
    phone: string
    address: string | null
    website: string | null
  }
  commission: {
    commissionType: string
    commissionValue: number
  } | null
}

export function useBusinesses(search = '', page = 1, limit = 10) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({
        ...(search && { search }),
        page: page.toString(),
        limit: limit.toString(),
      })

      const response = await fetch(`http://localhost:8080/business?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch businesses')
      }

      const result = await response.json()
      setBusinesses(result.data.data)
      setPagination(result.data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [search, page, limit])

  useEffect(() => {
    fetchBusinesses()
  }, [fetchBusinesses])

  return { businesses, pagination, loading, error, refetch: fetchBusinesses }
}

export function useBusiness(id: number | null) {
  const [business, setBusiness] = useState<BusinessDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    async function fetchBusiness() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`http://localhost:8080/business/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Business not found')
          }
          throw new Error('Failed to fetch business')
        }

        const result = await response.json()
        setBusiness(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchBusiness()
  }, [id])

  return { business, loading, error }
}

// Usage in component
function BusinessList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { businesses, pagination, loading, error } = useBusinesses(search, page, 10)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <input
        type="text"
        placeholder="Search businesses..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
      />
      <table>
        <thead>
          <tr>
            <th>School Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((business) => (
            <tr key={business.id}>
              <td>{business.schoolName}</td>
              <td>{business.email}</td>
              <td>{business.phone}</td>
              <td>{business.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

function BusinessDetail({ businessId }: { businessId: number }) {
  const { business, loading, error } = useBusiness(businessId)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!business) return <div>Business not found</div>

  return (
    <div>
      <h1>{business.schoolName}</h1>
      <div>
        <h2>Statistics</h2>
        <p>Students: {business.statistics.students}</p>
        <p>Teachers: {business.statistics.teachers}</p>
        <p>Revenue: ${business.statistics.revenue.toFixed(2)}</p>
        <p>Profit: ${business.statistics.profit.toFixed(2)}</p>
      </div>
      <div>
        <h2>Contact Information</h2>
        <p>Email: {business.contactInfo.email}</p>
        <p>Phone: {business.contactInfo.phone}</p>
        {business.contactInfo.address && <p>Address: {business.contactInfo.address}</p>}
        {business.contactInfo.website && <p>Website: {business.contactInfo.website}</p>}
      </div>
      {business.commission && (
        <div>
          <h2>Commission Settings</h2>
          <p>Type: {business.commission.commissionType}</p>
          <p>Value: {business.commission.commissionValue}</p>
        </div>
      )}
    </div>
  )
}
```

### Complete Business Management Service

```typescript
// services/businessService.ts

const API_BASE = 'http://localhost:8080'

export class BusinessService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    const result = await response.json()
    return result.data
  }

  async getBusinesses(search = '', page = 1, limit = 10) {
    const params = new URLSearchParams({
      ...(search && { search }),
      page: page.toString(),
      limit: limit.toString(),
    })
    return this.request(`/business?${params}`)
  }

  async getBusiness(id: number) {
    return this.request(`/business/${id}`)
  }

  async createBusiness(data: {
    schoolName: string
    email: string
    phone: string
    address?: string
    website?: string
    commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
    commissionValue: number
    status?: boolean
  }) {
    return this.request('/business', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateBusiness(id: number, data: {
    schoolName?: string
    email?: string
    phone?: string
    address?: string
    website?: string
    status?: boolean
  }) {
    return this.request(`/business/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async updateCommission(id: number, data: {
    commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
    commissionValue: number
    country?: string
    currency?: string
  }) {
    return this.request(`/business/${id}/commission`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async getBusinessStudents(businessId: number, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return this.request(`/business/${businessId}/students?${params}`)
  }

  async toggleStatus(id: number, status: boolean) {
    return this.request(`/business/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }
}

export const businessService = new BusinessService()
```

---

## Testing with cURL

```bash
# Get all businesses
curl -X GET "http://localhost:8080/business?page=1&limit=10" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"

# Search businesses
curl -X GET "http://localhost:8080/business?search=Bright&page=1&limit=10" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"

# Get business details
curl -X GET "http://localhost:8080/business/1" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"

# Create business
curl -X POST "http://localhost:8080/business" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "schoolName": "Bright Minds Academy",
    "email": "admin@brightminds.edu",
    "phone": "+1-555-123-4567",
    "address": "123 Main St, City, State 12345",
    "website": "https://brightminds.edu",
    "commissionType": "PERCENTAGE",
    "commissionValue": 100,
    "status": true
  }'

# Update business
curl -X PATCH "http://localhost:8080/business/1" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "schoolName": "Updated School Name",
    "phone": "+1-555-999-8888"
  }'

# Update commission
curl -X PATCH "http://localhost:8080/business/1/commission" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "commissionType": "PERCENTAGE",
    "commissionValue": 150
  }'

# Get business students
curl -X GET "http://localhost:8080/business/1/students?page=1&limit=10" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"

# Toggle business status
curl -X PATCH "http://localhost:8080/business/1/status" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": false
  }'
```

---

## Notes

1. **Business Creation**: When creating a business, the system automatically:
   - Creates a `User` account with role `ORGANIZATION_ADMIN`
   - Creates a `BusinessOrganization` record
   - Creates an initial `Commission` record with default values

2. **Default Values**: When creating a business, the following defaults are used:
   - `industry`: `"Education"`
   - `language`: `"en"`
   - `currency`: `"USD"`
   - `timeZone`: `"UTC"`
   - `websiteTheme`: `"default"`
   - `timeFormat`: `"24h"`
   - `startDateForWeeklyCalendar`: Current date
   - `ageCutoffDate`: Current date
   - Commission `country`: `"US"`
   - Commission `currency`: `"USD"`
   - Commission `appliesTo`: `"ALL"`

3. **Status Management**: The `status` field in requests uses boolean values (`true` = Active, `false` = Inactive), but the API returns string values (`"Active"` or `"Inactive"`).

4. **Commission Updates**: When updating commission settings, the system:
   - Deactivates all existing active commissions for the business
   - Creates a new commission record with the provided values
   - Sets `effectiveFrom` to the current date

5. **Statistics Calculation**:
   - **Students**: Count of all students in families belonging to the business
   - **Teachers**: Count of teachers associated with classes/drop-in classes for the business
   - **Revenue**: Sum of all cart amounts from completed orders
   - **Profit**: Revenue minus commission amount

6. **Email Uniqueness**: Email addresses must be unique across all users. Attempting to create a business with an existing email returns `409 Conflict`.

7. **Pagination**: All list endpoints support pagination. Default values are `page=1` and `limit=10`.

8. **Search**: The search parameter filters businesses by:
   - School name (case-insensitive)
   - Email (case-insensitive)
   - Phone number (case-insensitive)

## API Reference

View the interactive API reference at:
- **OpenAPI Reference**: `http://localhost:8080/reference`
- **Business Routes**: Tagged as `Business` in the OpenAPI documentation

## Related Documentation

- [Organization API](./organization-api.mdx) - For managing the current user's organization
- [Families API](./families-api.md) - For managing families and students
- [Frontend Integration Guide](./frontend-integration.md) - General integration patterns

