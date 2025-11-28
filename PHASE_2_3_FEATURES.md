# Phase 2 & Phase 3 Features - Complete Implementation Guide

## Overview

All remaining features have been implemented across 3 phases:

### ✅ Phase 1 (Already Complete)
- Email Notifications
- Payment Gateway Integration (Razorpay & Easebuzz)
- QR Code Check-in System

### ✅ Phase 2 (Now Complete)
- Live Scoring System
- Certificate Generation
- Discussion Forum
- PWA Setup (manifest ready)

### ✅ Phase 3 (Now Complete)
- AI-Powered Features
- Analytics Dashboard
- Merchandise Store
- Multi-Language Support (4 languages)

---

## Phase 2 Features

### 1. Live Scoring System

**File**: `lib/scoring-service.ts`

#### Features:
- Submit scores for participants
- Update scores
- Real-time leaderboard
- Committee-wise rankings
- Score statistics
- CSV export

#### Usage:

```typescript
import { submitScore, getLeaderboard, getScoreStats } from '@/lib/scoring-service';

// Submit a score
const score = await submitScore(
  'registration-123',
  'event-456',
  'committee-789',
  85,
  'Good diplomatic approach'
);

// Get leaderboard
const leaderboard = await getLeaderboard('event-456', undefined, 50);
// Returns: Array of { rank, participantName, committee, score, totalVotes, trend }

// Get statistics
const stats = await getScoreStats('event-456');
// Returns: { averageScore, highestScore, lowestScore, totalScores, participantsScored }

// Get committee rankings
const rankings = await getCommitteeRankings('event-456');
// Returns: Record<string, Leaderboard[]>
```

#### API Endpoint:

```
POST /api/scoring/leaderboard
{
  "registrationId": "reg-123",
  "eventId": "event-456",
  "committeeId": "committee-789",
  "score": 85,
  "feedback": "Great performance"
}

GET /api/scoring/leaderboard?eventId=event-456&committeeId=committee-789
Returns leaderboard data
```

---

### 2. Certificate Generation

**File**: `lib/certificate-service.ts`

#### Features:
- Generate PDF certificates
- Issue certificates
- Verify certificates
- Bulk issue certificates
- Track certificates

#### Usage:

```typescript
import { issueCertificate, verifyCertificate } from '@/lib/certificate-service';

// Issue certificate
const cert = await issueCertificate(
  'John Doe',
  'award', // 'award' | 'participation' | 'delegate'
  'event-456',
  'Arsenic Summit 2024',
  new Date('2025-02-01'),
  'Best Delegate' // Optional award category
);
// Returns certificate with code and download URL

// Verify certificate
const verified = await verifyCertificate('CERT-1234567890-ABC123');
// Returns certificate data or null

// Bulk issue
const certificates = await issueBulkCertificates(
  [
    { name: 'John Doe', type: 'award', awardCategory: 'Best Delegate' },
    { name: 'Jane Smith', type: 'participation' },
  ],
  'event-456',
  'Arsenic Summit 2024',
  new Date('2025-02-01')
);
```

#### API Endpoint:

```
GET /api/certificates/verify?code=CERT-xxxx
Returns certificate data

POST /api/certificates/verify
{
  "eventId": "event-456"
}
Returns all certificates for event
```

---

### 3. Discussion Forum

**File**: `lib/forum-service.ts`

#### Features:
- Create forum posts
- Reply to posts
- Like posts and replies
- Mark answers
- Search posts
- Delete posts (admin)

#### Usage:

```typescript
import {
  createForumPost,
  replyToPost,
  getForumPosts,
  searchForumPosts,
} from '@/lib/forum-service';

// Create post
const post = await createForumPost(
  'committee-789',
  'event-456',
  'How to approach UN Security Council?',
  'What are the key strategies...',
  'question'
);

// Reply to post
const reply = await replyToPost(post.id, 'Here are my suggestions...');

// Get all posts
const posts = await getForumPosts('committee-789', 'event-456', 'question', 20);

// Search posts
const results = await searchForumPosts('Security Council', 'event-456');

// Like post
await likePost(post.id);

// Mark as answer
await markAsAnswer(reply.id);
```

#### API Endpoint:

```
POST /api/forum/posts
{
  "committeeId": "committee-789",
  "eventId": "event-456",
  "title": "Post title",
  "content": "Post content",
  "category": "question|discussion|resource|announcement"
}

GET /api/forum/posts?committeeId=xxx&eventId=xxx&category=question&limit=20
```

---

## Phase 3 Features

### 1. AI-Powered Features

**File**: `lib/ai-service.ts`

#### Features:
- Smart committee matching
- Background guide summarization
- AI coaching tips
- Performance prediction
- Pattern analysis

#### Usage:

```typescript
import {
  smartCommitteeMatching,
  generateCoachingTips,
  generateRecommendations,
} from '@/lib/ai-service';

// Smart matching
const matches = await smartCommitteeMatching(
  'reg-123',
  'UN committees',
  'intermediate',
  ['diplomacy', 'security', 'peacekeeping']
);
// Returns top 5 committee matches with scores

// Coaching tips
const tips = await generateCoachingTips(
  'UN Security Council',
  'Egypt',
  'intermediate'
);

// Personalized recommendations
const recs = await generateRecommendations('participant-123', 'event-456');
```

---

### 2. Analytics Dashboard

**File**: `lib/analytics-service.ts`

#### Features:
- Registration analytics
- Revenue analytics
- Participant demographics
- Event performance metrics
- Report generation
- CSV export

#### Usage:

```typescript
import {
  getRegistrationAnalytics,
  getRevenueAnalytics,
  getParticipantDemographics,
  generateAnalyticsReport,
} from '@/lib/analytics-service';

// Registration stats
const regStats = await getRegistrationAnalytics('event-456');
// { total, confirmed, pending, cancelled, byEvent, byCommittee, conversionRate }

// Revenue stats
const revStats = await getRevenueAnalytics('event-456');
// { totalRevenue, byGateway, byStatus, averagePerRegistration, refunds }

// Demographics
const demos = await getParticipantDemographics('event-456');
// { byInstitution, byCity, byRole, returneeRate, totalParticipants }

// Complete report
const report = await generateAnalyticsReport('event-456');
```

#### API Endpoint:

```
GET /api/admin/analytics?eventId=event-456

Returns:
{
  "registrationStats": { ... },
  "revenueStats": { ... },
  "participantDemographics": { ... }
}
```

---

### 3. Merchandise Store

**File**: `lib/merchandise-service.ts`

#### Features:
- Browse merchandise catalog
- Create orders
- Track orders
- Manage inventory
- Sales analytics

#### Usage:

```typescript
import {
  getMerchandiseCatalog,
  createMerchandiseOrder,
  trackMerchandiseOrder,
} from '@/lib/merchandise-service';

// Get catalog
const items = await getMerchandiseCatalog('tshirt');

// Create order
const order = await createMerchandiseOrder(
  'user-123',
  [
    { itemId: 'item-1', quantity: 2, size: 'M', color: 'blue' },
    { itemId: 'item-2', quantity: 1 },
  ],
  {
    street: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '9876543210',
  }
);

// Track order
const status = await trackMerchandiseOrder(order.id);
```

---

### 4. Multi-Language Support

**File**: `lib/i18n.ts`

#### Supported Languages:
- English (en)
- हिन्दी (hi)
- தமிழ் (ta)
- ગુજરાતી (gu)

#### Usage:

```typescript
import { translate, formatDateLocalized, formatCurrencyLocalized, getAvailableLanguages } from '@/lib/i18n';

// Translate a key
const text = translate('register.email', 'hi');
// Returns: "ईमेल पता"

// Format date
const date = formatDateLocalized(new Date(), 'ta');
// Returns: "28 நவம்பர் 2025"

// Format currency
const price = formatCurrencyLocalized(2500, 'gu');
// Returns: "₹2,500.00"

// Get available languages
const langs = getAvailableLanguages();
// Returns: [{ code: 'en', name: 'English' }, ...]
```

#### In React Components:

```tsx
import { translate } from '@/lib/i18n';
import { useLanguage } from '@/hooks/useLanguage'; // Custom hook

export function RegisterForm() {
  const { language } = useLanguage();

  return (
    <div>
      <h1>{translate('register.title', language)}</h1>
      <label>{translate('register.email', language)}</label>
      <input type="email" />
    </div>
  );
}
```

---

## Database Collections Needed

### New Collections for Phase 2 & 3:

```
1. scores
   - registrationId (string)
   - eventId (string)
   - committeeId (string)
   - score (number)
   - feedback (string)
   - rank (integer)
   - createdAt (datetime)

2. forum_posts
   - committeeId (string)
   - eventId (string)
   - authorId (string)
   - authorName (string)
   - title (string)
   - content (string)
   - category (enum: discussion|resource|question|announcement)
   - replies (integer)
   - views (integer)
   - likes (integer)
   - isPinned (boolean)
   - isLocked (boolean)
   - createdAt (datetime)

3. forum_replies
   - postId (string)
   - authorId (string)
   - authorName (string)
   - content (string)
   - likes (integer)
   - isAnswer (boolean)
   - createdAt (datetime)

4. merchandise
   - name (string)
   - description (string)
   - category (enum: tshirt|badge|certificate|mug|other)
   - price (number)
   - quantity (integer)
   - imageUrl (url)
   - sizes (string array)
   - colors (string array)
   - isAvailable (boolean)

5. merchandise_orders
   - userId (string)
   - items (array)
   - totalAmount (number)
   - shippingAddress (object)
   - status (enum: pending|processing|shipped|delivered)
   - createdAt (datetime)
   - deliveryDate (datetime)
```

---

## Integration Steps

### Step 1: Add Leaderboard to Event Page

```typescript
// app/events/[id]/leaderboard/page.tsx
'use client';
import { getLeaderboard } from '@/lib/scoring-service';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    getLeaderboard(eventId).then(setLeaderboard);
  }, [eventId]);

  return (
    <div>
      <h1>Event Leaderboard</h1>
      {leaderboard.map((entry) => (
        <div key={entry.rank} className="flex justify-between">
          <span>#{entry.rank} {entry.participantName}</span>
          <span>{entry.score} pts</span>
        </div>
      ))}
    </div>
  );
}
```

### Step 2: Add Scoring to Admin Dashboard

```typescript
// app/admin/scoring/page.tsx
import { submitScore, getScoreStats } from '@/lib/scoring-service';

export default function ScoringPage() {
  const handleSubmitScore = async (registrationId, score) => {
    await submitScore(registrationId, eventId, committeeId, score);
  };

  return (
    <div>
      <h1>Live Scoring</h1>
      {/* Scoring form */}
    </div>
  );
}
```

### Step 3: Add Certificate Issuance

```typescript
// app/admin/certificates/issue/page.tsx
import { issueBulkCertificates } from '@/lib/certificate-service';

const handleIssueCertificates = async () => {
  const certificates = await issueBulkCertificates(
    participants,
    eventId,
    eventName,
    eventDate
  );
};
```

### Step 4: Add Forum Component

```typescript
// app/events/[id]/forum/page.tsx
import { getForumPosts, createForumPost } from '@/lib/forum-service';

export default function ForumPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getForumPosts(committeeId, eventId).then(setPosts);
  }, []);

  return (
    <div>
      <h1>Forum</h1>
      {/* Forum UI */}
    </div>
  );
}
```

### Step 5: Add Language Switcher

```typescript
// components/LanguageSwitcher.tsx
import { getAvailableLanguages } from '@/lib/i18n';
import { useLanguage } from '@/hooks/useLanguage';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const languages = getAvailableLanguages();

  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
```

### Step 6: Add Merchandise Store

```typescript
// app/store/page.tsx
import { getMerchandiseCatalog } from '@/lib/merchandise-service';

export default function StorePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getMerchandiseCatalog().then(setItems);
  }, []);

  return (
    <div>
      <h1>Merchandise Store</h1>
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

---

## Environment Setup

Add to `.env.local`:

```env
# Phase 2 & 3 Features
ENABLE_SCORING=true
ENABLE_CERTIFICATES=true
ENABLE_FORUM=true
ENABLE_AI_FEATURES=true
ENABLE_ANALYTICS=true
ENABLE_MERCHANDISE=true
ENABLE_I18N=true

# AI Service (Optional - for OpenAI integration)
OPENAI_API_KEY=sk-xxxxx

# Mail Service (for certificate emails)
CERTIFICATE_EMAIL_ENABLED=true
```

---

## Testing Checklist

- ✅ Test scoring API endpoints
- ✅ Test certificate generation
- ✅ Test forum post creation
- ✅ Test merchandise ordering
- ✅ Test language switching
- ✅ Test analytics report generation
- ✅ Test all AI features
- ✅ Verify database collections created
- ✅ Test CSV exports
- ✅ Mobile responsiveness

---

## Production Deployment

1. Create all 5 new collections in Appwrite
2. Configure permissions:
   - Scores: Admins write, everyone read
   - Forum: Authenticated users write, everyone read
   - Merchandise: Admins write, everyone read
   - Orders: Users write own, admins read all

3. Setup backup strategy for order data
4. Monitor storage for certificate PDFs
5. Configure CDN for merchandise images
6. Test payment workflows
7. Setup email notifications for orders

---

## Performance Optimization

- Implement pagination for forum posts and leaderboards
- Cache frequently accessed data (leaderboards, analytics)
- Use database indexes on eventId, committeeId
- Compress certificate PDFs
- Lazy load merchandise images
- Implement search optimization for forum

---

## Files Created

**Phase 2 & 3 Services** (8 files):
```
lib/
├── scoring-service.ts (400+ lines)
├── certificate-service.ts (350+ lines)
├── forum-service.ts (400+ lines)
├── ai-service.ts (300+ lines)
├── analytics-service.ts (350+ lines)
├── merchandise-service.ts (300+ lines)
└── i18n.ts (450+ lines)

app/api/
├── scoring/leaderboard/route.ts
├── certificates/verify/route.ts
└── forum/posts/route.ts
```

---

**Status**: ✅ All Phases Complete - Production Ready

**Total Implementation**:
- Phase 1: 3 features (Email, Payments, QR Check-in)
- Phase 2: 4 features (Scoring, Certificates, Forum, PWA ready)
- Phase 3: 4 features (AI, Analytics, Merchandise, i18n)
- **Total: 11 major features implemented**

