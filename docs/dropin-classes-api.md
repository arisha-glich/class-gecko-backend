# Drop-In Classes API

This document explains how frontend developers can integrate with the `/dropin-classes` endpoints. Drop-in classes share the same structure as regular classes but are **not** tied to terms/seasons.

## Base URL
```
http://localhost:8080
```
All endpoints require an authenticated organization session (Better Auth cookie `better-auth.session_token`). In fetch requests, use `credentials: 'include'`.

---

## Data Model

```json
{
  "id": 12,
  "userId": "org-user-id",
  "title": "Drop-In Tumbling",
  "description": "Single-session clinic",
  "startDate": "2025-06-15T00:00:00.000Z",
  "endDate": "2025-06-15T02:00:00.000Z",
  "frequency": "WEEKLY",
  "recurringDay": "Sunday",
  "startTimeOfClass": "10:00",
  "endTimeOfClass": "12:00",
  "duration": 120,
  "pricingPerLesson": 35,
  "classImage": null,
  "locationId": 4,
  "teacherId": 7,
  "minimumAge": 6,
  "maximumAge": 12,
  "classColor": "#28A8E0",
  "limitCapacity": true,
  "capacity": 12,
  "allowPortalBooking": true,
  "familyPortalTrial": false,
  "globalClassDiscount": false,
  "siblingDiscount": false,
  "classType": "DROP_CLASS",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "location": {
    "id": 4,
    "name": "Main Gym",
    "address": "123 Main St"
  },
  "teacher": {
    "id": 7,
    "firstName": "Alex",
    "lastName": "Smith",
    "email": "alex@gym.com"
  }
}
```

Fields mirror the standard `Class` model. `classType` defaults to `DROP_CLASS`.

---

## Endpoints

### Create Drop-In Class
**POST** `/dropin-classes`

#### Request Body
```json
{
  "title": "Drop-In Tumbling",
  "description": "Single-session clinic",
  "startDate": "2025-06-15T00:00:00Z",
  "endDate": "2025-06-15T02:00:00Z",
  "frequency": "WEEKLY",
  "recurringDay": "Sunday",
  "startTimeOfClass": "10:00",
  "endTimeOfClass": "12:00",
  "duration": 120,
  "pricingPerLesson": 35,
  "limitCapacity": true,
  "capacity": 12,
  "locationId": 4,
  "teacherId": 7,
  "classType": "DROP_CLASS"
}
```

#### Success Response
```json
{
  "message": "Drop-in class created successfully",
  "success": true,
  "data": { ...dropInClassObject }
}
```

#### Errors
- `401 Unauthorized`
- `500 Internal Server Error`

---

### List Drop-In Classes
**GET** `/dropin-classes`

Returns all drop-in classes for the authenticated organization (newest first).

---

### Get Drop-In Class by ID
**GET** `/dropin-classes/{id}`

Returns `404` if the class does not belong to the org.

---

### Update Drop-In Class
**PATCH** `/dropin-classes/{id}`

Send only fields that change; payload mirrors the create request.

---

### Delete Drop-In Class
**DELETE** `/dropin-classes/{id}`

---

## Example Fetch Helpers

```typescript
const API_BASE = 'http://localhost:8080'

async function createDropInClass(payload: CreateDropInClassPayload) {
  const response = await fetch(`${API_BASE}/dropin-classes`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw await response.json()
  return response.json()
}

async function listDropInClasses() {
  const response = await fetch(`${API_BASE}/dropin-classes`, {
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
curl -X POST http://localhost:8080/dropin-classes \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "title": "Drop-In Tumbling",
        "startDate": "2025-06-15T00:00:00Z",
        "endDate": "2025-06-15T02:00:00Z",
        "frequency": "WEEKLY",
        "startTimeOfClass": "10:00",
        "duration": 120,
        "pricingPerLesson": 35
      }'

# List
curl -X GET http://localhost:8080/dropin-classes \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN"

# Update
curl -X PATCH http://localhost:8080/dropin-classes/12 \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "capacity": 15 }'

# Delete
curl -X DELETE http://localhost:8080/dropin-classes/12 \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN"
```

---

## Notes
- Payload is identical to standard classes. Ignore `termId` since drop-ins are standalone.
- Use boolean toggles (`limitCapacity`, `allowPortalBooking`, etc.) exactly as in the regular class UI.
- For recurring drop-ins, set `frequency` and `recurringDay`; for single events set `startDate` = `endDate`.

## References
- Schema: `prisma/schema.prisma` (`DropInClass`)
- Service: `src/services/dropin-classes.service.ts`
- Routes: `src/routes/dropin-classes/*`


