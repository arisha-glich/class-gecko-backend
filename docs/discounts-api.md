# Discounts API

This guide documents the `/discounts` endpoints that power the “Discount Schemes” UI (multiple student, class by student, class by family) and their discount tiers.

## Base URL
```
http://localhost:8080
```
All endpoints require an authenticated organization session (Better Auth). Include cookies (`credentials: 'include'`).

---

## Data Model

```json
{
  "id": 5,
  "title": "Multiple Student Discount",
  "category": "MULTIPLE_STUDENT",
  "description": "Apply a discount to families with multiple students.",
  "discountType": "PERCENTAGE",
  "discountValue": 0,
  "appliesTo": "TUITION",
  "validFrom": "2025-01-01T00:00:00.000Z",
  "validUntil": "2025-12-31T23:59:59.000Z",
  "isActive": true,
  "tiers": [
    { "id": 1, "studentsPerFamily": 1, "percentageOff": 5 },
    { "id": 2, "studentsPerFamily": 2, "percentageOff": 7.5 }
  ]
}
```

`tiers` define the “Discount List” shown in the UI (students per family / percentage off). For class-based discounts you can use `classesPerStudent` instead of `studentsPerFamily`.

`category` options:
- `MULTIPLE_STUDENT`
- `CLASS_BY_STUDENT`
- `CLASS_BY_FAMILY`

`discountType` options:
- `PERCENTAGE`
- `FIXED`

---

## Endpoints

### Create Discount
**POST** `/discounts`

```json
{
  "title": "Multiple Student Discount",
  "category": "MULTIPLE_STUDENT",
  "discountType": "PERCENTAGE",
  "discountValue": 0,
  "appliesTo": "TUITION",
  "validFrom": "2025-01-01T00:00:00Z",
  "validUntil": "2025-12-31T23:59:59Z",
  "isActive": true,
  "tiers": [
    { "studentsPerFamily": 1, "percentageOff": 5 },
    { "studentsPerFamily": 2, "percentageOff": 7.5 }
  ]
}
```

Returns the discount with its tiers.

### List Discounts
**GET** `/discounts`

Returns all discounts (with tiers) belonging to the org.

### Get Discount
**GET** `/discounts/{id}`

### Update Discount
**PATCH** `/discounts/{id}`

- Send only the fields that change.
- If `tiers` is provided, the backend replaces the entire tier list with the new array.

### Delete Discount
**DELETE** `/discounts/{id}`

---

## Example Fetch Helpers

```typescript
const API_BASE = 'http://localhost:8080'

export async function createDiscount(payload: CreateDiscountPayload) {
  const response = await fetch(`${API_BASE}/discounts`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw await response.json()
  return response.json()
}

export async function listDiscounts() {
  const response = await fetch(`${API_BASE}/discounts`, {
    method: 'GET',
    credentials: 'include',
  })
  if (!response.ok) throw await response.json()
  return response.json()
}
```

---

## Testing (cURL)

```bash
# Create
curl -X POST http://localhost:8080/discounts \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "title": "Multiple Student Discount",
        "category": "MULTIPLE_STUDENT",
        "discountType": "PERCENTAGE",
        "discountValue": 0,
        "appliesTo": "TUITION",
        "validFrom": "2025-01-01T00:00:00Z",
        "validUntil": "2025-12-31T23:59:59Z",
        "tiers": [
          { "studentsPerFamily": 1, "percentageOff": 5 },
          { "studentsPerFamily": 2, "percentageOff": 7.5 }
        ]
      }'

# Update (replace tiers)
curl -X PATCH http://localhost:8080/discounts/5 \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "tiers": [{ "studentsPerFamily": 3, "percentageOff": 10 }] }'
```

---

## Notes
- For “Multiple Student” discounts use `studentsPerFamily` tiers.
- For “Class discount by student”, use `classesPerStudent` tiers.
- `discountValue` can remain `0` if all logic is within tiers.
- `isActive` controls the toggle in the UI. `timesUsed` automatically increments when applied (implementation-dependent).

## References
- Schema: `prisma/schema.prisma` (`Discount`, `DiscountTier`, `DiscountCategory`)
- Service: `src/services/discounts.service.ts`
- Routes: `src/routes/discounts/*`


