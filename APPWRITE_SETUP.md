# Appwrite Setup Guide - Complete Step-by-Step



## 📁 Database Collections Setup

### Collection 1: `users`
**Purpose**: Store user profiles

**Click**: Databases → `arsenic_db` → Create Collection

| Field Name | Type | Required | Additional |
|-----------|------|----------|-----------|
| email | Email | ✅ | Unique |
| name | String | ✅ | - |
| role | String | ✅ | Default: "delegate" |
| institution | String | ❌ | - |
| phone | String | ❌ | - |
| city | String | ❌ | - |
| profileImage | String | ❌ | URL |
| createdAt | DateTime | ✅ | Auto-set |
| updatedAt | DateTime | ❌ | Auto-update |

**Permissions**:
- Read: Everyone
- Create: Authenticated
- Update: Self
- Delete: Admins

---

### Collection 2: `registrations`
**Purpose**: Event registrations

| Field Name | Type | Required |
|-----------|------|----------|
| userId | String | ✅ |
| eventId | String | ✅ |
| code | String | ✅ |
| fullName | String | ✅ |
| email | Email | ✅ |
| phone | String | ❌ |
| institution | String | ❌ |
| grade | String | ❌ |
| city | String | ❌ |
| committeePreferences | String | ❌ |
| assignedCommittee | String | ❌ |
| assignedPortfolio | String | ❌ |
| paymentStatus | String | ✅ |
| paymentAmount | Number | ❌ |
| status | String | ✅ |
| checkedIn | Boolean | ✅ |
| checkedInAt | DateTime | ❌ |
| qrCode | String | ❌ |
| createdAt | DateTime | ✅ |

**Status Enum Values**: "pending", "confirmed", "cancelled"  
**Payment Status Enum**: "pending", "paid", "refunded", "failed"

---

### Collection 3: `committees`
**Purpose**: Committee details

| Field Name | Type | Required |
|-----------|------|----------|
| name | String | ✅ |
| abbreviation | String | ✅ |
| type | String | ✅ |
| eventType | String | ✅ |
| description | String | ❌ |
| agenda | String | ❌ |
| backgroundGuideUrl | URL | ❌ |
| chairperson | String | ❌ |
| viceChairperson | String | ❌ |
| rapporteur | String | ❌ |
| portfolios | String | ❌ |
| capacity | Integer | ✅ |
| imageUrl | URL | ❌ |
| difficultyTag | String | ❌ |
| createdAt | DateTime | ✅ |

**eventType Enum**: "MUN", "LOK_SABHA", "RAJYA_SABHA", "DEBATE", "YOUTH_PARLIAMENT"

---

### Collection 4: `events`
**Purpose**: Main events

| Field Name | Type | Required |
|-----------|------|----------|
| name | String | ✅ |
| type | String | ✅ |
| description | String | ❌ |
| agenda | String | ❌ |
| backgroundGuideUrl | URL | ❌ |
| startDate | DateTime | ✅ |
| endDate | DateTime | ✅ |
| registrationDeadline | DateTime | ❌ |
| fees | Number | ✅ |
| earlyBirdFee | Number | ❌ |
| earlyBirdDeadline | DateTime | ❌ |
| capacity | Integer | ❌ |
| venue | String | ❌ |
| imageUrl | URL | ❌ |
| isActive | Boolean | ✅ |
| createdAt | DateTime | ✅ |

---

### Collection 5: `awards`
**Purpose**: Award winners

| Field Name | Type | Required |
|-----------|------|----------|
| eventId | String | ✅ |
| category | String | ✅ |
| awardType | String | ✅ |
| recipientName | String | ✅ |
| school | String | ❌ |
| committee | String | ❌ |
| position | Integer | ❌ |
| certificateUrl | URL | ❌ |
| isPublished | Boolean | ✅ |
| createdAt | DateTime | ✅ |

**awardType Enum**: "best_delegate", "high_commendation", "special_mention", "best_delegation", "verbal_mention"

---

### Collection 6: `team_members`
**Purpose**: Team structure

| Field Name | Type | Required |
|-----------|------|----------|
| name | String | ✅ |
| role | String | ✅ |
| position | String | ✅ |
| department | String | ❌ |
| parentId | String | ❌ |
| bio | String | ❌ |
| imageUrl | URL | ❌ |
| email | Email | ❌ |
| phone | String | ❌ |
| socials | String | ❌ |
| displayOrder | Integer | ❌ |
| createdAt | DateTime | ✅ |

**position Enum**: "founder", "executive_board", "hod", "secretariat", "subhead", "organizing_committee"

---

### Collection 7: `sponsors`
**Purpose**: Sponsorship details

| Field Name | Type | Required |
|-----------|------|----------|
| tier | String | ✅ |
| name | String | ✅ |
| logoUrl | URL | ✅ |
| websiteUrl | URL | ❌ |
| displayOrder | Integer | ❌ |
| isActive | Boolean | ✅ |
| createdAt | DateTime | ✅ |

**tier Enum**: "title", "platinum", "gold", "silver"

---

### Collection 8: `gallery`
**Purpose**: Event photos

| Field Name | Type | Required |
|-----------|------|----------|
| imageUrl | URL | ✅ |
| thumbnailUrl | URL | ❌ |
| albumId | String | ❌ |
| eventType | String | ✅ |
| conference | String | ❌ |
| year | String | ✅ |
| caption | String | ❌ |
| featured | Boolean | ❌ |
| uploadedBy | String | ❌ |
| displayOrder | Integer | ❌ |
| createdAt | DateTime | ✅ |

---

### Collection 9: `faqs`
**Purpose**: FAQ section

| Field Name | Type | Required |
|-----------|------|----------|
| category | String | ✅ |
| question | String | ✅ |
| answer | String | ✅ |
| displayOrder | Integer | ❌ |
| isActive | Boolean | ✅ |
| createdAt | DateTime | ✅ |

---

### Collection 10: `contact_submissions`
**Purpose**: Contact form submissions

| Field Name | Type | Required |
|-----------|------|----------|
| name | String | ✅ |
| email | Email | ✅ |
| subject | String | ✅ |
| message | String | ✅ |
| status | String | ✅ |
| createdAt | DateTime | ✅ |

**status Enum**: "new", "read", "replied", "archived"

---

### Collection 11: `scores`
**Purpose**: Event scoring

| Field Name | Type | Required |
|-----------|------|----------|
| registrationId | String | ✅ |
| eventId | String | ✅ |
| committeeId | String | ✅ |
| score | Number | ✅ |
| feedback | String | ❌ |
| rank | Integer | ❌ |
| createdAt | DateTime | ✅ |

---

### Collection 12: `attendance`
**Purpose**: Check-in records

| Field Name | Type | Required |
|-----------|------|----------|
| registrationId | String | ✅ |
| eventId | String | ✅ |
| checkedInAt | DateTime | ✅ |
| checkedInBy | String | ❌ |
| qrCodeScanned | Boolean | ✅ |
| createdAt | DateTime | ✅ |

---

### Collection 13: `coupons`
**Purpose**: Discount codes

| Field Name | Type | Required |
|-----------|------|----------|
| code | String | ✅ |
| discountType | String | ✅ |
| discountValue | Number | ✅ |
| eventId | String | ❌ |
| maxUses | Integer | ❌ |
| usedCount | Integer | ✅ |
| expiresAt | DateTime | ❌ |
| isActive | Boolean | ✅ |
| createdAt | DateTime | ✅ |

**discountType Enum**: "percentage", "fixed"

---

### Collection 14: `payments`
**Purpose**: Payment tracking

| Field Name | Type | Required |
|-----------|------|----------|
| registrationId | String | ✅ |
| amount | Number | ✅ |
| currency | String | ✅ |
| gateway | String | ✅ |
| transactionId | String | ✅ |
| status | String | ✅ |
| invoiceUrl | URL | ❌ |
| createdAt | DateTime | ✅ |

**gateway Enum**: "razorpay", "easebuzz"  
**status Enum**: "pending", "success", "failed", "refunded"

---

## 🔐 Setting Up Permissions

### For Public Collections (e.g., committees, events)
```
Document Rules:
- Read: Everyone (anyone can view)
- Create: Admins only
- Update: Admins only
- Delete: Admins only
```

### For User Collections (e.g., registrations, users)
```
Document Rules:
- Read: Everyone (can view all registrations for stats)
- Create: Authenticated users
- Update: Owner or Admins
- Delete: Admins only
```

### For Admin Collections (e.g., awards, scores)
```
Document Rules:
- Read: Everyone (for display)
- Create: Admins only
- Update: Admins only
- Delete: Admins only
```

---

### Collection 15: `speaker_updates`
**Purpose**: Real-time updates from speakers to committees

| Field Name | Type | Required |
|-----------|------|----------|
| committeeId | String | ✅ |
| speakerId | String | ✅ |
| type | String | ✅ |
| content | String | ✅ |
| timestamp | DateTime | ✅ |

**type Enum**: "crisis", "gavel", "mention", "announcement"

---

### Collection 16: `albums`
**Purpose**: Photo albums organization

| Field Name | Type | Required |
|-----------|------|----------|
| name | String | ✅ |
| slug | String | ✅ |
| eventType | String | ✅ |
| coverImageUrl | URL | ❌ |
| description | String | ❌ |
| year | String | ✅ |
| displayOrder | Integer | ❌ |

---

### Collection 17: `alumni`
**Purpose**: Alumni network profiles

| Field Name | Type | Required |
|-----------|------|----------|
| userId | String | ✅ |
| name | String | ✅ |
| email | Email | ✅ |
| institution | String | ❌ |
| graduationYear | String | ❌ |
| eventsAttended | String[] | ✅ |
| achievements | String[] | ❌ |
| bio | String | ❌ |
| profileImageUrl | URL | ❌ |
| linkedinUrl | URL | ❌ |
| isActive | Boolean | ✅ |
| joinedAt | DateTime | ✅ |
```

---

### Collection 18: `forum_posts`
**Purpose**: Community forum discussions

| Field Name | Type | Required |
|-----------|------|----------|
| committeeId | String | ✅ |
| eventId | String | ✅ |
| authorId | String | ✅ |
| authorName | String | ✅ |
| title | String | ✅ |
| content | String | ✅ |
| category | String | ✅ |
| replies | Integer | ✅ |
| views | Integer | ✅ |
| likes | Integer | ✅ |
| isPinned | Boolean | ✅ |
| isLocked | Boolean | ✅ |
| createdAt | DateTime | ✅ |
| updatedAt | DateTime | ✅ |

**category Enum**: "discussion", "resource", "question", "announcement"

---

### Collection 19: `forum_replies`
**Purpose**: Replies to forum posts

| Field Name | Type | Required |
|-----------|------|----------|
| postId | String | ✅ |
| authorId | String | ✅ |
| authorName | String | ✅ |
| content | String | ✅ |
| likes | Integer | ✅ |
| isAnswer | Boolean | ✅ |
| createdAt | DateTime | ✅ |
| updatedAt | DateTime | ✅ |

---

### Collection 20: `merchandise`
**Purpose**: Merchandise catalog

| Field Name | Type | Required |
|-----------|------|----------|
| name | String | ✅ |
| description | String | ✅ |
| category | String | ✅ |
| price | Number | ✅ |
| quantity | Integer | ✅ |
| imageUrl | URL | ✅ |
| sizes | String[] | ❌ |
| colors | String[] | ❌ |
| eventId | String | ❌ |
| isAvailable | Boolean | ✅ |

**category Enum**: "tshirt", "badge", "certificate", "mug", "other"

---

### Collection 21: `merchandise_orders`
**Purpose**: Merchandise order tracking

| Field Name | Type | Required |
|-----------|------|----------|
| userId | String | ✅ |
| items | String | ✅ |
| totalAmount | Number | ✅ |
| shippingAddress | String | ✅ |
| status | String | ✅ |
| createdAt | DateTime | ✅ |
| deliveryDate | DateTime | ❌ |

**items**: JSON String of object array
**shippingAddress**: JSON String of address object
**status Enum**: "pending", "processing", "shipped", "delivered"
```

---

## 💾 Storage Setup

### Create Storage Bucket
1. Go to **Storage** tab
2. Click **Create Bucket**
3. Name: `arsenic_storage`
4. File Size Limit: 50 MB
5. Allowed Extensions: `jpg,jpeg,png,pdf,doc,docx`

**Save Bucket ID**

---

## 🔑 Environment Variables

Create `.env.local` in project root:

```env
# ===== PUBLIC (Client-side) =====
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://tor.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=YOUR_PROJECT_ID_HERE
NEXT_PUBLIC_APPWRITE_DATABASE_ID=YOUR_DATABASE_ID_HERE
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=YOUR_BUCKET_ID_HERE

# ===== PRIVATE (Server-side) =====
APPWRITE_ENDPOINT=https://tor.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=YOUR_PROJECT_ID_HERE
APPWRITE_API_KEY=YOUR_API_KEY_HERE

# ===== CONFIGURATION =====
ADMIN_EMAILS=gauravramyadav@gmail.com,admin@example.com
PORT=3000
NODE_ENV=development
```

---

## ✅ Verification Checklist

```bash
# 1. Start dev server
npm run dev

# 2. Check if Appwrite is configured
curl http://localhost:3000/api/health

# 3. Try homepage (should show real stats)
# Visit http://localhost:3000

# 4. Test registration
# Go to /register and try signing up

# 5. Check browser console
# Should NOT show CORS errors if domains configured correctly
```

---

## 🐛 Common Issues & Fixes

### Issue: "CORS Error"
```
Access-Control-Allow-Origin header has value 'https://localhost' 
which is not equal to the supplied origin
```

**Fix**:
1. Go to Appwrite Console → Settings → Domains
2. Add your domain
3. Wait 5 minutes
4. Clear browser cache (Ctrl+Shift+R)
5. Restart dev server

### Issue: "Collection not found"
```
Collection with ID 'users' not found
```

**Fix**:
1. Verify collection name in Appwrite console
2. Match it exactly in `lib/schema.ts`
3. Check database ID in `.env.local`

### Issue: "API Key Invalid"
```
API key invalid. Check that user has access to the requested resource
```

**Fix**:
1. Regenerate API key
2. Ensure all required scopes are selected
3. Update `.env.local` with new key
4. Restart server

### Issue: "Unauthorized"
```
User not authorized to perform this action
```

**Fix**:
1. Check document permissions
2. Ensure user is authenticated
3. Verify role/admin status

---

## 📊 Sample Data to Add

### Sample Event
```json
{
  "name": "Arsenic Summit 2024",
  "type": "MUN",
  "description": "Regional MUN conference",
  "startDate": "2025-02-01T09:00:00Z",
  "endDate": "2025-02-02T17:00:00Z",
  "fees": 2500,
  "capacity": 200,
  "isActive": true
}
```

### Sample Committee
```json
{
  "name": "United Nations Security Council",
  "abbreviation": "UNSC",
  "type": "MUN",
  "eventType": "MUN",
  "description": "Debate on international security issues",
  "capacity": 15,
  "imageUrl": "https://...",
  "difficultyTag": "advanced"
}
```

### Sample Sponsor
```json
{
  "tier": "gold",
  "name": "XYZ Corporation",
  "logoUrl": "https://...",
  "websiteUrl": "https://xyzcorp.com",
  "isActive": true
}
```

---

## 🚀 Next Steps

1. ✅ Create all collections
2. ✅ Configure CORS
3. ✅ Add sample data
4. ✅ Set up environment variables
5. ✅ Test API endpoints
6. ✅ Enable real-time subscriptions (optional)
7. ✅ Set up backups
8. ✅ Configure access logs

---

## 📚 Additional Resources

- **Appwrite Documentation**: https://appwrite.io/docs
- **Appwrite REST API**: https://appwrite.io/docs/rest
- **Appwrite Web SDK**: https://appwrite.io/docs/client/web
- **Schema Validation (Zod)**: https://zod.dev

---

**Last Updated**: November 28, 2025  
**Appwrite Version**: Latest Cloud  
**Status**: Ready for Deployment
