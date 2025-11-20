# Commission Management API

This document provides comprehensive API documentation for the Commission management endpoints in the Class Gecko backend. These endpoints allow admins to manage global and organization-specific commission settings.

## Base URL

All API endpoints are prefixed with the base URL:
```
http://localhost:8080
```

## Authentication & Authorization

All endpoints require:
1. **Authentication** - Valid session cookie
2. **Admin Role** - User must have `role: 'ADMIN'`

**Important:** When making requests from a browser, set `credentials: 'include'` in your fetch calls to automatically include cookies.

## Data Model Overview

### Commission Object
```json
{
  "id": 25,
  "businessId": null,
  "businessName": "Global (All Organizations)",
  "effectiveFrom": "2003-05-05T00:00:00.000Z",
  "country": "US",
  "currency": "USD",
  "commissionType": "PERCENTAGE",
  "commissionValue": 100,
  "tierConfig": null,
  "platformCommission": 0,
  "platformAmount": 0,
  "appliesTo": "ALL",
  "minTransactionAmt": 0,
  "maxTransactionAmt": null,
  "isActive": true,
  "createdAt": "2025-11-20T07:47:06.821Z",
  "updatedAt": "2025-11-20T07:47:06.821Z"
}
```

### Commission Types

#### Global Commission
- `businessId: null` - Applies to all organizations
- `businessName: "Global (All Organizations)"`
- Used as default when organization has no specific commission

#### Organization-Specific Commission
- `businessId: <number>` - Applies to specific business
- `businessName: "<Business Name>"`
- Overrides global commission for that organization

### Commission Priority System

1. **Organization-Specific Commission** (highest priority)
   - If a business has its own commission → uses that
   
2. **Global Commission** (fallback)
   - If no organization-specific commission → uses global
   
3. **No Commission** (lowest priority)
   - If no global commission exists → returns `null`

---

## Endpoints

### GET `/commissions`

Retrieves a paginated list of all commissions (global and organization-specific) with optional filters.

#### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `page` | `string` | No | Page number (default: `1`) |
| `limit` | `string` | No | Items per page (default: `10`) |
| `businessId` | `string` | No | Filter by business ID (number or `null` for global) |
| `isActive` | `string` | No | Filter by active status (`"true"` or `"false"`) |

#### Request Example

```bash
GET /commissions?page=1&limit=10&isActive=true
```

#### Successful Response (200 OK)

```json
{
  "message": "Commissions retrieved successfully",
  "success": true,
  "data": {
    "data": [
      {
        "id": 25,
        "businessId": null,
        "businessName": "Global (All Organizations)",
        "effectiveFrom": "2003-05-05T00:00:00.000Z",
        "country": "US",
        "currency": "USD",
        "commissionType": "PERCENTAGE",
        "commissionValue": 100,
        "tierConfig": null,
        "platformCommission": 0,
        "platformAmount": 0,
        "appliesTo": "ALL",
        "minTransactionAmt": 0,
        "maxTransactionAmt": null,
        "isActive": true,
        "createdAt": "2025-11-20T07:47:06.821Z",
        "updatedAt": "2025-11-20T07:47:06.821Z"
      },
      {
        "id": 26,
        "businessId": 3,
        "businessName": "Bright Minds Academy",
        "effectiveFrom": "2025-11-20T08:00:00.000Z",
        "country": "US",
        "currency": "USD",
        "commissionType": "PERCENTAGE",
        "commissionValue": 10,
        "tierConfig": null,
        "platformCommission": 0,
        "platformAmount": 0,
        "appliesTo": "ALL",
        "minTransactionAmt": null,
        "maxTransactionAmt": null,
        "isActive": true,
        "createdAt": "2025-11-20T08:00:00.000Z",
        "updatedAt": "2025-11-20T08:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

#### Response Fields

**Commission Object:**
| Field | Type | Description |
| --- | --- | --- |
| `id` | `number` | Unique commission ID |
| `businessId` | `number \| null` | Business ID (`null` = global commission) |
| `businessName` | `string \| null` | Business name or "Global (All Organizations)" |
| `effectiveFrom` | `string` | ISO datetime when commission becomes effective |
| `country` | `string` | ISO country code (e.g., "US", "CA") |
| `currency` | `string` | ISO currency code (e.g., "USD", "CAD") |
| `commissionType` | `string` | `"PERCENTAGE"`, `"FIXED"`, or `"TIERED"` |
| `commissionValue` | `number` | Commission value (percentage or fixed amount) |
| `tierConfig` | `object \| null` | Tier configuration for tiered commissions |
| `platformCommission` | `number` | Calculated platform commission % |
| `platformAmount` | `number` | Calculated platform commission amount |
| `appliesTo` | `string` | `"ALL"`, `"ONGOING_CLASSES"`, `"DROP_CLASSES"`, `"CAMPS"`, `"TRIALS"` |
| `minTransactionAmt` | `number \| null` | Minimum transaction amount |
| `maxTransactionAmt` | `number \| null` | Maximum transaction amount |
| `isActive` | `boolean` | Whether commission is currently active |
| `createdAt` | `string` | ISO datetime of creation |
| `updatedAt` | `string` | ISO datetime of last update |

#### Error Responses

- **401 Unauthorized** – Missing or invalid authentication
  ```json
  {
    "message": "Unauthorized"
  }
  ```

- **403 Forbidden** – User is not an admin
  ```json
  {
    "message": "Admin access required"
  }
  ```

- **500 Internal Server Error** – Server error during retrieval
  ```json
  {
    "message": "Failed to retrieve commissions"
  }
  ```

#### Example Usage

```typescript
async function getCommissions(
  page = 1,
  limit = 10,
  businessId?: number,
  isActive?: boolean
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(businessId !== undefined && { businessId: businessId.toString() }),
    ...(isActive !== undefined && { isActive: isActive.toString() }),
  })

  const response = await fetch(`http://localhost:8080/commissions?${params}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Admin access required')
    }
    throw new Error('Failed to fetch commissions')
  }

  const result = await response.json()
  return result.data
}

// Usage
const commissions = await getCommissions(1, 10, undefined, true)
console.log('Active commissions:', commissions.data)
```

---

### GET `/commissions/{id}`

Retrieves a specific commission by ID.

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Commission ID |

#### Successful Response (200 OK)

```json
{
  "message": "Commission retrieved successfully",
  "success": true,
  "data": {
    "id": 25,
    "businessId": null,
    "businessName": "Global (All Organizations)",
    "effectiveFrom": "2003-05-05T00:00:00.000Z",
    "country": "US",
    "currency": "USD",
    "commissionType": "PERCENTAGE",
    "commissionValue": 100,
    "tierConfig": null,
    "platformCommission": 0,
    "platformAmount": 0,
    "appliesTo": "ALL",
    "minTransactionAmt": 0,
    "maxTransactionAmt": null,
    "isActive": true,
    "createdAt": "2025-11-20T07:47:06.821Z",
    "updatedAt": "2025-11-20T07:47:06.821Z"
  }
}
```

#### Error Responses

- **401 Unauthorized** – Missing authentication
- **403 Forbidden** – Not an admin
- **404 Not Found** – Commission not found
- **500 Internal Server Error** – Server error

#### Example Usage

```typescript
async function getCommissionById(id: number) {
  const response = await fetch(`http://localhost:8080/commissions/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Commission not found')
    }
    if (response.status === 403) {
      throw new Error('Admin access required')
    }
    throw new Error('Failed to fetch commission')
  }

  const result = await response.json()
  return result.data
}

// Usage
const commission = await getCommissionById(25)
console.log('Commission:', commission)
```

---

### POST `/commissions/global`

Creates a global commission that applies to all organizations. When a global commission is created, existing active global commissions for the same country/currency are automatically deactivated.

#### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `commissionType` | `enum` | Yes | `"PERCENTAGE"`, `"FIXED"`, or `"TIERED"` |
| `commissionValue` | `number` | Yes | Commission value (must be ≥ 0) |
| `country` | `string` | No | ISO country code (default: `"US"`) |
| `currency` | `string` | No | ISO currency code (default: `"USD"`) |
| `effectiveFrom` | `string` | No | ISO datetime (default: current date) |
| `appliesTo` | `string` | No | `"ALL"`, `"ONGOING_CLASSES"`, etc. (default: `"ALL"`) |
| `minTransactionAmt` | `number` | No | Minimum transaction amount |
| `maxTransactionAmt` | `number` | No | Maximum transaction amount (0 = null) |
| `tierConfig` | `object` | No | Tier configuration for tiered commissions |

#### Request Example

```json
{
  "commissionType": "PERCENTAGE",
  "commissionValue": 20,
  "country": "US",
  "currency": "USD",
  "effectiveFrom": "2000-05-05T00:00:00.000Z",
  "appliesTo": "ALL",
  "minTransactionAmt": 0,
  "maxTransactionAmt": 0,
  "tierConfig": null
}
```

#### Successful Response (201 Created)

```json
{
  "message": "Global commission created successfully",
  "success": true,
  "data": {
    "id": 25,
    "businessId": null,
    "businessName": "Global (All Organizations)",
    "effectiveFrom": "2000-05-05T00:00:00.000Z",
    "country": "US",
    "currency": "USD",
    "commissionType": "PERCENTAGE",
    "commissionValue": 20,
    "tierConfig": null,
    "platformCommission": 0,
    "platformAmount": 0,
    "appliesTo": "ALL",
    "minTransactionAmt": 0,
    "maxTransactionAmt": null,
    "isActive": true,
    "createdAt": "2025-11-20T07:47:06.821Z",
    "updatedAt": "2025-11-20T07:47:06.821Z"
  }
}
```

#### Error Responses

- **401 Unauthorized** – Missing authentication
- **403 Forbidden** – Not an admin
- **500 Internal Server Error** – Server error during creation

#### Example Usage

```typescript
interface CreateGlobalCommissionData {
  commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
  commissionValue: number
  country?: string
  currency?: string
  effectiveFrom?: string
  appliesTo?: string
  minTransactionAmt?: number
  maxTransactionAmt?: number
  tierConfig?: Record<string, unknown>
}

async function createGlobalCommission(data: CreateGlobalCommissionData) {
  const response = await fetch('http://localhost:8080/commissions/global', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Admin access required')
    }
    const error = await response.json()
    throw new Error(error.message || 'Failed to create global commission')
  }

  const result = await response.json()
  return result.data
}

// Usage - Set 20% commission for all organizations
await createGlobalCommission({
  commissionType: 'PERCENTAGE',
  commissionValue: 20,
  country: 'US',
  currency: 'USD',
})
```

#### Important Notes

- **Automatic Deactivation**: When creating a new global commission, all existing active global commissions for the same country/currency are automatically deactivated.
- **Country Normalization**: Country code "USA" is automatically normalized to "US".
- **Max Transaction Amount**: If `maxTransactionAmt` is `0`, it's converted to `null` (no maximum).

---

### POST `/commissions/organization`

Creates a commission for a specific organization. This commission will override the global commission for that organization. When creating an organization commission, existing active commissions for that organization (same country/currency) are automatically deactivated.

#### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `businessId` | `number` | Yes | Business/Organization ID |
| `commissionType` | `enum` | Yes | `"PERCENTAGE"`, `"FIXED"`, or `"TIERED"` |
| `commissionValue` | `number` | Yes | Commission value (must be ≥ 0) |
| `country` | `string` | No | ISO country code (default: `"US"`) |
| `currency` | `string` | No | ISO currency code (default: `"USD"`) |
| `effectiveFrom` | `string` | No | ISO datetime (default: current date) |
| `appliesTo` | `string` | No | `"ALL"`, `"ONGOING_CLASSES"`, etc. (default: `"ALL"`) |
| `minTransactionAmt` | `number` | No | Minimum transaction amount |
| `maxTransactionAmt` | `number` | No | Maximum transaction amount (0 = null) |
| `tierConfig` | `object` | No | Tier configuration for tiered commissions |

#### Request Example

```json
{
  "businessId": 3,
  "commissionType": "PERCENTAGE",
  "commissionValue": 10,
  "country": "US",
  "currency": "USD",
  "effectiveFrom": "2025-11-20T00:00:00.000Z",
  "appliesTo": "ALL",
  "minTransactionAmt": null,
  "maxTransactionAmt": null,
  "tierConfig": null
}
```

#### Successful Response (201 Created)

```json
{
  "message": "Organization commission created successfully",
  "success": true,
  "data": {
    "id": 26,
    "businessId": 3,
    "businessName": "Bright Minds Academy",
    "effectiveFrom": "2025-11-20T00:00:00.000Z",
    "country": "US",
    "currency": "USD",
    "commissionType": "PERCENTAGE",
    "commissionValue": 10,
    "tierConfig": null,
    "platformCommission": 0,
    "platformAmount": 0,
    "appliesTo": "ALL",
    "minTransactionAmt": null,
    "maxTransactionAmt": null,
    "isActive": true,
    "createdAt": "2025-11-20T08:00:00.000Z",
    "updatedAt": "2025-11-20T08:00:00.000Z"
  }
}
```

#### Error Responses

- **401 Unauthorized** – Missing authentication
- **403 Forbidden** – Not an admin
- **404 Not Found** – Business not found
  ```json
  {
    "message": "Business not found"
  }
  ```
- **500 Internal Server Error** – Server error during creation

#### Example Usage

```typescript
interface CreateOrganizationCommissionData {
  businessId: number
  commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
  commissionValue: number
  country?: string
  currency?: string
  effectiveFrom?: string
  appliesTo?: string
  minTransactionAmt?: number
  maxTransactionAmt?: number
  tierConfig?: Record<string, unknown>
}

async function createOrganizationCommission(
  data: CreateOrganizationCommissionData
) {
  const response = await fetch(
    'http://localhost:8080/commissions/organization',
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Admin access required')
    }
    if (response.status === 404) {
      throw new Error('Business not found')
    }
    const error = await response.json()
    throw new Error(error.message || 'Failed to create organization commission')
  }

  const result = await response.json()
  return result.data
}

// Usage - Set 10% commission for business ID 3
await createOrganizationCommission({
  businessId: 3,
  commissionType: 'PERCENTAGE',
  commissionValue: 10,
  country: 'US',
  currency: 'USD',
})
```

#### Important Notes

- **Business Validation**: The system verifies the business exists before creating the commission.
- **Automatic Deactivation**: Existing active commissions for the same business, country, and currency are automatically deactivated.
- **Override Behavior**: This commission will override the global commission for this specific business.

---

### PATCH `/commissions/{id}`

Updates an existing commission by ID. Can update global or organization-specific commissions.

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Commission ID |

#### Request Body

All fields are optional. Only include fields you want to update.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `commissionType` | `enum` | No | `"PERCENTAGE"`, `"FIXED"`, or `"TIERED"` |
| `commissionValue` | `number` | No | Commission value (must be ≥ 0) |
| `country` | `string` | No | ISO country code |
| `currency` | `string` | No | ISO currency code |
| `effectiveFrom` | `string` | No | ISO datetime |
| `appliesTo` | `string` | No | `"ALL"`, `"ONGOING_CLASSES"`, etc. |
| `minTransactionAmt` | `number` | No | Minimum transaction amount |
| `maxTransactionAmt` | `number` | No | Maximum transaction amount |
| `tierConfig` | `object` | No | Tier configuration |
| `isActive` | `boolean` | No | Active status |

#### Request Example

```json
{
  "commissionValue": 15,
  "isActive": true
}
```

#### Successful Response (200 OK)

```json
{
  "message": "Commission updated successfully",
  "success": true,
  "data": {
    "id": 25,
    "businessId": null,
    "businessName": "Global (All Organizations)",
    "effectiveFrom": "2000-05-05T00:00:00.000Z",
    "country": "US",
    "currency": "USD",
    "commissionType": "PERCENTAGE",
    "commissionValue": 15,
    "tierConfig": null,
    "platformCommission": 0,
    "platformAmount": 0,
    "appliesTo": "ALL",
    "minTransactionAmt": 0,
    "maxTransactionAmt": null,
    "isActive": true,
    "createdAt": "2025-11-20T07:47:06.821Z",
    "updatedAt": "2025-11-20T08:30:00.000Z"
  }
}
```

#### Error Responses

- **401 Unauthorized** – Missing authentication
- **403 Forbidden** – Not an admin
- **404 Not Found** – Commission not found
- **500 Internal Server Error** – Server error

#### Example Usage

```typescript
interface UpdateCommissionData {
  commissionType?: 'PERCENTAGE' | 'FIXED' | 'TIERED'
  commissionValue?: number
  country?: string
  currency?: string
  effectiveFrom?: string
  appliesTo?: string
  minTransactionAmt?: number
  maxTransactionAmt?: number
  tierConfig?: Record<string, unknown>
  isActive?: boolean
}

async function updateCommission(id: number, data: UpdateCommissionData) {
  const response = await fetch(`http://localhost:8080/commissions/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Commission not found')
    }
    if (response.status === 403) {
      throw new Error('Admin access required')
    }
    const error = await response.json()
    throw new Error(error.message || 'Failed to update commission')
  }

  const result = await response.json()
  return result.data
}

// Usage - Update global commission to 15%
await updateCommission(25, {
  commissionValue: 15,
  isActive: true,
})
```

---

### DELETE `/commissions/{id}`

Deletes a commission by ID. Can delete global or organization-specific commissions.

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Commission ID |

#### Successful Response (200 OK)

```json
{
  "message": "Commission deleted successfully",
  "success": true,
  "data": {
    "success": true
  }
}
```

#### Error Responses

- **401 Unauthorized** – Missing authentication
- **403 Forbidden** – Not an admin
- **404 Not Found** – Commission not found
- **500 Internal Server Error** – Server error

#### Example Usage

```typescript
async function deleteCommission(id: number) {
  const response = await fetch(`http://localhost:8080/commissions/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Commission not found')
    }
    if (response.status === 403) {
      throw new Error('Admin access required')
    }
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete commission')
  }

  const result = await response.json()
  return result.data
}

// Usage
await deleteCommission(25)
```

---

## Frontend Integration Examples

### React Hook for Commission Management

```typescript
import { useState, useEffect, useCallback } from 'react'

interface Commission {
  id: number
  businessId: number | null
  businessName: string | null
  effectiveFrom: string
  country: string
  currency: string
  commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
  commissionValue: number
  tierConfig: Record<string, unknown> | null
  platformCommission: number
  platformAmount: number
  appliesTo: string
  minTransactionAmt: number | null
  maxTransactionAmt: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function useCommissions(
  page = 1,
  limit = 10,
  businessId?: number,
  isActive?: boolean
) {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCommissions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(businessId !== undefined && { businessId: businessId.toString() }),
        ...(isActive !== undefined && { isActive: isActive.toString() }),
      })

      const response = await fetch(
        `http://localhost:8080/commissions?${params}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Admin access required')
        }
        throw new Error('Failed to fetch commissions')
      }

      const result = await response.json()
      setCommissions(result.data.data)
      setPagination(result.data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [page, limit, businessId, isActive])

  useEffect(() => {
    fetchCommissions()
  }, [fetchCommissions])

  return { commissions, pagination, loading, error, refetch: fetchCommissions }
}

// Usage in component
function CommissionList() {
  const [page, setPage] = useState(1)
  const { commissions, pagination, loading, error } = useCommissions(page, 10)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Business</th>
            <th>Value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {commissions.map((commission) => (
            <tr key={commission.id}>
              <td>
                {commission.businessId === null ? 'Global' : 'Organization'}
              </td>
              <td>{commission.businessName}</td>
              <td>
                {commission.commissionType === 'PERCENTAGE'
                  ? `${commission.commissionValue}%`
                  : `$${commission.commissionValue}`}
              </td>
              <td>{commission.isActive ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### Complete Commission Management Service

```typescript
// services/commissionService.ts

const API_BASE = 'http://localhost:8080'

export class CommissionService {
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
      if (response.status === 403) {
        throw new Error('Admin access required')
      }
      const error = await response.json().catch(() => ({
        message: 'Request failed',
      }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    const result = await response.json()
    return result.data
  }

  async getCommissions(
    page = 1,
    limit = 10,
    businessId?: number,
    isActive?: boolean
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(businessId !== undefined && { businessId: businessId.toString() }),
      ...(isActive !== undefined && { isActive: isActive.toString() }),
    })
    return this.request(`/commissions?${params}`)
  }

  async getCommission(id: number) {
    return this.request(`/commissions/${id}`)
  }

  async createGlobalCommission(data: {
    commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
    commissionValue: number
    country?: string
    currency?: string
    effectiveFrom?: string
    appliesTo?: string
    minTransactionAmt?: number
    maxTransactionAmt?: number
    tierConfig?: Record<string, unknown>
  }) {
    return this.request('/commissions/global', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createOrganizationCommission(data: {
    businessId: number
    commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED'
    commissionValue: number
    country?: string
    currency?: string
    effectiveFrom?: string
    appliesTo?: string
    minTransactionAmt?: number
    maxTransactionAmt?: number
    tierConfig?: Record<string, unknown>
  }) {
    return this.request('/commissions/organization', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCommission(
    id: number,
    data: {
      commissionType?: 'PERCENTAGE' | 'FIXED' | 'TIERED'
      commissionValue?: number
      country?: string
      currency?: string
      effectiveFrom?: string
      appliesTo?: string
      minTransactionAmt?: number
      maxTransactionAmt?: number
      tierConfig?: Record<string, unknown>
      isActive?: boolean
    }
  ) {
    return this.request(`/commissions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteCommission(id: number) {
    return this.request(`/commissions/${id}`, {
      method: 'DELETE',
    })
  }
}

export const commissionService = new CommissionService()
```

---

## Testing with cURL

```bash
# Get all commissions
curl -X GET "http://localhost:8080/commissions?page=1&limit=10" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"

# Get active commissions only
curl -X GET "http://localhost:8080/commissions?isActive=true" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"

# Get commissions for specific business
curl -X GET "http://localhost:8080/commissions?businessId=3" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"

# Get commission by ID
curl -X GET "http://localhost:8080/commissions/25" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"

# Create global commission (20% for all)
curl -X POST "http://localhost:8080/commissions/global" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "commissionType": "PERCENTAGE",
    "commissionValue": 20,
    "country": "US",
    "currency": "USD"
  }'

# Create organization-specific commission (10% for business ID 3)
curl -X POST "http://localhost:8080/commissions/organization" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": 3,
    "commissionType": "PERCENTAGE",
    "commissionValue": 10,
    "country": "US",
    "currency": "USD"
  }'

# Update commission
curl -X PATCH "http://localhost:8080/commissions/25" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "commissionValue": 15,
    "isActive": true
  }'

# Delete commission
curl -X DELETE "http://localhost:8080/commissions/25" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Common Use Cases

### Use Case 1: Set Default Commission for All Organizations

```typescript
// Set 20% commission for all organizations
await commissionService.createGlobalCommission({
  commissionType: 'PERCENTAGE',
  commissionValue: 20,
  country: 'US',
  currency: 'USD',
})
```

### Use Case 2: Override Commission for Specific Organization

```typescript
// Set 10% commission for business ID 3 (overrides global 20%)
await commissionService.createOrganizationCommission({
  businessId: 3,
  commissionType: 'PERCENTAGE',
  commissionValue: 10,
  country: 'US',
  currency: 'USD',
})
```

### Use Case 3: Update Global Commission

```typescript
// Update global commission from 20% to 25%
const commissions = await commissionService.getCommissions(1, 10, null, true)
const globalCommission = commissions.data.find((c) => c.businessId === null)

if (globalCommission) {
  await commissionService.updateCommission(globalCommission.id, {
    commissionValue: 25,
  })
}
```

### Use Case 4: Deactivate Organization Commission (Fallback to Global)

```typescript
// Deactivate organization-specific commission
// Business will automatically use global commission
const commissions = await commissionService.getCommissions(1, 10, 3, true)
const orgCommission = commissions.data.find((c) => c.businessId === 3)

if (orgCommission) {
  await commissionService.updateCommission(orgCommission.id, {
    isActive: false,
  })
}
```

### Use Case 5: Delete Organization Commission

```typescript
// Delete organization commission
// Business will automatically use global commission
const commissions = await commissionService.getCommissions(1, 10, 3, true)
const orgCommission = commissions.data.find((c) => c.businessId === 3)

if (orgCommission) {
  await commissionService.deleteCommission(orgCommission.id)
}
```

---

## Important Notes

### 1. Commission Priority

The system follows this priority order:
1. **Organization-Specific Commission** (highest priority)
   - If business has its own commission → uses that
2. **Global Commission** (fallback)
   - If no organization commission → uses global
3. **No Commission** (lowest priority)
   - If no global commission → returns `null`

### 2. Automatic Deactivation

When creating a new commission:
- **Global Commission**: Deactivates existing active global commissions for the same country/currency
- **Organization Commission**: Deactivates existing active commissions for that business (same country/currency)

### 3. Country Code Normalization

- Country code `"USA"` is automatically normalized to `"US"`
- This ensures consistency in commission matching

### 4. Max Transaction Amount Handling

- If `maxTransactionAmt` is `0`, it's converted to `null` (no maximum)
- This allows for unlimited transaction amounts

### 5. Business Commission Resolution

When checking a business's commission:
- First checks for organization-specific active commission
- If not found, checks for global active commission
- Returns the first match found
- The `isGlobal` flag in business detail response indicates which type is being used

### 6. Commission Types

- **PERCENTAGE**: Commission is calculated as a percentage of transaction amount
- **FIXED**: Commission is a fixed amount per transaction
- **TIERED**: Commission uses tier configuration (requires `tierConfig`)

### 7. Admin-Only Access

All commission endpoints require:
- Valid authentication (session cookie)
- User role must be `'ADMIN'`

Non-admin users will receive `403 Forbidden` response.

---

## API Reference

View the interactive API reference at:
- **OpenAPI Reference**: `http://localhost:8080/reference`
- **Commission Routes**: Tagged as `Commissions` in the OpenAPI documentation

---

## Related Documentation

- [Business API](./business-api.md) - Business management endpoints
- [Changelog](./CHANGELOG.md) - Recent changes and updates
- [Frontend Integration Guide](./frontend-integration.md) - General integration patterns

---

## Troubleshooting

### Issue: "Admin access required" (403 Forbidden)

**Solution**: Ensure the logged-in user has `role: 'ADMIN'` in the database.

### Issue: "Business not found" when creating organization commission

**Solution**: Verify the `businessId` exists in the `BusinessOrganization` table.

### Issue: Global commission not applying to businesses

**Solution**: 
1. Verify global commission exists: `GET /commissions?businessId=null&isActive=true`
2. Check business detail response includes `isGlobal: true` in commission object
3. Ensure no organization-specific commission exists for that business

### Issue: Commission creation fails with Prisma error

**Solution**: 
1. Run database migration: `bun run db:migrate`
2. Regenerate Prisma client: `bun run db:generate`
3. Restart the server

---

**Last Updated**: November 20, 2025

