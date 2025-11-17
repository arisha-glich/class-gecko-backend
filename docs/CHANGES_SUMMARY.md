# Changes Summary - Billing Options & Schema Updates

## What Changed

### 1. **Billing Options Added to Terms API**
   - Added structured `billingOptions` field to Terms creation/update
   - Supports all UI billing options: Upfront, Monthly, Every two weeks, Weekly, and Custom
   - Each option has an `enabled` boolean to control checkbox state
   - Date fields are stored as strings (ISO format recommended)

### 2. **Schema Changes Made**
   The following fields were added to support the UI requirements:

   **Class Model:**
   - `recurringDay` (String?) - Day of week for recurring classes
   - `endTimeOfClass` (String?) - End time for the class
   - `limitCapacity` (Boolean) - Toggle for capacity limit (changed from Int?)
   - `capacity` (Int?) - Actual capacity number
   - `termId` (Int?) - Link to term/season
   - `createdAt`, `updatedAt` - Timestamps

   **Lesson Model:**
   - `endTime` (String?) - End time for the lesson
   - `createdAt`, `updatedAt` - Timestamps
   - `trials` relation - Link to trials

   **Terms Model:**
   - `pricingType` (String?) - By Lesson, By Month, etc.
   - `paymentOptions` (Json) - Already existed, now stores billing options
   - `seasonSpecificFees` (Json?) - Array of season-specific fees
   - `createdAt`, `updatedAt` - Timestamps
   - `classes` relation - Link to classes

   **ClassBooking Model:**
   - `studentId` (Int?) - Link to Student
   - `enrollmentStartDate` (DateTime?) - Start date for enrollment
   - `enrollmentEndDate` (DateTime?) - End date for enrollment
   - `paymentOption` (String?) - Selected payment option
   - `status` (String?) - Active, Cancelled, Completed, etc.
   - `createdAt`, `updatedAt` - Timestamps

   **Trial Model:**
   - `studentId` (Int?) - Link to Student
   - `lessonId` (Int?) - Link to specific lesson
   - `date` (DateTime?) - Trial date
   - `createdAt`, `updatedAt` - Timestamps

   **Waitlist Model:**
   - `studentId` (Int?) - Link to Student
   - `classId` (Int?) - Optional link to specific class
   - `createdAt`, `updatedAt` - Timestamps

   **Student Model:**
   - Added relations: `classBookings`, `trials`, `waitlists`

   **Camp Model (new CRUD support):**
   - Added relation to `User` (`userId`) so each camp is scoped to the logged-in organization
   - `title` (String) - Camp title from the UI
   - `startDate` / `endDate` (DateTime, endDate optional) - Matches the UI date pickers
   - Boolean toggles: `allowParentsToBookIndividualDays`, `allowParentsToBookHalfDaySession`, `offerEarlyDropoff`, `offerLatePickup`
   - Timestamps: `createdAt`, `updatedAt`

### 3. **API Fixes**
   - Fixed Zod schema validation error by removing `.datetime()` from optional fields in `BillingOptionSchema`
   - Changed `pricing` field from `z.record()` to `z.unknown()` for OpenAPI compatibility
   - Manually defined `UpdateTermBodySchema` instead of using `.partial()` to avoid nested schema issues

### 4. **Families & Students**
   - Added `/families` API to create family portal accounts (with password + invitation toggle)
   - Students model simplified to store direct profile data; no longer tied to `User`
   - Added `/students` endpoints for listing, updating, deleting students and filtering by family

### 5. **Drop-in Classes**
   - Added `DropInClass` schema linked to the org `user` (no term/session dependency)
   - CRUD endpoints under `/dropin-classes` with the same payload structure as standard classes

### 6. **Discount Schemes**
   - Added `DiscountCategory` enum and `DiscountTier` model to support tiered discounts (multiple student, class-by-student, class-by-family)
   - Implemented `/discounts` CRUD endpoints with tier management to match the Discount Schemes UI

## Migration Status

**✅ COMPLETED:** The database schema has been synced using `prisma db push`.

### What Was Done:

1. **Resolved migration conflict:**
   - Marked the problematic migration as applied
   - Added `ORGANIZATION_ADMIN` to the Role enum in the schema

2. **Synced database schema:**
   ```bash
   pnpm prisma db push
   ```
   This applied all the new fields to the database:
   - Class: `recurringDay`, `endTimeOfClass`, `limitCapacity`, `capacity`, `termId`, `createdAt`, `updatedAt`
   - Lesson: `endTime`, `createdAt`, `updatedAt`
   - Terms: `pricingType`, `seasonSpecificFees`, `createdAt`, `updatedAt`
   - ClassBooking: `studentId`, `enrollmentStartDate`, `enrollmentEndDate`, `paymentOption`, `status`, `createdAt`, `updatedAt`
   - Trial: `studentId`, `lessonId`, `date`, `createdAt`, `updatedAt`
   - Waitlist: `studentId`, `classId`, `createdAt`, `updatedAt`
   - Student: Relations to `classBookings`, `trials`, `waitlists`
   - Camp: Relation to `User`, `title`, optional `endDate`, boolean toggles, `createdAt`, `updatedAt`
   - User: `email` is now unique; relations added for managed families
   - Family: Now stores organization link, associated family account user, parent contact info, invitation fields
   - Student: Simplified to store child profile fields (first/last name, DOB, gender, medical/consent data) instead of linking to a `User`

3. **Generated Prisma Client:**
   - Prisma client and Zod schemas have been regenerated

### For Production:

**Note:** `prisma db push` is fine for development, but for production you should create a proper migration:

```bash
# Create a migration from the current state
pnpm prisma migrate dev --name add_billing_and_class_fields --create-only

# Review the migration file, then apply it
pnpm prisma migrate deploy
```

## Billing Options - Database Ready

**Status:** The billing options feature is ready to use:
- The `paymentOptions` field exists as `Json` type in the `Terms` model
- We store the structured billing options data in that JSON field
- The API transformation happens in the service layer (maps `billingOptions` ↔ `paymentOptions`)
- All schema changes have been applied to the database

## Testing

After resolving the migration issue, test the billing options:

```bash
# Create a term with billing options
curl -X POST http://localhost:8080/terms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Fall 2025",
    "startDate": "2025-09-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
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
      }
    ]
  }'
```

