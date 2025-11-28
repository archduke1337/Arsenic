# 🎯 Features Guide - Coupons, Alumni, Attendance, Leaderboard & Speaker Panel

## 📍 COUPONS - How to Add Coupons

### Current Status: ⚠️ Schema Ready, Admin Page Missing

### What are Coupons?
Discount codes for event registration to:
- Offer early bird discounts
- Group registration deals
- Special promotions (sponsorships, partnerships)
- Student discounts

### Schema Location
```
lib/schema.ts → couponSchema (lines 51-65)
```

### Schema Definition
```typescript
export const couponSchema = z.object({
    code: z.string().min(1),              // "ARSENIC50", "EARLYBIRDX"
    eventId: z.string(),                   // Which event
    discountType: z.enum(['percentage', 'fixed']), // % or ₹
    discountValue: z.number().positive(),  // 50 for 50% or 500 for ₹500
    maxUses: z.number().optional(),        // Limit uses
    currentUses: z.number().default(0),    // Times used
    expiryDate: z.string().optional(),     // ISO date
    isActive: z.boolean().default(true),   // Enable/disable
    createdBy: z.string(),                 // Admin who created
    createdAt: z.string(),                 // ISO timestamp
});
```

### Database Collection
```
COLLECTIONS.COUPONS = "coupons"
```

### API Endpoint for Validation
```
POST /api/validate-coupon
```

**Location**: `app/api/validate-coupon/route.ts`

**Request Body**:
```json
{
    "code": "ARSENIC50",
    "eventId": "event123"
}
```

**Response**:
```json
{
    "valid": true,
    "discountType": "percentage",
    "discountValue": 50,
    "message": "Coupon applied successfully"
}
```

### Where to Add/Manage Coupons
**CREATE admin page at**: `app/admin/coupons/page.tsx`

**Required Features**:
- ✅ List all coupons with filters (active/expired/used)
- ✅ Create new coupon (code, discount, expiry)
- ✅ Edit coupon details
- ✅ Disable/enable coupons
- ✅ View usage statistics
- ✅ Delete expired coupons

**Implementation Steps**:
1. Create directory: `app/admin/coupons/`
2. Create file: `app/admin/coupons/page.tsx`
3. Import couponSchema from `lib/schema.ts`
4. Follow pattern from `app/admin/events/page.tsx` for CRUD operations
5. Use Query API: `Query.orderDesc("$createdAt")`, `Query.equal("isActive", true)`

---

## 👥 ALUMNI - How to Add Alumni Network

### Current Status: ✅ Page Exists, Backend Missing

### What is Alumni?
- Past participants/delegates network
- Track achievements and career progression
- Networking opportunities
- Mentorship program

### Current Page
```
Location: app/alumni/page.tsx
Status: Displays mock data (hardcoded alumni list)
```

### Schema Location
```
lib/schema.ts → alumniSchema (lines 58-72)
```

### Schema Definition
```typescript
export const alumniSchema = z.object({
    userId: z.string(),                    // Link to user
    name: z.string(),
    email: z.string().email(),
    institution: z.string().optional(),    // School/College
    graduationYear: z.string().optional(), // Year they graduated/participated
    eventsAttended: z.array(z.string()).default([]),  // Event IDs
    achievements: z.array(z.string()).optional(),     // Awards won
    bio: z.string().optional(),            // Professional bio
    profileImageUrl: z.string().optional(),
    linkedinUrl: z.string().optional(),
    isActive: z.boolean().default(true),   // Profile active?
    joinedAt: z.string(),                  // When joined alumni network
});
```

### Database Collection
```
COLLECTIONS.ALUMNI = "alumni"
```

### How to Update Alumni Page

**File**: `app/alumni/page.tsx`

**Changes Needed**:
1. Replace hardcoded alumni data with Appwrite query
2. Implement search and filter
3. Add admin form to add alumni

**Current Code (Lines 1-45)**:
```tsx
const alumni = [
    {
        name: "Sarah Chen",
        batch: "2022",
        role: "Secretary General",
        achievement: "Currently at Harvard University",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        badges: ["Distinguished Alumnus", "Best Delegate '21"]
    },
    // ... more hardcoded data
];
```

**Update to**:
```tsx
"use client";

import { useState, useEffect } from "react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "appwrite";

export default function Alumni() {
    const [alumni, setAlumni] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
        try {
            const response = await databases.listDocuments(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
                COLLECTIONS.ALUMNI,
                [Query.equal("isActive", true), Query.orderDesc("joinedAt"), Query.limit(100)]
            );
            setAlumni(response.documents);
        } catch (error) {
            console.error("Error fetching alumni:", error);
        } finally {
            setLoading(false);
        }
    };

    // ... rest of the page
}
```

### Where to Manage Alumni
**CREATE admin page at**: `app/admin/alumni/page.tsx`

**Required Features**:
- ✅ View all alumni
- ✅ Add alumni (manual entry or from past registrations)
- ✅ Edit alumni info (bio, achievements, social links)
- ✅ Approve/activate alumni profiles
- ✅ Manage achievements and badges
- ✅ View achievements timeline

---

## ✅ ATTENDANCE - Where is Attendance?

### Current Status: ⚠️ Schema Ready, Integration Incomplete

### What is Attendance?
- Check-in tracking system
- Mark present/absent/late/excused
- Time-stamped entry logs
- Real-time attendance reports

### Schema Location
```
lib/schema.ts → attendanceSchema (lines 26-38)
```

### Schema Definition
```typescript
export const attendanceSchema = z.object({
    registrationId: z.string(),              // Which participant
    eventId: z.string(),                     // Which event
    committeeId: z.string().optional(),      // Which committee
    checkedInAt: z.string(),                 // ISO timestamp
    checkedInBy: z.string().optional(),      // Admin who checked in
    checkOutTime: z.string().optional(),     // When left
    attendanceStatus: z.enum(['present', 'absent', 'late', 'excused']).default('present'),
});
```

### Database Collection
```
COLLECTIONS.ATTENDANCE = "attendance"
```

### Current Integration Locations

#### 1. **Check-In Page** (Real-time QR scanning)
```
Location: app/admin/check-in/page.tsx
Features:
  ✅ QR code scanner
  ✅ Mark check-in with QR
  ✅ Recent check-ins list
  ✅ Search by name
```

**How it works**:
1. Generates QR code with `registrationId`
2. Scans QR at event
3. Creates ATTENDANCE record with timestamp
4. Updates REGISTRATIONS.checkedIn = true

#### 2. **Attendance Report** (Admin view)
```
WHERE TO ADD: app/admin/attendance/page.tsx
```

**Features to Implement**:
- ✅ List all check-ins for event
- ✅ Filter by committee
- ✅ Filter by status (present/absent/late)
- ✅ Export attendance CSV
- ✅ Mark manual attendance (for walk-ins)
- ✅ View attendance trends

#### 3. **Real-time Attendance Integration**

**In Registration Model** (`lib/schema.ts`):
```typescript
checkedIn: z.boolean().default(false),           // Quick flag
checkedInAt: z.string().optional(),              // When checked in
```

**In Attendance Model**:
```typescript
Full attendance history with status and metadata
```

### How Attendance Works

**Check-in Flow**:
```
1. Participant arrives
   ↓
2. Admin scans QR code (contains registrationId)
   ↓
3. System creates ATTENDANCE record:
   {
       registrationId: "user123",
       eventId: "event456",
       committeeId: "committee789",
       checkedInAt: "2024-11-28T10:30:00Z",
       checkedInBy: "admin@arsenic.com",
       attendanceStatus: "present"
   }
   ↓
4. Updates REGISTRATIONS:
   {
       checkedIn: true,
       checkedInAt: "2024-11-28T10:30:00Z"
   }
   ↓
5. Admin sees real-time attendance dashboard
```

---

## 🏆 LEADERBOARD / SCOREBOARD - Where is it?

### Current Status: ⚠️ Service Ready, UI Pages Missing

### What is Leaderboard?
- Ranks participants by score
- Real-time scoring during committees
- Committee-wise rankings
- Historical scores

### Schema Location
```
lib/schema.ts → scoreSchema (lines 15-24)
```

### Schema Definition
```typescript
export const scoreSchema = z.object({
    registrationId: z.string(),              // Who scored
    eventId: z.string(),                     // In which event
    committeeId: z.string(),                 // In which committee
    score: z.number().min(0).max(100),       // Score 0-100
    feedback: z.string().optional(),         // Judge feedback
    rank: z.number().optional(),             // Overall rank
    createdAt: z.string(),                   // When scored
    updatedAt: z.string(),                   // Last updated
});
```

### Database Collection
```
COLLECTIONS.SCORES = "scores"
```

### Backend (Already Implemented)

**Service File**: `lib/scoring-service.ts`

**Available Functions**:
```typescript
// Submit new score
submitScore(registrationId, eventId, committeeId, score, feedback)

// Update existing score
updateScore(scoreId, score, feedback)

// Get leaderboard for event
getLeaderboard(eventId, committeeId?, limit=50)

// Get committee-wise rankings
getCommitteeRankings(eventId)

// Get participant ranking
getParticipantRanking(registrationId, eventId)

// Export scores to CSV
exportScoresToCSV(eventId)

// Get score statistics
getScoreStats(eventId)
```

### API Endpoints

#### 1. **Get Leaderboard**
```
GET /api/scoring/leaderboard?eventId=EVENT_ID&committeeId=COMMITTEE_ID
```

**Response**:
```json
[
    {
        "rank": 1,
        "participantName": "Sarah Chen",
        "committee": "UNSC",
        "score": 95.5,
        "totalVotes": 12,
        "trend": "up"
    },
    {
        "rank": 2,
        "participantName": "Rahul Verma",
        "committee": "UNSC",
        "score": 92.0,
        "totalVotes": 12,
        "trend": "down"
    }
]
```

#### 2. **Submit Score**
```
POST /api/scoring/submit
```

**Request Body**:
```json
{
    "registrationId": "reg123",
    "eventId": "event456",
    "committeeId": "committee789",
    "score": 85,
    "feedback": "Great research, needs better rebuttal"
}
```

### Frontend Pages to Create

#### 1. **Results Page** (Public Leaderboard)
```
Location: app/results/page.tsx
Status: Exists, needs leaderboard display
```

**Features to Add**:
- ✅ Event selection dropdown
- ✅ Leaderboard table with rankings
- ✅ Committee filter
- ✅ Social share buttons (already in `components/results/SocialShareButtons.tsx`)
- ✅ Winner announcement
- ✅ Certificate download

#### 2. **Results Details Page**
```
Location: app/results/[id]/page.tsx
Params: [id] = eventId
```

**Features**:
- ✅ Event-specific leaderboard
- ✅ Committee-wise breakdowns
- ✅ Detailed score breakdown per participant
- ✅ Award winner highlights

#### 3. **Chair Scoring Page** (Existing)
```
Location: app/chair/scoring/page.tsx
Status: ✅ Scoring sheet implemented
Features:
  ✅ Score participants by criteria
  ✅ Scoring rubric (Research, Oratory, Conduct, Rebuttal)
  ✅ Remarks field
  ✅ Multi-session support
```

#### 4. **Admin Scoring Dashboard** (NEW)
```
Create: app/admin/scores/page.tsx
```

**Features**:
- ✅ View all scores
- ✅ Filter by event/committee
- ✅ Export leaderboard CSV
- ✅ View score statistics
- ✅ Manage score disputes
- ✅ Update/correct scores

### How Scoring Works

**Scoring Flow**:
```
1. Event starts, committees formed
   ↓
2. Judges/Chairpersons get score sheets
   ↓
3. Judges score participants on criteria:
   - Research & Content (0-10)
   - Oratory & Delivery (0-10)
   - Conduct & Courtesy (0-10)
   - Rebuttal & Answers (0-10)
   Total: 0-40 (scaled to 0-100)
   ↓
4. Scores submitted via /api/scoring/submit
   ↓
5. System calculates:
   - Average score per participant
   - Ranking by score
   - Committee rankings
   ↓
6. Results display on /results page
```

---

## 🎤 SPEAKER PANEL - What is it?

### Current Status: ⚠️ Page exists, Placeholder implementation

### What is Speaker Panel?
- Control room for committee session management
- Real-time speaker list and POI management
- Session timer and gavel control
- Speaker updates (POI, motion, etc.)

### Current Page
```
Location: app/speaker-panel/page.tsx
Status: Placeholder - "Coming soon" message
```

### Schema Location
```
lib/schema.ts → speakerUpdateSchema (lines 299-305)
```

### Schema Definition
```typescript
export const speakerUpdateSchema = z.object({
    committeeId: z.string(),              // Which committee
    speakerId: z.string(),                // Speaker registration ID
    type: z.enum(['crisis', 'gavel', 'mention', 'announcement']),
    content: z.string(),                  // Message/update
    timestamp: z.string(),                // ISO timestamp
});
```

### Database Collection
```
COLLECTIONS.SPEAKER_UPDATES = "speaker_updates"
```

### How Speaker Panel Works

**Speaker Management Flow**:
```
1. Committee session starts
   ↓
2. Chairperson opens Speaker Panel
   ↓
3. Delegates request to speak (POI, motion, etc.)
   ↓
4. Chairperson manages:
   - Speaker queue (FIFO or priority)
   - Time per speaker (timer)
   - Gavel (end session)
   - Crisis (emergency motion)
   ↓
5. Updates logged in SPEAKER_UPDATES
   ↓
6. Delegates see real-time updates
```

### How Speaker is "Elected"

**Speaker Selection Process**:
1. **Delegate Registration** → Joins committee
2. **Committee Assignment** → Admin assigns delegates to committees
3. **Performance Scoring** → Judges score during session
4. **Leaderboard Ranking** → Highest score = "Best Speaker"
5. **Award Distribution** → Best Delegate certificate/award

**Speaker Panel Role** ≠ Speaker Selection
- Speaker Panel = Session Management Tool (run by Chairperson)
- Speaker Selection = Award based on performance (by Judges)

### Features to Implement in Speaker Panel

**Required**:
- ✅ Real-time speaker queue
- ✅ Session timer
- ✅ POI (Point of Information) management
- ✅ Motion tracking (adjournment, postponement, etc.)
- ✅ Crisis/emergency handling
- ✅ Live announcement capability
- ✅ Attendance tracking
- ✅ Session notes/minutes

### Pages That Use Speaker Information

#### 1. **Speaker Panel** (Chairperson view)
```
/speaker-panel
Controls the session, manages speaker queue
```

#### 2. **Speaker Updates** (Delegate view)
```
Real-time notifications on dashboard
When: New speaker added, POI raised, motion passed
```

#### 3. **Speaker Rankings** (Results)
```
/results
Shows best speakers by score
```

#### 4. **Chair Resources**
```
/chair/resources
Reference materials for chairing
```

---

## 🛠️ Implementation Checklist

### COUPONS ✔️
- [ ] Create `app/admin/coupons/page.tsx`
- [ ] Implement CRUD operations
- [ ] Add coupon validation to payment API
- [ ] Add coupon selector to registration form
- [ ] Test coupon discount application

### ALUMNI ✔️
- [ ] Update `app/alumni/page.tsx` with real data
- [ ] Create `app/admin/alumni/page.tsx`
- [ ] Implement manual alumni entry
- [ ] Auto-populate from past registrations
- [ ] Add achievements/badges system

### ATTENDANCE ✔️
- [ ] Create `app/admin/attendance/page.tsx` (reports)
- [ ] QR code generation in registration
- [ ] Manual check-in override in admin
- [ ] Attendance export/CSV
- [ ] View attendance analytics

### LEADERBOARD ✔️
- [ ] Update `app/results/page.tsx` with leaderboard
- [ ] Create `app/admin/scores/page.tsx`
- [ ] Implement score export
- [ ] Award certificate generation
- [ ] Leaderboard filtering

### SPEAKER PANEL ✔️
- [ ] Complete `app/speaker-panel/page.tsx` implementation
- [ ] Add speaker queue management
- [ ] Implement session timer
- [ ] POI/motion tracking
- [ ] Real-time delegate notifications

---

## 📊 Data Flow Diagram

```
REGISTRATION
    ├─ Create: app/register/page.tsx
    ├─ Validate: /api/registrations
    ├─ Use Coupon: /api/validate-coupon
    └─ Check-in: app/admin/check-in
         └─ Create ATTENDANCE record

SCORING
    ├─ Chair Scores: app/chair/scoring
    ├─ Save: /api/scoring/submit
    ├─ Store in: SCORES collection
    └─ Display: app/results

LEADERBOARD
    ├─ Query: /api/scoring/leaderboard
    ├─ Display: app/results
    └─ Awards: Highest score = Award

ALUMNI
    ├─ Past Participants → ALUMNI
    ├─ Manage: app/admin/alumni
    └─ Display: app/alumni

SPEAKER PANEL
    ├─ Chairperson Control: app/speaker-panel
    ├─ Delegate View: Real-time updates
    └─ Log: SPEAKER_UPDATES collection
```

---

## 🔗 Quick Links

| Feature | Admin Page | User Page | API Route |
|---------|-----------|-----------|-----------|
| **Coupons** | `/admin/coupons` (CREATE) | N/A | `/api/validate-coupon` |
| **Alumni** | `/admin/alumni` (CREATE) | `/alumni` | `/api/alumni` (CREATE) |
| **Attendance** | `/admin/attendance` (CREATE) | `/dashboard` | `/api/attendance` (CREATE) |
| **Leaderboard** | `/admin/scores` (CREATE) | `/results` | `/api/scoring/leaderboard` |
| **Speaker Panel** | N/A | `/speaker-panel` | `/api/speaker-updates` (CREATE) |

---

## ✅ Status Summary

| Feature | Status | Priority | Work Needed |
|---------|--------|----------|------------|
| Coupons | 🟡 Schema Ready | High | Admin page + integration |
| Alumni | 🟡 Partial | Medium | Backend integration + admin page |
| Attendance | 🟡 Partial | High | Admin page + reporting |
| Leaderboard | 🟡 Service Ready | High | UI pages + results display |
| Speaker Panel | 🟡 Placeholder | Medium | Full implementation |

