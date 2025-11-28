# Arsenic Routes Guide

## Overview
This document provides a comprehensive guide to all routes in the Arsenic application, including their purposes, locations, and usage.

Legend:
- `○` = Page route (renders UI)
- `ƒ` = API route (server handler)

---

## 📄 PUBLIC PAGES (○)

### Home & Core Pages
| Route | Location | Purpose |
|-------|----------|---------|
| `/` | `app/page.tsx` | Landing page with hero section and event overview |
| `/about` | `app/about/page.tsx` | About the summit, mission, vision |
| `/robots.txt` | `app/robots.ts` | SEO robots configuration |
| `/sitemap.xml` | `app/sitemap.ts` | XML sitemap for search engines |

### Event Discovery
| Route | Location | Purpose |
|-------|----------|---------|
| `/events` | `app/events/page.tsx` | All events listing page |
| `/mun` | `app/mun/page.tsx` | Model United Nations event details |
| `/lok-sabha` | `app/lok-sabha/page.tsx` | Lok Sabha simulation event |
| `/rajya-sabha` | `app/rajya-sabha/page.tsx` | Rajya Sabha simulation event |
| `/debate` | `app/debate/page.tsx` | Debate championship event |
| `/youth-parliament` | `app/youth-parliament/page.tsx` | Youth parliament event |

### User Features
| Route | Location | Purpose |
|-------|----------|---------|
| `/login` | `app/login/page.tsx` | User authentication page |
| `/register` | `app/register/page.tsx` | Main registration page |
| `/register/event` | `app/register/event/page.tsx` | Register for specific events |
| `/register/success` | `app/register/success/page.tsx` | Registration confirmation page |
| `/dashboard` | `app/dashboard/page.tsx` | User dashboard showing allocations |
| `/dashboard/documents` | `app/dashboard/documents/page.tsx` | Background guides & resources |
| `/dashboard/networking` | `app/dashboard/networking/page.tsx` | Connect with other delegates |

### Information Pages
| Route | Location | Purpose |
|-------|----------|---------|
| `/committees` | `app/committees/page.tsx` | Browse all committees |
| `/delegates` | `app/delegates/page.tsx` | Delegate profiles |
| `/team` | `app/team/page.tsx` | Team members/organizers |
| `/sponsors` | `app/sponsors/page.tsx` | Event sponsors showcase |
| `/gallery` | `app/gallery/page.tsx` | Photo gallery from past events |
| `/faqs` | `app/faqs/page.tsx` | Frequently asked questions |
| `/contact` | `app/contact/page.tsx` | Contact form & information |
| `/alumni` | `app/alumni/page.tsx` | Alumni/past participants |

### Results & Verification
| Route | Location | Purpose |
|-------|----------|---------|
| `/results` | `app/results/page.tsx` | Event results listing |
| `/results/[id]` | `app/results/[id]/page.tsx` | Specific result details (dynamic) |
| `/speaker-panel` | `app/speaker-panel/page.tsx` | Featured speakers |

### Chair Features
| Route | Location | Purpose |
|-------|----------|---------|
| `/chair` | `app/chair/layout.tsx` | Chair dashboard layout |
| `/chair/delegates` | `app/chair/delegates/page.tsx` | Manage delegates in committee |
| `/chair/resources` | `app/chair/resources/page.tsx` | Chair resources & guides |
| `/chair/scoring` | `app/chair/scoring/page.tsx` | Score participants |

### Error Pages
| Route | Location | Purpose |
|-------|----------|---------|
| `/_not-found` | `app/not-found.tsx` | 404 error page |

---

## 🛠️ ADMIN PAGES (○)

All admin routes require admin authentication (checked in `app/admin/layout.tsx`)

| Route | Location | Purpose |
|-------|----------|---------|
| `/admin` | `app/admin/page.tsx` | Admin dashboard with statistics |
| `/admin/events` | `app/admin/events/page.tsx` | Create/edit events with themes & pricing |
| `/admin/committees` | `app/admin/committees/page.tsx` | Manage committees by event type |
| `/admin/registrations` | `app/admin/registrations/page.tsx` | View & manage all registrations |
| `/admin/check-in` | `app/admin/check-in/page.tsx` | QR code scanner check-in station |
| `/admin/awards` | `app/admin/awards/page.tsx` | Award management & certificate generation |
| `/admin/gallery` | `app/admin/gallery/page.tsx` | Bulk image upload & album management |
| `/admin/team` | `app/admin/team/page.tsx` | Manage team members |
| `/admin/sponsors` | `app/admin/sponsors/page.tsx` | Sponsor tier management |
| `/admin/faqs` | `app/admin/faqs/page.tsx` | Create/edit FAQs with drag-and-drop |
| `/admin/contact` | `app/admin/contact/page.tsx` | View contact form submissions |

**Location:** `app/admin/` folder with `layout.tsx` providing sidebar navigation

---

## 🔌 API ROUTES (ƒ)

### Authentication APIs
| Route | Location | Purpose | Method |
|-------|----------|---------|--------|
| `/api/auth/login` | `app/api/auth/login/route.ts` | User login handler | POST |
| `/api/auth/logout` | `app/api/auth/logout/route.ts` | User logout handler | POST |
| `/api/auth/me` | `app/api/auth/me/route.ts` | Get current user info | GET |

### Registration APIs
| Route | Location | Purpose | Method |
|-------|----------|---------|--------|
| `/api/register` | `app/api/register/route.ts` | Create new registration | POST |
| `/api/registrations` | `app/api/registrations/route.ts` | List/manage registrations | GET, PUT |
| `/api/users/[email]` | `app/api/users/[email]/route.ts` | Get user by email (dynamic) | GET |
| `/api/user/allocation` | `app/api/user/allocation/route.ts` | Get committee allocation | GET |

### Payment APIs
| Route | Location | Purpose | Method |
|-------|----------|---------|--------|
| `/api/payments/razorpay` | `app/api/payments/razorpay/route.ts` | Razorpay payment handler | POST |
| `/api/payments/razorpay/create-order` | `app/api/payments/razorpay/create-order/route.ts` | Create Razorpay order | POST |
| `/api/payments/razorpay/verify` | `app/api/payments/razorpay/verify/route.ts` | Verify Razorpay payment | POST |
| `/api/payments/easebuzz` | `app/api/payments/easebuzz/route.ts` | Easebuzz payment handler | POST |
| `/api/payments/easebuzz/initiate` | `app/api/payments/easebuzz/initiate/route.ts` | Initiate Easebuzz payment | POST |
| `/api/validate-coupon` | `app/api/validate-coupon/route.ts` | Validate discount coupon | POST |

### Check-in & Event APIs
| Route | Location | Purpose | Method |
|-------|----------|---------|--------|
| `/api/checkin/scan` | `app/api/checkin/scan/route.ts` | QR code scan processing | POST, GET |
| `/api/health` | `app/api/health/route.ts` | Health check endpoint | GET |
| `/api/scoring/leaderboard` | `app/api/scoring/leaderboard/route.ts` | Get event leaderboard | GET |

### Certificate & Verification APIs
| Route | Location | Purpose | Method |
|-------|----------|---------|--------|
| `/api/certificates/verify` | `app/api/certificates/verify/route.ts` | Verify certificate validity | POST |
| `/verify/[certificateId]` | `app/verify/[certificateId]/page.tsx` | Certificate verification page (dynamic) | GET |

### Forum APIs
| Route | Location | Purpose | Method |
|-------|----------|---------|--------|
| `/api/forum/posts` | `app/api/forum/posts/route.ts` | Forum posts CRUD | GET, POST |

### Dynamic Routes
| Route | Location | Purpose | Method |
|-------|----------|---------|--------|
| `/api/og/[winnerId]` | `app/api/og/[winnerId]/route.ts` | Open Graph image generation | GET |
| `/events/[id]/register` | `app/events/[id]/page.tsx` | Event registration (dynamic) | GET |

---

## 📁 File Structure

```
app/
├── page.tsx                          # Home page
├── layout.tsx                        # Root layout with providers
├── middleware.ts                     # Auth middleware
├── robots.ts                         # SEO robots
├── sitemap.ts                        # XML sitemap
├── globals.css                       # Global styles
├── error.tsx                         # Error boundary
├── loading.tsx                       # Loading state
├── not-found.tsx                     # 404 page
│
├── admin/                            # Admin section
│   ├── layout.tsx                    # Admin layout with sidebar
│   ├── page.tsx                      # Admin dashboard
│   ├── events/page.tsx
│   ├── committees/page.tsx
│   ├── registrations/page.tsx
│   ├── check-in/page.tsx
│   ├── awards/page.tsx
│   ├── gallery/page.tsx
│   ├── team/page.tsx
│   ├── sponsors/page.tsx
│   ├── faqs/page.tsx
│   └── contact/page.tsx
│
├── api/                              # API routes
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   └── me/route.ts
│   ├── register/route.ts
│   ├── registrations/route.ts
│   ├── users/[email]/route.ts
│   ├── user/allocation/route.ts
│   ├── payments/
│   │   ├── razorpay/route.ts
│   │   ├── razorpay/create-order/route.ts
│   │   ├── razorpay/verify/route.ts
│   │   ├── easebuzz/route.ts
│   │   └── easebuzz/initiate/route.ts
│   ├── validate-coupon/route.ts
│   ├── checkin/scan/route.ts
│   ├── health/route.ts
│   ├── scoring/leaderboard/route.ts
│   ├── certificates/verify/route.ts
│   ├── forum/posts/route.ts
│   └── og/[winnerId]/route.ts
│
├── (public pages)
│   ├── about/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── register/event/page.tsx
│   ├── register/success/page.tsx
│   ├── events/page.tsx
│   ├── events/[id]/page.tsx
│   ├── mun/page.tsx
│   ├── lok-sabha/page.tsx
│   ├── rajya-sabha/page.tsx
│   ├── debate/page.tsx
│   ├── youth-parliament/page.tsx
│   ├── dashboard/page.tsx
│   ├── dashboard/documents/page.tsx
│   ├── dashboard/networking/page.tsx
│   ├── committees/page.tsx
│   ├── delegates/page.tsx
│   ├── team/page.tsx
│   ├── sponsors/page.tsx
│   ├── gallery/page.tsx
│   ├── faqs/page.tsx
│   ├── contact/page.tsx
│   ├── alumni/page.tsx
│   ├── results/page.tsx
│   ├── results/[id]/page.tsx
│   ├── speaker-panel/page.tsx
│   ├── chair/layout.tsx
│   ├── chair/page.tsx
│   ├── chair/delegates/page.tsx
│   ├── chair/resources/page.tsx
│   ├── chair/scoring/page.tsx
│   └── verify/[certificateId]/page.tsx

components/
├── navbar.tsx                        # Main navigation
├── footer.tsx                        # Footer
├── providers.tsx                     # Auth/theme providers
├── admin/                            # Admin components
├── registration/                     # Registration form steps
├── results/                          # Results components
├── checkin/                          # Check-in components
└── ui/                               # Reusable UI components

lib/
├── appwrite.ts                       # Appwrite client config
├── auth-context.tsx                  # Auth state management
├── scoring-service.ts                # Scoring logic
├── analytics-service.ts              # Analytics queries
├── certificate-generator.ts          # Certificate generation
├── email-service.ts                  # Email notifications
├── payment-service.ts                # Payment integrations
├── forum-service.ts                  # Forum operations
├── merchandise-service.ts            # Merchandise management
├── ai-service.ts                     # AI features
├── utils.ts                          # Helper functions
└── schema.ts                         # Data schemas with Zod

```

---

## 🔐 Authentication Flow

1. User visits `/login` → `app/login/page.tsx`
2. Login form submits to `/api/auth/login` → `app/api/auth/login/route.ts`
3. API validates credentials and returns auth token
4. Token stored in auth context (`lib/auth-context.tsx`)
5. Protected routes checked via middleware (`app/middleware.ts`)
6. Admin routes checked via `app/admin/layout.tsx`

---

## 📊 Data Flow Examples

### Registration Flow
```
/register/event → /api/register → Appwrite Database → /register/success
```

### Payment Flow
```
/register (payment step) → /api/payments/razorpay/create-order → 
Razorpay Gateway → /api/payments/razorpay/verify → Database Update
```

### Check-in Flow
```
/admin/check-in → QR Scanner → /api/checkin/scan → 
Database Update → CheckInSuccess Animation
```

### Results Flow
```
/admin/awards → Generate Certificates → /api/og/[winnerId] → 
/results/[id] → Share on Social Media
```

---

## 🚀 Key Features by Route

| Feature | Pages | APIs |
|---------|-------|------|
| **Authentication** | `/login` | `/api/auth/*` |
| **Registration** | `/register/*` | `/api/register`, `/api/registrations` |
| **Payments** | `/register` (step 3) | `/api/payments/*` |
| **Event Management** | `/admin/events` | Event APIs |
| **Check-In** | `/admin/check-in` | `/api/checkin/scan` |
| **Awards** | `/admin/awards` | Certificate APIs |
| **Scoring** | `/chair/scoring` | `/api/scoring/leaderboard` |
| **Results** | `/results`, `/results/[id]` | `/api/og/[winnerId]` |

---

## 📝 Notes

- All **admin routes** require authentication + admin role
- **Dynamic routes** use brackets: `[id]`, `[email]`, `[certificateId]`, `[winnerId]`
- **API routes** use `route.ts` naming convention
- **Page routes** use `page.tsx` naming convention
- **Layouts** use `layout.tsx` for nested route structure
- **Middleware** in `app/middleware.ts` protects authenticated routes
- **Environment variables** define database and service configurations

