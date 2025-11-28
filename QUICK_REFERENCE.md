# 🎯 Quick Reference - Feature Status & Locations

## 📍 Where Everything Is

### 1️⃣ COUPONS 🎟️
```
Status: ⚠️ Schema only (no admin UI)
├─ Schema: lib/schema.ts (lines 42-54)
├─ Type: export type Coupon
├─ Collection: COLLECTIONS.COUPONS
├─ API: /api/validate-coupon ✅ (exists)
└─ Admin: ❌ MISSING → Need to create app/admin/coupons/page.tsx
```

**How to Add Coupons**:
```typescript
// 1. Admin creates coupon
POST /api/coupons {
  code: "ARSENIC50",
  eventId: "event123",
  discountType: "percentage",
  discountValue: 50,
  expiryDate: "2024-12-31T23:59:59Z"
}

// 2. User applies during registration
POST /api/validate-coupon {
  code: "ARSENIC50",
  eventId: "event123"
}

// 3. System returns discount amount
```

---

### 2️⃣ ALUMNI 👥
```
Status: 🟡 Partial (UI exists with mock data)
├─ Schema: lib/schema.ts (lines 60-72)
├─ Type: export type Alumni
├─ Collection: COLLECTIONS.ALUMNI
├─ Frontend: app/alumni/page.tsx ✅ (displays mock data)
├─ API: ❌ MISSING → Need /api/alumni
└─ Admin: ❌ MISSING → Need app/admin/alumni/page.tsx
```

**Current Alumni Page**: `app/alumni/page.tsx`
- Shows 4 hardcoded alumni
- Has newsletter signup
- Has profile cards with badges

**To Connect to Database**:
1. Replace hardcoded array with database query
2. Add Appwrite integration
3. Create admin page to manage

---

### 3️⃣ ATTENDANCE ✅
```
Status: 🟡 Partial (Check-in exists, reporting missing)
├─ Schema: lib/schema.ts (lines 26-38)
├─ Type: export type Attendance
├─ Collection: COLLECTIONS.ATTENDANCE
│
├─ ✅ IMPLEMENTED:
│  ├─ app/admin/check-in/page.tsx (QR scanning)
│  ├─ QR code generation
│  └─ Real-time check-in
│
└─ ❌ MISSING:
   ├─ app/admin/attendance/page.tsx (reports)
   ├─ Attendance analytics
   └─ Export CSV
```

**Current Check-in Flow**:
```
1. Admin opens /admin/check-in
2. Scans delegate QR code
3. Creates ATTENDANCE record with timestamp
4. Updates REGISTRATIONS.checkedIn = true
5. Shows recent check-ins list
```

**What's Missing**:
- Attendance report page
- Filter by status (present/absent/late/excused)
- Export functionality
- Manual check-in (for walk-ins)

---

### 4️⃣ LEADERBOARD 🏆
```
Status: 🟡 Service ready (UI pages missing)
├─ Schema: lib/schema.ts (lines 15-24)
├─ Type: export type Score
├─ Collection: COLLECTIONS.SCORES
│
├─ ✅ BACKEND READY:
│  ├─ lib/scoring-service.ts (all functions)
│  ├─ getLeaderboard()
│  ├─ getCommitteeRankings()
│  ├─ exportScoresToCSV()
│  └─ getScoreStats()
│
├─ ✅ SCORING UI:
│  └─ app/chair/scoring/page.tsx (scoring sheet)
│
└─ ⚠️ LEADERBOARD UI:
   ├─ app/results/page.tsx (basic exists)
   ├─ Need: Real leaderboard display
   └─ Need: app/admin/scores/page.tsx (admin view)
```

**Current Scoring Page**: `app/chair/scoring/page.tsx`
- Chair/judge scores delegates
- Scoring criteria: Research, Oratory, Conduct, Rebuttal (4 × 10 = 40 total)
- Remarks field
- Multi-session tabs

**What's Missing**:
- Leaderboard table on /results page
- Admin scores dashboard
- Score management (view, edit, delete)
- Statistics/analytics

---

### 5️⃣ SPEAKER PANEL 🎤
```
Status: 🟡 Placeholder (needs full implementation)
├─ Schema: lib/schema.ts (lines 299-305) → speakerUpdateSchema
├─ Type: export type SpeakerUpdate
├─ Collection: COLLECTIONS.SPEAKER_UPDATES
│
├─ Current: app/speaker-panel/page.tsx
│  └─ Shows "Coming soon" message
│
└─ Needs:
   ├─ Real-time speaker queue
   ├─ Session timer
   ├─ POI/Motion management
   ├─ Crisis handling
   ├─ Live announcements
   └─ Delegate notifications
```

**Speaker Panel Purpose**:
- Chairperson tool to manage committee session
- NOT for selecting speakers (that's scoring)
- Tracks POI, motions, gavels, crises

**How Speaker is "Elected"**:
```
1. Register for event
2. Assigned to committee
3. Participate during session
4. Judges score performance
5. Highest score = "Best Speaker" (award)
6. Leaderboard shows rankings
```

---

## 📋 Implementation Priority

### 🔴 HIGH PRIORITY
1. **Leaderboard Display** - Users want to see results
   - Estimated: 2-3 hours
   - Files: app/results/page.tsx, app/admin/scores/page.tsx
   
2. **Attendance Reports** - Track participation
   - Estimated: 1-2 hours
   - Files: app/admin/attendance/page.tsx

3. **Coupons Admin** - Discount management
   - Estimated: 1-2 hours
   - Files: app/admin/coupons/page.tsx

### 🟡 MEDIUM PRIORITY
1. **Speaker Panel Complete** - Session management
   - Estimated: 3-4 hours
   - Files: app/speaker-panel/page.tsx rewrite

2. **Alumni Backend** - Connect to database
   - Estimated: 1 hour
   - Files: Update app/alumni/page.tsx, create app/admin/alumni/page.tsx

---

## 🔄 Data Collection Relationships

```
EVENT
  ├─ REGISTRATIONS (delegates)
  │  ├─ ATTENDANCE (check-ins)
  │  ├─ SCORES (judge ratings)
  │  └─ ALUMNI (past participants)
  │
  ├─ COMMITTEES (MUN councils, etc)
  │  ├─ SCORES (scores per committee)
  │  └─ SPEAKER_UPDATES (POI, motions)
  │
  ├─ COUPONS (discounts)
  │  └─ Applied during registration
  │
  └─ AWARDS (results)
     └─ Generated from SCORES
```

---

## 🚀 Next Steps

### To Implement LEADERBOARD:
```bash
# 1. Update Results Page
vi app/results/page.tsx
# Add: leaderboard display using scoring-service

# 2. Create Admin Scores Page
mkdir -p app/admin/scores
touch app/admin/scores/page.tsx
# Add: score management dashboard

# 3. Test with /api/scoring/leaderboard endpoint
```

### To Implement COUPONS:
```bash
# 1. Create Admin Coupons Page
mkdir -p app/admin/coupons
touch app/admin/coupons/page.tsx
# Follow pattern from app/admin/events/page.tsx

# 2. Add to registration form
vi components/registration/steps/payment.tsx
# Add: coupon input field + validation
```

### To Implement ALUMNI BACKEND:
```bash
# 1. Update alumni page
vi app/alumni/page.tsx
# Change: Replace hardcoded array with Appwrite query

# 2. Create admin page
mkdir -p app/admin/alumni
touch app/admin/alumni/page.tsx
# Add: CRUD operations for alumni
```

### To Implement ATTENDANCE REPORTS:
```bash
# 1. Create attendance dashboard
mkdir -p app/admin/attendance
touch app/admin/attendance/page.tsx
# Add: View all check-ins, filter, export

# 2. Add manual check-in option
vi app/admin/attendance/page.tsx
# Add: Form for walk-ins without QR
```

### To Complete SPEAKER PANEL:
```bash
# 1. Rewrite speaker panel
vi app/speaker-panel/page.tsx
# Add: Real speaker queue, timer, POI management

# 2. Create API for updates
mkdir -p app/api/speaker-updates
touch app/api/speaker-updates/route.ts
# Add: POST speaker update, GET updates
```

---

## 📞 API Endpoints Reference

| Feature | Method | Endpoint | Status |
|---------|--------|----------|--------|
| Validate Coupon | POST | `/api/validate-coupon` | ✅ Ready |
| Get Leaderboard | GET | `/api/scoring/leaderboard` | ✅ Ready* |
| Submit Score | POST | `/api/scoring/submit` | ✅ Ready* |
| Register | POST | `/api/registrations` | ✅ Ready |
| Check-in | POST | `/api/check-in` | ⚠️ Partial** |
| Alumni List | GET | `/api/alumni` | ❌ Missing |
| Create Coupon | POST | `/api/coupons` | ❌ Missing |
| Attendance Report | GET | `/api/attendance` | ❌ Missing |
| Speaker Updates | GET/POST | `/api/speaker-updates` | ❌ Missing |

✅ = Fully implemented
⚠️ = Partially implemented (needs frontend)
❌ = Not yet implemented
*= Frontend needed
**= Check-in page exists but API route may need updates

---

## 💡 File Creation Template

### Admin Page Template
```typescript
// File: app/admin/[feature]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { ID, Query } from "appwrite";
import { toast, Toaster } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export default function AdminFeaturePage() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.COLLECTION_NAME,
                [Query.orderDesc("$createdAt"), Query.limit(100)]
            );
            setItems(response.documents);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: any) => {
        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.COLLECTION_NAME,
                ID.unique(),
                data
            );
            toast.success("Created successfully");
            fetchItems();
            onOpenChange(false);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to create");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.COLLECTION_NAME,
                id
            );
            toast.success("Deleted successfully");
            fetchItems();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-right" richColors />
            
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Feature</h1>
                <Button color="primary" startContent={<Plus size={18} />} onPress={onOpen}>
                    Add New
                </Button>
            </div>

            {/* Items List */}
            <div className="space-y-2">
                {items.map((item) => (
                    <Card key={item.$id}>
                        <CardBody className="p-4 flex-row justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button isIconOnly size="sm" variant="light" onClick={() => setEditingItem(item)}>
                                    <Edit size={18} />
                                </Button>
                                <Button isIconOnly size="sm" variant="light" color="danger" onClick={() => handleDelete(item.$id)}>
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Modal for create/edit */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Add New</ModalHeader>
                            <ModalBody>{/* Form fields here */}</ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Save
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
```

---

## 🎓 Learning Resources

- **Appwrite Docs**: https://appwrite.io/docs
- **NextUI Components**: https://nextui.org/
- **Zod Validation**: https://zod.dev/
- **Server Actions**: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions

