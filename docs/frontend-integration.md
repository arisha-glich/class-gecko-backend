# Frontend Integration Guide - Class Gecko Backend APIs

This guide provides comprehensive documentation for integrating the Class Gecko backend APIs with your frontend application.

## ⚠️ Migration Status

**✅ Database Schema Synced:** All schema changes have been applied to the database using `prisma db push`. The API endpoints are ready to use.

**Note:** For production deployments, you should create a proper migration file instead of using `db push`. See `docs/CHANGES_SUMMARY.md` for details.

## Base URL

All API endpoints are prefixed with the base URL:
```
http://localhost:8080
```

## Authentication

All endpoints require authentication. The backend uses **cookie-based sessions** via Better Auth.

### Step 1: Sign In or Sign Up

Before accessing any protected endpoints, you need to authenticate:

#### Sign Up
```typescript
POST /api/auth/sign-up/email

Request Body:
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "role": "FAMILY" // Optional, defaults to "FAMILY"
}

Response: Sets session cookies automatically
```

#### Sign In
```typescript
POST /api/auth/sign-in/email

Request Body:
{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: Sets session cookies automatically
```

### Step 2: Use Authenticated Endpoints

After signing in, **cookies are automatically included** in subsequent requests. No need to manually add headers.

**For Browser/Fetch:**
```typescript
// Cookies are automatically sent with fetch requests
const response = await fetch('http://localhost:8080/terms', {
  method: 'GET',
  credentials: 'include', // Important: include cookies
  headers: {
    'Content-Type': 'application/json',
  },
})
```

**For Testing Tools (Postman/curl):**
1. First, make a sign-in request
2. Copy the `better-auth.session_token` cookie from the response
3. Include it in subsequent requests:
   ```bash
   curl -X GET http://localhost:8080/terms \
     -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN"
   ```

### Check Session Status

To verify you're authenticated:
```typescript
GET /api/auth/get-session

Response:
{
  "user": { ... },
  "session": { ... }
}
```

### Auth Reference

View all available auth endpoints at:
- **Auth API Reference**: `http://localhost:8080/api/auth/reference`

## API Endpoints

### Terms (Seasons)

#### Create Term
**POST** `/terms`

**Request Body:**
```json
{
  "title": "Fall 2025",
  "startDate": "2025-09-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z",
  "registrationFee": true,
  "seasonSpecificFee": true,
  "pricingType": "By Lesson",
  "billingOptions": [
    {
      "enabled": true,
      "type": "Upfront",
      "paymentDate": "2025-09-01T00:00:00Z"
    },
    {
      "enabled": true,
      "type": "Weekly",
      "frequency": "1 week",
      "startDate": "2025-09-01T00:00:00Z"
    },
    {
      "enabled": false,
      "type": "Monthly",
      "frequency": "1 month",
      "startDate": "2025-09-01T00:00:00Z"
    },
    {
      "enabled": false,
      "type": "Every two weeks",
      "frequency": "2 weeks",
      "startDate": "2025-09-01T00:00:00Z"
    },
    {
      "enabled": false,
      "type": "Custom",
      "customName": "Bi-weekly",
      "customDescription": "Pay every two weeks",
      "customFrequency": "2 weeks",
      "customStartDate": "2025-09-01T00:00:00Z"
    }
  ],
  "pricing": {
    "perLesson": 25.00
  },
  "seasonSpecificFees": [
    {
      "name": "Test Fee",
      "amount": 10.00,
      "maxPerFamily": 100.00
    }
  ]
}
```

**Response:**
```json
{
  "message": "Term created successfully",
  "success": true,
  "data": {
    "id": 1,
    "userId": "user123",
    "title": "Fall 2025",
    "startDate": "2025-09-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "registrationFee": true,
    "seasonSpecificFee": true,
    "pricingType": "By Lesson",
    "billingOptions": [...],
    "pricing": {...},
    "seasonSpecificFees": [...],
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

#### Get All Terms
**GET** `/terms`

**Response:**
```json
{
  "message": "Terms retrieved successfully",
  "success": true,
  "data": [...]
}
```

#### Get Term by ID
**GET** `/terms/{id}`

#### Update Term
**PATCH** `/terms/{id}`

**Request Body:** (Same as Create, all fields optional)

#### Delete Term
**DELETE** `/terms/{id}`

---

### Classes

#### Create Class
**POST** `/classes`

**Request Body:**
```json
{
  "title": "Class 01",
  "description": "Description of the class",
  "startDate": "2025-09-02T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z",
  "frequency": "WEEKLY",
  "recurringDay": "Monday",
  "startTimeOfClass": "13:00",
  "endTimeOfClass": "13:30",
  "duration": 30,
  "pricingPerLesson": 25.00,
  "classImage": "https://example.com/image.jpg",
  "locationId": 1,
  "teacherId": 1,
  "minimumAge": 5,
  "maximumAge": 12,
  "classColor": "#FF5733",
  "limitCapacity": true,
  "capacity": 15,
  "allowPortalBooking": true,
  "familyPortalTrial": false,
  "globalClassDiscount": true,
  "siblingDiscount": true,
  "classType": "ONGOING_CLASS",
  "termId": 1
}
```

**Response:**
```json
{
  "message": "Class created successfully",
  "success": true,
  "data": {
    "id": 1,
    "title": "Class 01",
    "description": "Description of the class",
    "startDate": "2025-09-02T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "frequency": "WEEKLY",
    "recurringDay": "Monday",
    "startTimeOfClass": "13:00",
    "endTimeOfClass": "13:30",
    "duration": 30,
    "pricingPerLesson": 25.00,
    "classImage": "https://example.com/image.jpg",
    "locationId": 1,
    "teacherId": 1,
    "minimumAge": 5,
    "maximumAge": 12,
    "classColor": "#FF5733",
    "limitCapacity": true,
    "capacity": 15,
    "allowPortalBooking": true,
    "familyPortalTrial": false,
    "globalClassDiscount": true,
    "siblingDiscount": true,
    "classType": "ONGOING_CLASS",
    "termId": 1,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

#### Get All Classes
**GET** `/classes`

#### Get Class by ID
**GET** `/classes/{id}`

**Response includes:**
- Class details
- Associated lessons
- Enrollments with student information
- Trials with student information
- Teacher and location information

#### Get Classes by Term
**GET** `/classes/term/{termId}`

#### Update Class
**PATCH** `/classes/{id}`

**Request Body:** (Same as Create, all fields optional)

#### Delete Class
**DELETE** `/classes/{id}`

---

### Lessons

#### Create Lesson
**POST** `/lessons`

**Request Body:**
```json
{
  "classId": 1,
  "title": "Lesson 1",
  "isTrial": false,
  "status": "scheduled",
  "attendanceId": "attendance123",
  "notes": "First lesson notes",
  "date": "2025-10-13T00:00:00Z",
  "startTime": "13:00",
  "endTime": "13:30",
  "duration": 30
}
```

**Response:**
```json
{
  "message": "Lesson created successfully",
  "success": true,
  "data": {
    "id": 1,
    "classId": 1,
    "title": "Lesson 1",
    "isTrial": false,
    "status": "scheduled",
    "attendanceId": "attendance123",
    "notes": "First lesson notes",
    "date": "2025-10-13T00:00:00Z",
    "startTime": "13:00",
    "endTime": "13:30",
    "duration": 30,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

#### Get All Lessons
**GET** `/lessons`

#### Get Lesson by ID
**GET** `/lessons/{id}`

#### Get Lessons by Class
**GET** `/lessons/class/{classId}`

#### Update Lesson
**PATCH** `/lessons/{id}`

**Request Body:** (Same as Create, all fields optional)

#### Delete Lesson
**DELETE** `/lessons/{id}`

---

### Enrollments (Class Bookings)

#### Create Enrollment
**POST** `/enrollments`

**Request Body:**
```json
{
  "classId": 1,
  "termId": 1,
  "studentId": 1,
  "enrollmentStartDate": "2025-10-01T00:00:00Z",
  "enrollmentEndDate": "2025-12-31T23:59:59Z",
  "paymentOption": "Weekly"
}
```

**Response:**
```json
{
  "message": "Enrollment created successfully",
  "success": true,
  "data": {
    "id": 1,
    "userId": "user123",
    "classId": 1,
    "termId": 1,
    "studentId": 1,
    "enrollmentStartDate": "2025-10-01T00:00:00Z",
    "enrollmentEndDate": "2025-12-31T23:59:59Z",
    "paymentOption": "Weekly",
    "status": "Active",
    "date": "2025-01-01T00:00:00Z",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

#### Get All Enrollments
**GET** `/enrollments`

#### Get Enrollment by ID
**GET** `/enrollments/{id}`

#### Get Enrollments by Class
**GET** `/enrollments/class/{classId}`

#### Update Enrollment
**PATCH** `/enrollments/{id}`

**Request Body:** (Same as Create, all fields optional)

#### Delete Enrollment
**DELETE** `/enrollments/{id}`

---

### Trials

#### Create Trial
**POST** `/trials`

**Request Body:**
```json
{
  "classId": 1,
  "termId": 1,
  "studentId": 1,
  "lessonId": 1,
  "date": "2025-10-13T00:00:00Z",
  "status": "pending",
  "notes": "Trial lesson notes"
}
```

**Response:**
```json
{
  "message": "Trial created successfully",
  "success": true,
  "data": {
    "id": 1,
    "userId": "user123",
    "classId": 1,
    "termId": 1,
    "studentId": 1,
    "lessonId": 1,
    "date": "2025-10-13T00:00:00Z",
    "status": "pending",
    "notes": "Trial lesson notes",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

#### Get All Trials
**GET** `/trials`

#### Get Trial by ID
**GET** `/trials/{id}`

#### Get Trials by Class
**GET** `/trials/class/{classId}`

#### Update Trial
**PATCH** `/trials/{id}`

**Request Body:** (Same as Create, all fields optional)

#### Delete Trial
**DELETE** `/trials/{id}`

---

### Waitlist

#### Add to Waitlist
**POST** `/waitlist`

**Request Body:**
```json
{
  "termId": 1,
  "studentId": 1,
  "classId": 1
}
```

**Response:**
```json
{
  "message": "Added to waitlist successfully",
  "success": true,
  "data": {
    "id": 1,
    "termId": 1,
    "userId": "user123",
    "studentId": 1,
    "classId": 1,
    "date": "2025-01-01T00:00:00Z",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

#### Get All Waitlist Entries
**GET** `/waitlist`

#### Get Waitlist Entry by ID
**GET** `/waitlist/{id}`

#### Get Waitlist by Class
**GET** `/waitlist/class/{classId}`

#### Update Waitlist Entry
**PATCH** `/waitlist/{id}`

**Request Body:** (Same as Create, all fields optional)

#### Remove from Waitlist
**DELETE** `/waitlist/{id}`

---

### Camps

#### Create Camp
**POST** `/camps`

**Request Body:**
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

**Response:**
```json
{
  "message": "Camp created successfully",
  "success": true,
  "data": {
    "id": 1,
    "userId": "user123",
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
}
```

#### Get All Camps
**GET** `/camps`

#### Get Camp by ID
**GET** `/camps/{id}`

#### Update Camp
**PATCH** `/camps/{id}`

**Request Body:** (Same structure as Create, all fields optional)

#### Delete Camp
**DELETE** `/camps/{id}`

**Notes:**
- `endDate` is optional. If the UI toggle is off, omit the field.
- Boolean flags default to `false` when omitted.
- All dates should use ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`).

### Organization

### Families

#### Create Family Account
**POST** `/families`

Use this when submitting the "Create Family" modal. Required fields: `firstName`, `lastName`, `email`, and `password`. Optional fields map to the UI toggles and phone inputs.

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

Response returns both the family record and the created user (role `FAMILY`). The password is stored hashed and is never returned.

#### Add Student to Family
**POST** `/families/{id}/students`

Transforms the "Create Student" UI payload directly:

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

The `id` path param is the family ID from the previously created family. Students are returned in the family details and can be displayed in the "Students" list.

### Drop-in Classes

Drop-in classes share the same payload structure as standard classes but are not linked to terms/sessions. They live under `/dropin-classes`.

#### Create Drop-in Class
**POST** `/dropin-classes`

Payload mirrors the class form:

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
  "classType": "DROP_CLASS"
}
```

Use the same bool toggles (`allowPortalBooking`, `familyPortalTrial`, `globalClassDiscount`, `siblingDiscount`) as the standard class form.

#### List / Manage Drop-in Classes

- **GET** `/dropin-classes` – list all drop-in classes for the org
- **GET** `/dropin-classes/{id}` – details
- **PATCH** `/dropin-classes/{id}` – update (send changed fields only)
- **DELETE** `/dropin-classes/{id}` – remove


#### Students List / Maintenance

- **GET** `/students` – fetch all students for the organization
- **GET** `/students/family/{familyId}` – list children for one family
- **PATCH** `/students/{id}` – update student info (name, DOB, medical fields, consent, measurements, etc.)
- **DELETE** `/students/{id}` – remove a student


### Discounts

Manage all discount schemes via `/discounts`.

#### Create Discount
**POST** `/discounts`

Payload mirrors the “Create Discount Scheme” UI. Example for Multiple Student:
```json
{
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
}
```

#### Discount Tiers
- “Discount List” rows are returned in `tiers`.
- For class-by-student schemes, send `classesPerStudent` instead of `studentsPerFamily`.
- Updating with `tiers` replaces the entire list.

#### Other endpoints
- **GET** `/discounts` – list all schemes (with tiers)
- **GET** `/discounts/{id}` – details
- **PATCH** `/discounts/{id}` – update metadata and/or tiers
- **DELETE** `/discounts/{id}` – remove scheme


#### Get Current User Organization
**GET** `/organization`

Retrieves the organization information for the currently authenticated user.

**Response:**
```json
{
  "message": "Organization retrieved successfully",
  "success": true,
  "data": {
    "organization": {
      "id": 1,
      "companyName": "Gecko Gymnastics",
      "industry": "Sports & Recreation",
      "language": "en",
      "currency": "USD",
      "timeZone": "UTC",
      "websiteTheme": "default",
      "timeFormat": "24h",
      "startDateForWeeklyCalendar": "2025-01-01T00:00:00Z",
      "ageCutoffDate": "2025-01-01T00:00:00Z",
      "logo": null
    }
  }
}
```

**Note:** If the user doesn't have an organization yet, `organization` will be `null`.

#### Update Organization
**PATCH** `/organization`

**Request Body:**
```json
{
  "phoneNo": "+1-555-123-4567",
  "organizationName": "Gecko Gymnastics",
  "industry": "Sports & Recreation",
  "students": 125
}
```

**Response:**
```json
{
  "message": "Organization profile updated successfully",
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "phoneNo": "+1-555-123-4567",
      "onboardingStage": "organization-updated",
      "meta": {
        "students": 125
      }
    },
    "organization": {
      "id": 1,
      "companyName": "Gecko Gymnastics",
      "industry": "Sports & Recreation"
    }
  }
}
```

---

## Frontend Implementation Examples

### TypeScript/React Example

```typescript
const API_BASE_URL = 'http://localhost:8080'

// Create Term
async function createTerm(termData: CreateTermData) {
  const response = await fetch(`${API_BASE_URL}/terms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(termData)
  })

  if (!response.ok) {
    throw new Error('Failed to create term')
  }

  return response.json()
}

// Get Classes for a Term
async function getClassesByTerm(termId: number) {
  const response = await fetch(`${API_BASE_URL}/classes/term/${termId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch classes')
  }

  return response.json()
}

// Create Class
async function createClass(classData: CreateClassData) {
  const response = await fetch(`${API_BASE_URL}/classes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(classData)
  })

  if (!response.ok) {
    throw new Error('Failed to create class')
  }

  return response.json()
}

// Add Lesson
async function addLesson(lessonData: CreateLessonData) {
  const response = await fetch(`${API_BASE_URL}/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(lessonData)
  })

  if (!response.ok) {
    throw new Error('Failed to add lesson')
  }

  return response.json()
}

// Create Enrollment
async function createEnrollment(enrollmentData: CreateEnrollmentData) {
  const response = await fetch(`${API_BASE_URL}/enrollments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(enrollmentData)
  })

  if (!response.ok) {
    throw new Error('Failed to create enrollment')
  }

  return response.json()
}

// Add Trial
async function addTrial(trialData: CreateTrialData) {
  const response = await fetch(`${API_BASE_URL}/trials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(trialData)
  })

  if (!response.ok) {
    throw new Error('Failed to add trial')
  }

  return response.json()
}

// Add to Waitlist
async function addToWaitlist(waitlistData: CreateWaitlistData) {
  const response = await fetch(`${API_BASE_URL}/waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(waitlistData)
  })

  if (!response.ok) {
    throw new Error('Failed to add to waitlist')
  }

  return response.json()
}
```

## Error Handling

All endpoints return errors in the following format:

```json
{
  "message": "Error message here",
  "success": false
}
```

Common HTTP status codes:
- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Data Types

### Frequency Enum
- `DAILY`
- `WEEKLY`
- `MONTHLY`

### Class Type Enum
- `ONGOING_CLASS`
- `DROP_CLASS`

### Pricing Type
- `By Lesson`
- `By Month`
- `By Season`
- `Number of Classes`
- `Number of Hours`

### Billing Options

Each billing option has the following structure:

```typescript
{
  enabled: boolean,        // Whether this option is enabled/checked (required)
  type: 'Upfront' | 'Monthly' | 'Every two weeks' | 'Weekly' | 'Custom',  // Required

  // For Upfront payments:
  paymentDate?: string,    // ISO datetime string (optional) - when payment is due

  // For recurring payments (Monthly, Every two weeks, Weekly):
  frequency?: string,      // Optional - e.g., "1 month", "2 weeks", "1 week"
  startDate?: string,      // Optional - ISO datetime string when recurring payments start

  // For Custom payment options:
  customName?: string,     // Optional - Name of the custom option
  customDescription?: string,  // Optional
  customFrequency?: string,    // Optional - Custom frequency description
  customStartDate?: string     // Optional - ISO datetime string
}
```

**Important Notes:**
- All date fields are **optional strings** (not strictly validated as datetime)
- Use ISO 8601 format for dates (e.g., `2025-09-01T00:00:00Z`)
- The `enabled` field controls whether the billing option checkbox is checked
- Only enabled options will be available for selection during enrollment

**Examples:**

**Upfront Payment:**
```json
{
  "enabled": true,
  "type": "Upfront",
  "paymentDate": "2025-09-01T00:00:00Z"  // ISO datetime string (optional)
}
```

**Weekly Payment:**
```json
{
  "enabled": true,
  "type": "Weekly",
  "frequency": "1 week",  // e.g., "1 week", "2 weeks", "1 month"
  "startDate": "2025-09-01T00:00:00Z"  // ISO datetime string (optional)
}
```

**Monthly Payment:**
```json
{
  "enabled": true,
  "type": "Monthly",
  "frequency": "1 month",
  "startDate": "2025-09-01T00:00:00Z"
}
```

**Every Two Weeks:**
```json
{
  "enabled": true,
  "type": "Every two weeks",
  "frequency": "2 weeks",
  "startDate": "2025-09-01T00:00:00Z"
}
```

**Custom Payment Option:**
```json
{
  "enabled": true,
  "type": "Custom",
  "customName": "Bi-weekly",
  "customDescription": "Pay every two weeks on Friday",
  "customFrequency": "2 weeks",
  "customStartDate": "2025-09-05T00:00:00Z"
}
```

**Note:** Date fields (`paymentDate`, `startDate`, `customStartDate`) accept ISO datetime strings but are validated as strings. The backend will accept any string format, but it's recommended to use ISO 8601 format (e.g., `2025-09-01T00:00:00Z`).

## Notes

1. All date fields should be in ISO 8601 format (e.g., `2025-10-13T00:00:00Z`)
2. Time fields should be in 24-hour format (e.g., `13:00` for 1:00 PM)
3. All IDs are integers except for user IDs which are strings (CUIDs)
4. When creating enrollments, trials, or waitlist entries, ensure the student exists and is linked to the user
5. The `termId` is optional for classes, lessons, enrollments, trials, and waitlist entries
6. When `limitCapacity` is `true` for a class, the `capacity` field must be provided

## Complete Workflow Example

1. **Create a Term/Season**
   ```typescript
   const term = await createTerm({
     title: "Fall 2025",
     startDate: "2025-09-01T00:00:00Z",
     endDate: "2025-12-31T23:59:59Z",
     registrationFee: true,
     pricingType: "By Lesson",
     billingOptions: [
       {
         enabled: true,
         type: "Upfront",
         paymentDate: "2025-09-01T00:00:00Z"
       },
       {
         enabled: true,
         type: "Weekly",
         frequency: "1 week",
         startDate: "2025-09-01T00:00:00Z"
       }
     ]
   })
   ```

2. **Create a Class within the Term**
   ```typescript
   const classItem = await createClass({
     title: "Class 01",
     startDate: "2025-09-02T00:00:00Z",
     endDate: "2025-12-31T23:59:59Z",
     frequency: "WEEKLY",
     recurringDay: "Monday",
     startTimeOfClass: "13:00",
     endTimeOfClass: "13:30",
     duration: 30,
     pricingPerLesson: 25.00,
     termId: term.data.id
   })
   ```

3. **Add Lessons to the Class**
   ```typescript
   const lesson = await addLesson({
     classId: classItem.data.id,
     title: "Lesson 1",
     date: "2025-10-13T00:00:00Z",
     startTime: "13:00",
     endTime: "13:30",
     duration: 30
   })
   ```

4. **Create Enrollment**
   ```typescript
   const enrollment = await createEnrollment({
     classId: classItem.data.id,
     termId: term.data.id,
     studentId: studentId,
     enrollmentStartDate: "2025-10-01T00:00:00Z",
     enrollmentEndDate: "2025-12-31T23:59:59Z",
     paymentOption: "Weekly"
   })
   ```

5. **Add Trial**
   ```typescript
   const trial = await addTrial({
     classId: classItem.data.id,
     termId: term.data.id,
     studentId: studentId,
     lessonId: lesson.data.id,
     date: "2025-10-13T00:00:00Z",
     status: "pending"
   })
   ```

6. **Add to Waitlist**
   ```typescript
   const waitlistEntry = await addToWaitlist({
     termId: term.data.id,
     studentId: studentId,
     classId: classItem.data.id
   })
   ```

