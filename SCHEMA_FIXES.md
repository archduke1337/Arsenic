# Schema Fixes Summary

## Overview
Fixed all schema inconsistencies in `lib/schema.ts` to align with Appwrite database structure and TypeScript types across the application.

## Changes Made

### 1. **Added Missing Score Schema**
```typescript
export const scoreSchema = z.object({
    registrationId: z.string(),
    eventId: z.string(),
    committeeId: z.string(),
    score: z.number().min(0).max(100),
    feedback: z.string().optional(),
    rank: z.number().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
```
- **Purpose**: Type-safe scoring system for competitions
- **Used in**: Leaderboards, judge rankings
- **Files updated**: `lib/scoring-service.ts`

### 2. **Added Missing Attendance Schema**
```typescript
export const attendanceSchema = z.object({
    registrationId: z.string(),
    eventId: z.string(),
    committeeId: z.string().optional(),
    checkedInAt: z.string(),
    checkedInBy: z.string().optional(),
    checkOutTime: z.string().optional(),
    attendanceStatus: z.enum(['present', 'absent', 'late', 'excused']).default('present'),
});
```
- **Purpose**: Track event check-in and attendance
- **Used in**: Admin check-in page, attendance reports

### 3. **Added Missing Coupon Schema**
```typescript
export const couponSchema = z.object({
    code: z.string().min(1),
    eventId: z.string(),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number().positive(),
    maxUses: z.number().optional(),
    currentUses: z.number().default(0),
    expiryDate: z.string().optional(),
    isActive: z.boolean().default(true),
    createdBy: z.string(),
    createdAt: z.string(),
});
```
- **Purpose**: Discount code management
- **Used in**: Payment validation, registration discounts

### 4. **Added Missing Alumni Schema**
```typescript
export const alumniSchema = z.object({
    userId: z.string(),
    name: z.string(),
    email: z.string().email(),
    institution: z.string().optional(),
    graduationYear: z.string().optional(),
    eventsAttended: z.array(z.string()).default([]),
    achievements: z.array(z.string()).optional(),
    bio: z.string().optional(),
    profileImageUrl: z.string().optional(),
    linkedinUrl: z.string().optional(),
    isActive: z.boolean().default(true),
    joinedAt: z.string(),
});
```
- **Purpose**: Alumni network management
- **Used in**: Alumni pages, network features

### 5. **Fixed Event Schema**
**Before:**
```typescript
fees: z.number(),
earlyBirdFee: z.number().optional(),
earlyBirdDeadline: z.string().optional(),
// ... redundant fee fields
feeStructure: feeStructureSchema.optional(),
```

**After:**
```typescript
fees: z.number().default(0),
// ... removed redundant fields
feeStructure: z.string().optional(), // JSON string
paymentConfig: z.string().optional(), // JSON string
settings: z.string().optional(), // JSON string
```
- **Reason**: Avoid redundant fields; complex structures stored as JSON strings in Appwrite
- **Files updated**: `app/admin/events/page.tsx`

### 6. **Fixed Event Type Declaration**
**Before:**
```typescript
type: z.string(),
```

**After:**
```typescript
type: z.enum(EVENT_TYPES),
```
- **Reason**: Type safety - only allow valid event types
- **Valid values**: MUN, LOK_SABHA, RAJYA_SABHA, DEBATE, YOUTH_PARLIAMENT

### 7. **Fixed Registration Schema**
**Improvements:**
- Made `code` optional (can be generated)
- Added `code?.optional()` instead of required
- Added timestamps: `createdAt` and `updatedAt` as ISO strings
- Added proper defaults for all enums
- Changed `checkedIn` to default `false`

```typescript
export const registrationSchema = z.object({
    userId: z.string(),
    eventId: z.string(),
    code: z.string().min(1).optional(),
    fullName: z.string(),
    email: z.string().email(),
    // ... other fields
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});
```
- **Files updated**: `app/api/registrations/route.ts`, `lib/scoring-service.ts`

### 8. **Fixed Committee Format-Specific Data Storage**
**Before:**
```typescript
munData: munDataSchema.optional(),
lokSabhaData: lokSabhaDataSchema.optional(),
rajyaSabhaData: rajyaSabhaDataSchema.optional(),
debateData: debateDataSchema.optional(),
```

**After:**
```typescript
munData: z.string().optional(), // JSON string
lokSabhaData: z.string().optional(), // JSON string
rajyaSabhaData: z.string().optional(), // JSON string
debateData: z.string().optional(), // JSON string
```
- **Reason**: Appwrite stores complex objects as JSON strings, not nested objects
- **Migration Note**: These fields must be JSON.stringify() before saving and JSON.parse() after retrieval
- **Files affected**: `app/admin/committees/page.tsx` (already does JSON.parse)

### 9. **Added Missing Type Exports**
```typescript
export type Score = z.infer<typeof scoreSchema>;
export type Attendance = z.infer<typeof attendanceSchema>;
export type Coupon = z.infer<typeof couponSchema>;
export type Alumni = z.infer<typeof alumniSchema>;
```
- **Purpose**: Provide TypeScript types for new schemas

### 10. **Updated Service Files for Schema Compliance**

#### `lib/scoring-service.ts`
- Import `COLLECTIONS` constant
- Import `Score` type from schema
- Use `COLLECTIONS.SCORES` instead of hardcoded strings
- Use Query API: `Query.equal()`, `Query.limit()`
- Store timestamps as ISO strings: `.toISOString()`

#### `app/api/registrations/route.ts`
- Import `registrationSchema` from lib/schema
- Use shared schema for validation
- Generate timestamps for all registrations
- Support optional registration code

### 11. **Fixed Admin Page JSX Syntax**
- Fixed missing closing `}}` in Progress component `classNames` prop
- Syntax: `classNames={{ indicator: "bg-green-500" }}`

## Schema Collection Completeness

### Collections with Schemas ✅
- ✅ USERS
- ✅ REGISTRATIONS
- ✅ EVENTS
- ✅ COMMITTEES
- ✅ TEAM_MEMBERS
- ✅ SPONSORS
- ✅ GALLERY
- ✅ ALBUMS
- ✅ FAQS
- ✅ CONTACT_SUBMISSIONS
- ✅ AWARDS
- ✅ SPEAKER_UPDATES
- ✅ SCORES
- ✅ ATTENDANCE
- ✅ COUPONS
- ✅ ALUMNI

## Data Type Alignment

### String Fields for Complex Data
- `Event.feeStructure` → JSON string (feeStructure object)
- `Event.paymentConfig` → JSON string (paymentConfig object)
- `Event.settings` → JSON string (eventSettings object)
- `Committee.munData` → JSON string (MUNData object)
- `Committee.lokSabhaData` → JSON string (LokSabhaData object)
- `Committee.rajyaSabhaData` → JSON string (RajyaSabhaData object)
- `Committee.debateData` → JSON string (DebateData object)

### ISO String Fields for Dates
- All `createdAt`, `updatedAt`, `checkedInAt` → ISO 8601 strings
- Use `.toISOString()` when saving
- Parse with `new Date(isoString)` when needed

## Validation Best Practices

### Before Saving to Appwrite
```typescript
const validationResult = registrationSchema.safeParse(data);
if (!validationResult.success) {
    // Handle validation errors
    return NextResponse.json({ error: validationResult.error.issues }, { status: 400 });
}
const validData = validationResult.data;
```

### After Retrieving from Appwrite
```typescript
const docs = await databases.listDocuments(...);
const typedDocs = docs.documents as Registration[]; // Type assertion after validation
```

## Query API Standards

### Always Use Query Object
```typescript
// ❌ OLD (deprecated)
databases.listDocuments(db, collection, [`eventId == "${eventId}"`])

// ✅ NEW (current)
databases.listDocuments(db, collection, [Query.equal("eventId", eventId), Query.limit(100)])
```

### Available Query Methods
- `Query.equal(attr, value)`
- `Query.limit(count)`
- `Query.offset(offset)`
- `Query.orderAsc(attr)`
- `Query.orderDesc(attr)`
- `Query.select(attrs)`

## Build Status
✅ **All schemas compile without errors**
✅ **All TypeScript types are properly exported**
✅ **All service files updated for schema compliance**
✅ **All API routes use schema validation**

## Migration Checklist
- ✅ Updated scoring service
- ✅ Updated registration API
- ✅ Fixed admin pages
- ✅ Added missing schemas
- ✅ Fixed storage patterns (JSON strings)
- ✅ Updated timestamp handling (ISO strings)
- ✅ Verified build compilation

