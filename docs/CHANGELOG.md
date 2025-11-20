# Changelog

## [2025-11-20] - Commission Management System & Business API Updates

### 🎯 Major Features Added

#### 1. **Global Commission Management System**
   - **New Feature**: Admin can now set global commissions that apply to all organizations
   - **New Feature**: Admin can set organization-specific commissions that override global commissions
   - **Priority System**: Organization-specific commissions take precedence over global commissions
   - **New Endpoints**: 
     - `POST /commissions/global` - Create global commission
     - `POST /commissions/organization` - Create organization-specific commission
     - `GET /commissions` - Get all commissions (with filters)
     - `GET /commissions/{id}` - Get commission by ID
     - `PATCH /commissions/{id}` - Update commission
     - `DELETE /commissions/{id}` - Delete commission

#### 2. **Database Schema Changes**
   - **Breaking Change**: `Commission.businessId` is now nullable (`Int?`)
   - **Purpose**: `null` businessId represents global commissions for all organizations
   - **Migration Required**: Run `bun run db:migrate` to apply schema changes

### 📝 Business API Updates

#### 1. **Business Creation - Commission Fields Made Optional**
   - **Changed**: `commissionType` and `commissionValue` are now optional in `POST /business`
   - **Behavior**: 
     - If commission fields are provided → Creates organization-specific commission
     - If commission fields are `null` or missing → Business uses global commission
   - **Request Example**:
     ```json
     {
       "schoolName": "My School",
       "email": "school@example.com",
       "phone": "1234567890",
       "commissionType": "PERCENTAGE",
       "commissionValue": null  // Will use global commission
     }
     ```

#### 2. **Business Detail Response - Enhanced Information**
   - **Added**: `userId` field in business detail response
     - Purpose: Use this as `organizationId` when creating families
   - **Added**: `isGlobal` flag in commission object
     - Indicates if business is using global commission or organization-specific
   - **Updated**: Commission response structure:
     ```json
     {
       "commission": {
         "commissionType": "PERCENTAGE",
         "commissionValue": 100,
         "isGlobal": true  // NEW: true if using global, false if organization-specific
       }
     }
     ```

#### 3. **Business List Response - Additional Fields**
   - **Added**: `location` field (city, state)
   - **Added**: `ownership` field (owner name)
   - **Added**: `registered` field (registration date)

### 🔧 Service Layer Changes

#### 1. **Commission Service** (`src/services/commission.service.ts`)
   - **New Functions**:
     - `createGlobalCommission()` - Creates global commission
     - `createOrganizationCommission()` - Creates organization-specific commission
     - `getAllCommissions()` - Get all commissions with pagination and filters
     - `getCommissionById()` - Get commission by ID
     - `updateCommission()` - Update commission by ID
     - `deleteCommission()` - Delete commission by ID
     - `getCommissionByBusinessId()` - Get active commission for a business (with fallback to global)
     - `getActiveGlobalCommission()` - Get active global commission

#### 2. **Business Service** (`src/services/business.service.ts`)
   - **Updated**: `getBusinessById()` now checks for global commission if no organization-specific commission exists
   - **Updated**: `createBusiness()` - Commission creation is now conditional
     - Only creates commission if `commissionType` and `commissionValue` are provided
   - **Updated**: `updateBusinessCommission()` - Uses relation syntax for Prisma
   - **Added**: `userId` field in `BusinessDetailResult` interface
   - **Added**: `isGlobal` flag in commission response

#### 3. **Students Service** (`src/services/students.service.ts`)
   - **Added**: `createStudent()` function
   - **Added**: `CreateStudentData` interface
   - **Note**: Students can now be created directly via students service

### 🛣️ Route Changes

#### 1. **Business Routes** (`src/routes/business/business.routes.ts`)
   - **Updated**: `CreateBusinessBodySchema`
     - `commissionType`: Now optional
     - `commissionValue`: Now nullable
   - **Updated**: `UpdateCommissionBodySchema`
     - `commissionType`: Now optional
     - `commissionValue`: Now nullable
   - **Updated**: `BusinessDetailSchema`
     - Added `userId` field
     - Added `isGlobal` to commission object

#### 2. **New Commission Routes** (`src/routes/commissions/`)
   - **New Files**:
     - `commissions.routes.ts` - Route definitions
     - `commissions.handler.ts` - Request handlers
     - `index.ts` - Router export
   - **Registered**: Added to `src/app.ts` as `/commissions`

### 🔐 Security & Authorization

#### Admin-Only Endpoints
All commission management endpoints require `ADMIN` role:
- `POST /commissions/global`
- `POST /commissions/organization`
- `GET /commissions`
- `GET /commissions/{id}`
- `PATCH /commissions/{id}`
- `DELETE /commissions/{id}`

**Authorization Check**: All handlers verify `user.role === 'ADMIN'`

### 🐛 Bug Fixes

#### 1. **Prisma Relation Syntax**
   - **Fixed**: Changed from `businessId: business.id` to `business: { connect: { id: business.id } }`
   - **Reason**: Prisma client requires relation syntax when using nullable foreign keys
   - **Files Affected**:
     - `src/services/business.service.ts` (createBusiness, updateBusinessCommission)
     - `src/services/commission.service.ts` (all commission creation functions)

#### 2. **Null Query Handling**
   - **Fixed**: Updated Prisma queries for nullable `businessId` fields
   - **Solution**: Used `null as any` type assertion for Prisma null queries
   - **Files Affected**:
     - `src/services/business.service.ts`
     - `src/services/commission.service.ts`

#### 3. **Type Safety**
   - **Fixed**: Commission value nullable handling
   - **Fixed**: Return type mismatches in business service

### 📊 Data Flow Changes

#### Commission Resolution Logic
```
1. Check for organization-specific commission (businessId = specific business)
   ↓ (if found)
   Use organization-specific commission
   
   ↓ (if not found)
   
2. Check for global commission (businessId = null)
   ↓ (if found)
   Use global commission
   
   ↓ (if not found)
   
3. No commission (returns null)
```

### 🔄 Migration Steps

#### Required Actions:
1. **Database Migration**:
   ```bash
   cd class-gecko-backend
   bun run db:migrate
   ```
   This will make `Commission.businessId` nullable.

2. **Regenerate Prisma Client**:
   ```bash
   bun run db:generate
   ```
   This updates TypeScript types to match the new schema.

### 📋 API Request/Response Examples

#### Create Business Without Commission (Uses Global)
```json
POST /business
{
  "schoolName": "My School",
  "email": "school@example.com",
  "phone": "1234567890",
  "ownerName": "John Doe",
  "ownerEmail": "john@example.com",
  "ownerPhone": "1234567890",
  "commissionType": "PERCENTAGE",
  "commissionValue": null
}

Response:
{
  "commission": null  // Will use global commission
}
```

#### Create Global Commission
```json
POST /commissions/global
{
  "commissionType": "PERCENTAGE",
  "commissionValue": 20,
  "country": "US",
  "currency": "USD"
}

Response:
{
  "id": 25,
  "businessId": null,
  "businessName": "Global (All Organizations)",
  "commissionValue": 20,
  ...
}
```

#### Create Organization-Specific Commission
```json
POST /commissions/organization
{
  "businessId": 3,
  "commissionType": "PERCENTAGE",
  "commissionValue": 10,
  "country": "US",
  "currency": "USD"
}

Response:
{
  "id": 26,
  "businessId": 3,
  "businessName": "Bright Minds Academy",
  "commissionValue": 10,
  ...
}
```

### 🎨 Response Format Changes

#### Business Detail Response (Updated)
```json
{
  "id": 3,
  "schoolName": "allied school",
  "email": "abcd@gmail.com",
  "phone": "2399999999",
  "address": "lahore",
  "status": "Active",
  "registered": "2025-11-18T13:12:19.333Z",
  "userId": "sI73FEF3R1Wdldfd8X7iFptb5ce02HTB",  // NEW
  "owner": {
    "name": "allied school",
    "email": "abcd@gmail.com",
    "phone": "2399999999",
    "address": null
  },
  "statistics": {
    "totalStudents": 0,
    "activeClasses": 0,
    "totalRevenue": 0,
    "earnedCommission": 0
  },
  "commission": {
    "commissionType": "PERCENTAGE",
    "commissionValue": 100,
    "isGlobal": true  // NEW
  }
}
```

### ⚠️ Breaking Changes

1. **Commission Schema**: `businessId` is now nullable
   - **Impact**: Existing code using `businessId` directly may need updates
   - **Migration**: Required before using new commission features

2. **Business Creation**: Commission fields are now optional
   - **Impact**: Existing clients sending commission data will continue to work
   - **New Behavior**: If commission is `null`, business uses global commission

### 📝 Notes

1. **Global Commission Priority**: When a global commission is set (e.g., 100%), it automatically applies to ALL businesses that don't have their own specific commission.

2. **Country/Currency Matching**: Currently hardcoded to `'US'` and `'USD'` in business service. Consider making this dynamic based on business location.

3. **Commission Deactivation**: When creating a new commission (global or organization-specific), existing active commissions for the same country/currency are automatically deactivated.

4. **Student Count**: The student count in business statistics works correctly - it counts all students in families where `family.organizationId` matches `business.userId`.

### 🔗 Related Files

- `prisma/schema.prisma` - Schema changes for nullable businessId
- `src/services/commission.service.ts` - New commission service
- `src/services/business.service.ts` - Updated business service
- `src/routes/commissions/` - New commission routes
- `src/routes/business/business.routes.ts` - Updated business routes
- `src/routes/business/business.handler.ts` - Updated handlers
- `src/app.ts` - Registered new commission routes

### 🚀 Next Steps

1. Run database migration: `bun run db:migrate`
2. Regenerate Prisma client: `bun run db:generate`
3. Test global commission creation
4. Test organization-specific commission creation
5. Verify business creation with null commission values
6. Test commission fallback logic (organization → global)

---

**Date**: November 20, 2025  
**Version**: 1.1.0  
**Author**: Development Team

