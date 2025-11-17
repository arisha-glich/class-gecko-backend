# Families & Students API

This guide documents the backend endpoints that power the "Create Family" and "Create Student" flows shown in the UI screenshots.

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
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "students": [
    {
      "id": 10,
      "firstName": "Emma",
      "lastName": "Doe",
      "dateOfBirth": "2015-09-02T00:00:00.000Z",
      "gender": "Female",
      "medicalInfo": "Peanut allergy",
      "photoVideoConsent": true
    }
  ]
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

---

## Endpoints

### Create Family
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
  "familyName": "Sample Family"
}
```

#### Response
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

### Get Families
**GET** `/families`

Returns all families belonging to the authenticated organization (newest first).

```json
{
  "message": "Families retrieved successfully",
  "success": true,
  "data": [{ ...familyObject }, ...]
}
```

---

### Get Family by ID
**GET** `/families/{id}`

Fetch a single family (including students). Returns `404` if the family does not belong to the current organization.

---

### Create Student for a Family
**POST** `/families/{id}/students`

Adds a child to the selected family. Use when the modal in the UI is filled out.

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

#### Response
```json
{
  "message": "Student created successfully",
  "success": true,
  "data": { ...studentObject }
}
```

---

## Example Usage (Fetch)

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

```bash
# Create family
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
        "sendPortalInvitation": true
      }'

# Add student
curl -X POST http://localhost:8080/families/1/students \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "firstName": "Emma", "lastName": "Doe" }'
```

---

## Student Management Endpoints

Use these endpoints to display the roster view or manage students directly.

### Get All Students
**GET** `/students`

### Get Student By ID
**GET** `/students/{id}`

### Get Students By Family
**GET** `/students/family/{familyId}`

### Update Student
**PATCH** `/students/{id}`

Body mirrors the student detail fields (basic info, personal info, medical & consent, measurements). Send only the fields that change.

### Delete Student
**DELETE** `/students/{id}`

---

## Notes
- Every family owns its own portal user (role `FAMILY`). Password is hashed via `Bun.password.hash`.
- Email addresses are unique across all users; attempting to reuse an email returns `409`.
- Students no longer create separate `user` records; they are stored under the `Student` model tied to a `Family`.
- Extend `Family` with additional contact panels (contacts, payment methods, etc.) by associating related tables via the `familyId`.

## References
- Schema: `prisma/schema.prisma` (`Family`, `Student`, `User`)
- Service logic: `src/services/families.service.ts`
- Routes: `src/routes/families/*`

