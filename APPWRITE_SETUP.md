# 🚀 Appwrite Setup Guide for Arsenic Summit

> Complete step-by-step guide to set up your Appwrite backend from scratch.

---

## 📋 Table of Contents

1. [Initial Setup](#-initial-setup)
2. [Database Collections (22 total)](#-database-collections)
3. [Storage Setup](#-storage-setup)
4. [Environment Variables](#-environment-variables)
5. [Permissions Guide](#-permissions-guide)
6. [Verification & Testing](#-verification--testing)
7. [Troubleshooting](#-troubleshooting)

---

## 🔧 Initial Setup

### Step 1: Create Appwrite Project
1. Go to [Appwrite Cloud Console](https://cloud.appwrite.io)
2. Click **Create Project**
3. Name: `Arsenic Summit`
4. **Save your Project ID** → `YOUR_PROJECT_ID`

### Step 2: Create Database
1. Go to **Databases** tab
2. Click **Create Database**
3. Name: `arsenic_db`
4. **Save your Database ID** → `YOUR_DATABASE_ID`

### Step 3: Generate API Key
1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name: `Server SDK Key`
4. Select **ALL scopes** (for full access)
5. **Save your API Key** → `YOUR_API_KEY`

### Step 4: Configure Platforms
1. Go to **Settings** → **Platforms**
2. Add Web Platform:
   - Name: `Arsenic Web`
   - Hostname: `localhost` (for dev)
   - Add production domain when deploying

---

## 📁 Database Collections

> Create each collection in order. Total: **22 collections**

---

### Collection 1: `users`
**Purpose**: User profiles and authentication data

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| email | Email | ✅ | Unique |
| name | String | ✅ | |
| role | String | ✅ | Default: `delegate` |
| institution | String | ❌ | School/College name |
| phone | String | ❌ | |
| city | String | ❌ | |
| profileImage | String | ❌ | URL |
| createdAt | DateTime | ✅ | |
| updatedAt | DateTime | ❌ | |

**role Enum**: `delegate`, `admin`, `speaker`, `chairperson`

---

### Collection 2: `events`
**Purpose**: Main events (MUN, Lok Sabha, etc.)

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| name | String | ✅ | |
| type | String | ✅ | Event type |
| description | String | ❌ | |
| agenda | String | ❌ | |
| backgroundGuideUrl | String | ❌ | URL |
| startDate | DateTime | ✅ | |
| endDate | DateTime | ✅ | |
| registrationDeadline | DateTime | ❌ | |
| portfolioReleaseDate | DateTime | ❌ | |
| fees | Number | ✅ | Base fee |
| earlyBirdFee | Number | ❌ | |
| earlyBirdDeadline | DateTime | ❌ | |
| capacity | Integer | ❌ | Max participants |
| venue | String | ❌ | |
| imageUrl | String | ❌ | URL |
| isActive | Boolean | ✅ | Default: `true` |
| theme | String | ❌ | JSON string |
| feeStructure | String | ❌ | JSON string |
| paymentConfig | String | ❌ | JSON string |
| settings | String | ❌ | JSON string |
| createdAt | DateTime | ✅ | |

**type Enum**: `MUN`, `LOK_SABHA`, `RAJYA_SABHA`, `DEBATE`, `YOUTH_PARLIAMENT`

---

### Collection 3: `committees`
**Purpose**: Committee details for each event type

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| name | String | ✅ | Full name |
| abbreviation | String | ✅ | e.g., UNSC |
| type | String | ✅ | |
| eventType | String | ✅ | |
| description | String | ❌ | |
| agenda | String | ❌ | |
| backgroundGuideUrl | String | ❌ | URL |
| chairperson | String | ❌ | Name |
| viceChairperson | String | ❌ | Name |
| rapporteur | String | ❌ | Name |
| portfolios | String | ❌ | JSON array string |
| capacity | Integer | ✅ | Max delegates |
| imageUrl | String | ❌ | URL |
| linkedEventId | String | ❌ | Reference to event |
| difficultyTag | String | ❌ | |
| munData | String | ❌ | JSON string |
| lokSabhaData | String | ❌ | JSON string |
| rajyaSabhaData | String | ❌ | JSON string |
| debateData | String | ❌ | JSON string |
| createdAt | DateTime | ✅ | |

**eventType Enum**: `MUN`, `LOK_SABHA`, `RAJYA_SABHA`, `DEBATE`, `YOUTH_PARLIAMENT`  
**difficultyTag Enum**: `beginner`, `intermediate`, `advanced`

---

### Collection 4: `registrations`
**Purpose**: Event registration records

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| userId | String | ✅ | Reference to user |
| eventId | String | ✅ | Reference to event |
| code | String | ✅ | Unique reg code |
| fullName | String | ✅ | |
| email | Email | ✅ | |
| phone | String | ❌ | |
| institution | String | ❌ | |
| grade | String | ❌ | |
| city | String | ❌ | |
| age | Integer | ❌ | |
| committeePreferences | String | ❌ | JSON array string |
| assignedCommittee | String | ❌ | |
| assignedPortfolio | String | ❌ | |
| paymentStatus | String | ✅ | Default: `pending` |
| paymentAmount | Number | ❌ | |
| status | String | ✅ | Default: `pending` |
| checkedIn | Boolean | ✅ | Default: `false` |
| checkedInAt | DateTime | ❌ | |
| qrCode | String | ❌ | |
| createdAt | DateTime | ✅ | |
| updatedAt | DateTime | ❌ | |

**status Enum**: `pending`, `confirmed`, `cancelled`  
**paymentStatus Enum**: `pending`, `paid`, `refunded`, `failed`

---

### Collection 5: `awards`
**Purpose**: Award winners and certificates

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| eventId | String | ✅ | |
| category | String | ✅ | |
| awardType | String | ✅ | |
| recipientName | String | ✅ | |
| school | String | ❌ | |
| committee | String | ❌ | |
| position | Integer | ❌ | Rank |
| certificateUrl | String | ❌ | URL |
| isPublished | Boolean | ✅ | Default: `false` |
| createdAt | DateTime | ✅ | |

**awardType Enum**: `best_delegate`, `high_commendation`, `special_mention`, `best_delegation`, `verbal_mention`

---

### Collection 6: `team_members`
**Purpose**: Organizing team hierarchy

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| name | String | ✅ | |
| role | String | ✅ | Title/designation |
| position | String | ✅ | Hierarchy level |
| department | String | ❌ | |
| parentId | String | ❌ | For hierarchy |
| bio | String | ❌ | |
| imageUrl | String | ❌ | URL |
| email | Email | ❌ | |
| phone | String | ❌ | |
| socials | String | ❌ | JSON string |
| displayOrder | Integer | ❌ | Sort order |
| createdAt | DateTime | ✅ | |

**position Enum**: `founder`, `executive_board`, `hod`, `secretariat`, `subhead`, `organizing_committee`

---

### Collection 7: `sponsors`
**Purpose**: Sponsorship information

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| tier | String | ✅ | |
| name | String | ✅ | |
| logoUrl | String | ✅ | URL |
| websiteUrl | String | ❌ | URL |
| displayOrder | Integer | ❌ | Sort order |
| isActive | Boolean | ✅ | Default: `true` |
| createdAt | DateTime | ✅ | |

**tier Enum**: `title`, `platinum`, `gold`, `silver`

---

### Collection 8: `gallery`
**Purpose**: Event photos

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| imageUrl | String | ✅ | URL |
| thumbnailUrl | String | ❌ | URL |
| albumId | String | ❌ | Reference to album |
| eventType | String | ✅ | |
| conference | String | ❌ | |
| year | String | ✅ | e.g., "2024" |
| caption | String | ❌ | |
| featured | Boolean | ❌ | Default: `false` |
| uploadedBy | String | ❌ | |
| displayOrder | Integer | ❌ | |
| customTags | String | ❌ | JSON array string |
| createdAt | DateTime | ✅ | |

---

### Collection 9: `albums`
**Purpose**: Photo album organization

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| name | String | ✅ | |
| slug | String | ✅ | URL-friendly |
| eventType | String | ✅ | |
| coverImageUrl | String | ❌ | URL |
| description | String | ❌ | |
| year | String | ✅ | |
| displayOrder | Integer | ❌ | |
| createdAt | DateTime | ✅ | |

---

### Collection 10: `faqs`
**Purpose**: Frequently asked questions

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| category | String | ✅ | |
| question | String | ✅ | |
| answer | String | ✅ | |
| displayOrder | Integer | ❌ | |
| isActive | Boolean | ✅ | Default: `true` |
| createdAt | DateTime | ✅ | |

---

### Collection 11: `contact_submissions`
**Purpose**: Contact form entries

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| name | String | ✅ | |
| email | Email | ✅ | |
| subject | String | ✅ | |
| message | String | ✅ | |
| status | String | ✅ | Default: `new` |
| createdAt | DateTime | ✅ | |

**status Enum**: `new`, `read`, `replied`, `archived`

---

### Collection 12: `scores`
**Purpose**: Delegate scoring and rankings

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| registrationId | String | ✅ | |
| eventId | String | ✅ | |
| committeeId | String | ✅ | |
| score | Number | ✅ | 0-100 |
| feedback | String | ❌ | |
| rank | Integer | ❌ | |
| createdAt | DateTime | ✅ | |
| updatedAt | DateTime | ❌ | |

---

### Collection 13: `attendance`
**Purpose**: Check-in tracking

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| registrationId | String | ✅ | |
| eventId | String | ✅ | |
| committeeId | String | ❌ | |
| checkedInAt | DateTime | ✅ | |
| checkedInBy | String | ❌ | Admin who checked in |
| checkOutTime | DateTime | ❌ | |
| attendanceStatus | String | ✅ | Default: `present` |
| createdAt | DateTime | ✅ | |

**attendanceStatus Enum**: `present`, `absent`, `late`, `excused`

---

### Collection 14: `coupons`
**Purpose**: Discount codes

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| code | String | ✅ | Unique, uppercase |
| discountType | String | ✅ | |
| discountValue | Number | ✅ | |
| eventId | String | ✅ | |
| maxUses | Integer | ❌ | Null = unlimited |
| currentUses | Integer | ✅ | Default: `0` |
| expiryDate | DateTime | ❌ | |
| isActive | Boolean | ✅ | Default: `true` |
| createdBy | String | ✅ | Admin ID |
| createdAt | DateTime | ✅ | |

**discountType Enum**: `percentage`, `fixed`

---

### Collection 15: `payments`
**Purpose**: Payment transaction records

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| registrationId | String | ✅ | |
| amount | Number | ✅ | |
| currency | String | ✅ | Default: `INR` |
| gateway | String | ✅ | |
| transactionId | String | ✅ | |
| status | String | ✅ | |
| invoiceUrl | String | ❌ | URL |
| createdAt | DateTime | ✅ | |

**gateway Enum**: `razorpay`, `easebuzz`  
**status Enum**: `pending`, `success`, `failed`, `refunded`

---

### Collection 16: `speaker_updates`
**Purpose**: Real-time updates during sessions

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| committeeId | String | ✅ | |
| speakerId | String | ✅ | |
| type | String | ✅ | |
| content | String | ✅ | |
| timestamp | DateTime | ✅ | |

**type Enum**: `crisis`, `gavel`, `mention`, `announcement`

---

### Collection 17: `alumni`
**Purpose**: Alumni network profiles

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| userId | String | ✅ | |
| name | String | ✅ | |
| email | Email | ✅ | |
| institution | String | ❌ | |
| graduationYear | String | ❌ | |
| eventsAttended | String | ✅ | JSON array string |
| achievements | String | ❌ | JSON array string |
| bio | String | ❌ | |
| profileImageUrl | String | ❌ | URL |
| linkedinUrl | String | ❌ | URL |
| isActive | Boolean | ✅ | Default: `true` |
| joinedAt | DateTime | ✅ | |

---

### Collection 18: `forum_posts`
**Purpose**: Community discussions

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| committeeId | String | ✅ | |
| eventId | String | ✅ | |
| authorId | String | ✅ | |
| authorName | String | ✅ | |
| title | String | ✅ | |
| content | String | ✅ | |
| category | String | ✅ | |
| replies | Integer | ✅ | Default: `0` |
| views | Integer | ✅ | Default: `0` |
| likes | Integer | ✅ | Default: `0` |
| isPinned | Boolean | ✅ | Default: `false` |
| isLocked | Boolean | ✅ | Default: `false` |
| createdAt | DateTime | ✅ | |
| updatedAt | DateTime | ✅ | |

**category Enum**: `discussion`, `resource`, `question`, `announcement`

---

### Collection 19: `forum_replies`
**Purpose**: Replies to forum posts

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| postId | String | ✅ | |
| authorId | String | ✅ | |
| authorName | String | ✅ | |
| content | String | ✅ | |
| likes | Integer | ✅ | Default: `0` |
| isAnswer | Boolean | ✅ | Default: `false` |
| createdAt | DateTime | ✅ | |
| updatedAt | DateTime | ✅ | |

---

### Collection 20: `merchandise`
**Purpose**: Merchandise catalog

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| name | String | ✅ | |
| description | String | ✅ | |
| category | String | ✅ | |
| price | Number | ✅ | |
| quantity | Integer | ✅ | Stock |
| imageUrl | String | ✅ | URL |
| sizes | String | ❌ | JSON array string |
| colors | String | ❌ | JSON array string |
| eventId | String | ❌ | |
| isAvailable | Boolean | ✅ | Default: `true` |
| createdAt | DateTime | ✅ | |

**category Enum**: `tshirt`, `badge`, `certificate`, `mug`, `other`

---

### Collection 21: `merchandise_orders`
**Purpose**: Merchandise order tracking

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| userId | String | ✅ | |
| items | String | ✅ | JSON string |
| totalAmount | Number | ✅ | |
| shippingAddress | String | ✅ | JSON string |
| status | String | ✅ | Default: `pending` |
| createdAt | DateTime | ✅ | |
| deliveryDate | DateTime | ❌ | |

**status Enum**: `pending`, `processing`, `shipped`, `delivered`

---

### Collection 22: `documents`
**Purpose**: Delegate document submissions

| Field Name | Type | Required | Notes |
|-----------|------|----------|-------|
| authorId | String | ✅ | |
| authorName | String | ✅ | |
| authorEmail | Email | ✅ | |
| title | String | ✅ | |
| type | String | ✅ | |
| content | String | ✅ | Document body |
| status | String | ✅ | Default: `draft` |
| feedback | String | ❌ | Chair feedback |
| committeeId | String | ❌ | |
| eventId | String | ❌ | |
| createdAt | DateTime | ✅ | |
| updatedAt | DateTime | ✅ | |

**type Enum**: `resolution`, `position_paper`, `bill`, `amendment`  
**status Enum**: `draft`, `submitted`, `reviewed`, `approved`, `rejected`

---

## 💾 Storage Setup

### Create Storage Bucket

1. Go to **Storage** tab
2. Click **Create Bucket**
3. Configure:
   - **Name**: `arsenic_storage`
   - **Bucket ID**: `arsenic_storage` (or auto-generate)
   - **File Size Limit**: `50 MB`
   - **Allowed Extensions**: `jpg`, `jpeg`, `png`, `gif`, `pdf`, `doc`, `docx`
   - **Encryption**: Enabled
   - **Antivirus**: Enabled (if available)

4. **Save Bucket ID** → `YOUR_BUCKET_ID`

### Bucket Permissions
```
Read: Any
Create: Users
Update: Users
Delete: Users
```

---

## 🔑 Environment Variables

Create `.env.local` in your project root:

```env
# ═══════════════════════════════════════════════════════════════
# APPWRITE CONFIGURATION
# ═══════════════════════════════════════════════════════════════

# Public (Client-side) - These are exposed to the browser
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_APPWRITE_DATABASE_ID=YOUR_DATABASE_ID
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=YOUR_BUCKET_ID

# Private (Server-side only) - NEVER expose these
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=YOUR_PROJECT_ID
APPWRITE_API_KEY=YOUR_API_KEY

# ═══════════════════════════════════════════════════════════════
# APPLICATION CONFIGURATION
# ═══════════════════════════════════════════════════════════════

# Admin emails (comma-separated)
ADMIN_EMAILS=gauravramyadav@gmail.com,admin@example.com

# Environment
NODE_ENV=development
PORT=3000

# Site URL (for callbacks, emails, etc.)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🔐 Permissions Guide

### Public Collections
> Anyone can view, only admins can modify

**Collections**: `events`, `committees`, `sponsors`, `faqs`, `gallery`, `albums`, `team_members`, `awards`

```
Read: Any
Create: Users (with admin role check in API)
Update: Users (with admin role check in API)
Delete: Users (with admin role check in API)
```

### User Collections
> Users can create/view own, admins can view/modify all

**Collections**: `users`, `registrations`, `documents`, `alumni`

```
Read: Any
Create: Users
Update: Users
Delete: Users
```

### Admin Collections
> Only admins can create/modify, public can view results

**Collections**: `scores`, `attendance`, `coupons`, `payments`, `speaker_updates`

```
Read: Any
Create: Users (admin check in API)
Update: Users (admin check in API)
Delete: Users (admin check in API)
```

### Private Collections
> Admin only access

**Collections**: `contact_submissions`

```
Read: Users (admin check in API)
Create: Any (for contact form)
Update: Users (admin check in API)
Delete: Users (admin check in API)
```

---

## ✅ Verification & Testing

### Step 1: Test Environment

```bash
# Start development server
npm run dev
```

### Step 2: Check API Health

Visit: `http://localhost:3000/api/health`

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-..."
}
```

### Step 3: Test Pages

| Page | URL | Expected |
|------|-----|----------|
| Home | `/` | Shows events, stats |
| Register | `/register` | Account creation works |
| Login | `/login` | Authentication works |
| Events | `/events` | Lists events from DB |
| Committees | `/committees` | Lists committees |

### Step 4: Admin Access

1. Login with admin email
2. Visit `/admin`
3. Verify all admin features load

---

## 🐛 Troubleshooting

### CORS Error
```
Access-Control-Allow-Origin header missing
```

**Fix**:
1. Appwrite Console → Settings → Platforms
2. Add `localhost` for development
3. Add production domain when deploying
4. Wait 2-5 minutes for propagation
5. Clear browser cache (Ctrl+Shift+R)

---

### Collection Not Found
```
Collection with ID 'xxx' not found
```

**Fix**:
1. Verify collection name matches exactly in `lib/schema.ts`
2. Check Database ID in `.env.local`
3. Ensure collection was created in correct database

---

### API Key Invalid
```
API key invalid or missing scopes
```

**Fix**:
1. Regenerate API key with ALL scopes
2. Update `.env.local`
3. Restart dev server

---

### Unauthorized Error
```
User not authorized
```

**Fix**:
1. Check if user is logged in
2. Verify role permissions
3. Check document-level permissions
4. Ensure admin email is in `ADMIN_EMAILS`

---

### Session Error
```
Session not found or expired
```

**Fix**:
1. Clear browser cookies
2. Re-login
3. Check session handling in `AuthContext`

---

## 📊 Quick Reference

### Collection Count: **22**

| # | Collection | Purpose |
|---|------------|---------|
| 1 | users | User profiles |
| 2 | events | Main events |
| 3 | committees | Event committees |
| 4 | registrations | Event registrations |
| 5 | awards | Award winners |
| 6 | team_members | Organizing team |
| 7 | sponsors | Sponsors |
| 8 | gallery | Photos |
| 9 | albums | Photo albums |
| 10 | faqs | FAQs |
| 11 | contact_submissions | Contact form |
| 12 | scores | Delegate scores |
| 13 | attendance | Check-in records |
| 14 | coupons | Discount codes |
| 15 | payments | Payment records |
| 16 | speaker_updates | Live updates |
| 17 | alumni | Alumni network |
| 18 | forum_posts | Forum discussions |
| 19 | forum_replies | Forum replies |
| 20 | merchandise | Merch catalog |
| 21 | merchandise_orders | Merch orders |
| 22 | documents | Delegate docs |

---

## 📚 Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Web SDK](https://appwrite.io/docs/sdks#client-web)
- [Appwrite Server SDK](https://appwrite.io/docs/sdks#server-node)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Document Version**: 2.0  
**Last Updated**: December 16, 2025  
**Status**: Ready for Fresh Setup
