# Camps API

Comprehensive documentation for the Camp management endpoints exposed by the Class Gecko backend.

## Base URL

All routes are prefixed with:
```
http://localhost:8080
```

## Authentication

All endpoints require an authenticated session (Better Auth). Include the session cookie (`better-auth.session_token`) in requests or call the endpoints from the authenticated frontend with `credentials: 'include'`.

---

## Data Model

```json
{
  "id": 1,
  "userId": "user_cuid",
  "title": "Summer Adventure Camp",
  "startDate": "2025-06-01T00:00:00.000Z",
  "endDate": "2025-08-15T00:00:00.000Z",
  "allowParentsToBookIndividualDays": true,
  "allowParentsToBookHalfDaySession": false,
  "offerEarlyDropoff": true,
  "offerLatePickup": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

Field notes:
- `endDate` is optional. If omitted, the backend stores `null`.
- All date fields must be ISO 8601 strings.
- Boolean toggles default to `false` when omitted.

---

## Endpoints

### Create Camp
**POST** `/camps`

#### Request Body
```json
{
  "title": "Summer Adventure Camp",
  "startDate": "2025-06-01T00:00:00Z",
  "endDate": "2025-08-15T00:00:00Z",
  "allowParentsToBookIndividualDays": true,
  "allowParentsToBookHalfDaySession": false,
  "offerEarlyDropoff": true,
  "offerLatePickup": true
}
```

#### Success Response
```json
{
  "message": "Camp created successfully",
  "success": true,
  "data": { ...campObject }
}
```

#### Errors
- `401 Unauthorized` – No session.
- `500 Internal Server Error` – Unexpected failure.

---

### Get Camps (Current User)
**GET** `/camps`

Returns all camps owned by the authenticated user (newest first).

#### Success Response
```json
{
  "message": "Camps retrieved successfully",
  "success": true,
  "data": [{ ...campObject }, ...]
}
```

---

### Get Camp by ID
**GET** `/camps/{id}`

#### Path Param
- `id` – Numeric camp identifier.

#### Success Response
```json
{
  "message": "Camp retrieved successfully",
  "success": true,
  "data": { ...campObject }
}
```

#### Errors
- `404 Not Found` – Camp does not exist or belongs to another user.
- `401 Unauthorized`
- `500 Internal Server Error`

---

### Update Camp
**PATCH** `/camps/{id}`

All fields optional; send only what needs to change.

#### Request Body Example
```json
{
  "title": "Updated Camp Name",
  "endDate": null,
  "offerLatePickup": false
}
```

#### Success Response
```json
{
  "message": "Camp updated successfully",
  "success": true,
  "data": { ...updatedCampObject }
}
```

#### Errors
- `404 Not Found`
- `401 Unauthorized`
- `500 Internal Server Error`

---

### Delete Camp
**DELETE** `/camps/{id}`

#### Success Response
```json
{
  "message": "Camp deleted successfully",
  "success": true
}
```

#### Errors
- `404 Not Found`
- `401 Unauthorized`
- `500 Internal Server Error`

---

## Example Usage (Fetch)

```typescript
async function createCamp(data: {
  title: string
  startDate: string
  endDate?: string | null
  allowParentsToBookIndividualDays?: boolean
  allowParentsToBookHalfDaySession?: boolean
  offerEarlyDropoff?: boolean
  offerLatePickup?: boolean
}) {
  const response = await fetch('http://localhost:8080/camps', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create camp')
  }

  return response.json()
}
```

```typescript
async function getCamps() {
  const response = await fetch('http://localhost:8080/camps', {
    method: 'GET',
    credentials: 'include',
  })
  if (!response.ok) throw new Error('Failed to fetch camps')
  return response.json()
}
```

---

## Testing (cURL)

```bash
# Create
curl -X POST http://localhost:8080/camps \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "title": "Adventure Camp",
        "startDate": "2025-06-01T00:00:00Z",
        "allowParentsToBookIndividualDays": true
      }'

# Get All
curl -X GET http://localhost:8080/camps \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN"

# Update
curl -X PATCH http://localhost:8080/camps/1 \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "offerLatePickup": true }'

# Delete
curl -X DELETE http://localhost:8080/camps/1 \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN"
```

---

## Notes
- All camp records are scoped per user; there is no public listing.
- `endDate` toggle in the UI maps to sending `endDate` (ISO string) or omitting it.
- If you need Camp listings by other filters (date ranges, etc.), extend the service layer in `src/services/camps.service.ts`.

## References
- Backend routes: `src/routes/camps/*`
- Service logic: `src/services/camps.service.ts`
- Schema: `prisma/schema.prisma` (`Camp` model)

