# Product Requirements Document (PRD)
## Project: Arsenic Summit PWA Website

**Client:** Arsenic (Model United Nations Organization)  
**Domain:** arsenicsummit.org  
**Developed by:** ZOCAV  
**Tech Stack:** Next.js, HeroUI, Appwrite  
**Date:** November 22, 2025  
**Version:** 2.0 (Based on Client Blueprint)

---

## 1. Executive Summary

This document outlines the requirements for the Arsenic Summit PWA website based on the client's blueprint specifications. The website will feature a modern, imperial blue and black color scheme with a structured page flow, unique registration system with 6-digit codes, hierarchical team portal, and gallery showcase.

---

## 2. Design Specifications

### 2.1 Color Scheme
- **Primary:** Imperial Blue (#173E7D)
- **Secondary:** Black (#000000)
- **Accent:** Lighter Blue (#4A90E2) for hover states
- **Text:** White (#FFFFFF) on dark backgrounds
- **Background Variants:** Dark navy shades for depth

### 2.2 UI/UX Requirements
- Clean, modern design
- Smooth scroll animations
- Hover effects (similar to Indraprastha reference)
- Responsive across all devices
- Fast loading with optimized images

---

## 3. Page Structure & Features

### **Page 1: Cover/Homepage**

#### 3.1 Header Section
**Logo & Navigation:**
- Logo positioned at **top left corner**
- Logo is clickable → redirects to homepage
- Navigation menu (desktop): Home, About Us, Committees, Team, Register, Gallery
- Mobile: Hamburger menu

#### 3.2 Hero Section
**Elements:**
1. **"ARSENIC SUMMIT"** - Large, bold heading at top
2. **Background:** High-quality photograph (delegates/conference imagery)
3. **Event Information:**
   - Conference name/tagline
   - **"Register Now"** CTA button (prominent, imperial blue)
   - **Upcoming event dates** clearly displayed
4. **Countdown Timer:**
   - Days, Hours, Minutes, Seconds
   - Dynamic, real-time countdown to event start
   - Styled with imperial blue accents

#### 3.3 About Us Section
- Brief overview of Arsenic Summit
- Mission statement
- Key highlights (number of delegates, committees, past conferences)
- **"Learn More"** CTA linking to detailed About page

**Technical Requirements:**
- Full viewport height hero section
- Parallax scrolling effect on background image
- Responsive countdown that works on all devices
- Optimized image loading (Next.js Image component)

---

### **Page 2: What is MUN & Upcoming Events**

#### 3.4 What is MUN Section
**Content Structure:**
- Heading: "What is Model United Nations?"
- 3-4 paragraph explanation covering:
  - Definition of MUN
  - Educational benefits
  - Skills developed (diplomacy, public speaking, negotiation)
  - How conferences work
- Visual elements: Icons or illustrations
- Engaging layout with text and images

#### 3.5 Upcoming MUN Section
**Elements:**
- Section heading: "Upcoming Conferences"
- Conference card(s) displaying:
  - Event name
  - Dates
  - Venue
  - Brief description
  - Registration status (Open/Closed)
  - **"View Committees"** CTA button

#### 3.6 Committee Preview
- Grid of committee cards
- Each card shows:
  - Committee name
  - Committee logo/icon
  - Brief one-line description
- Click on card → navigates to Page 3 (Committee Details)

**Technical Requirements:**
- Scroll animations (fade-in on view)
- Responsive grid (1 column mobile, 2-3 columns tablet/desktop)
- Smooth page transitions

---

### **Page 3: Committees with Agendas**

#### 3.7 Committee Listing
**Layout:**
- Grid/list of all available committees
- Each committee card includes:
  - Committee name
  - Committee abbreviation
  - Brief description
  - Agenda topic preview
  - Chair information
  - Delegate capacity
  - **"View Details"** button

#### 3.8 Committee Detail Modal/Page
**Popup/Side Panel Effect (similar to Indraprastha):**
- When committee card is clicked:
  - Smooth slide-in or modal popup
  - Detailed information displayed:
    - Full committee name and description
    - Complete agenda details
    - Chair and Vice-Chair profiles (name, photo, bio)
    - Committee size and allocation
    - Background guide download link
    - **"Register for this Committee"** CTA
  - Close button (X) or click outside to return

**Technical Requirements:**
- Smooth CSS transitions for popup effect
- Lazy loading of committee details
- PDF download functionality for background guides
- SEO-friendly URLs for each committee
- Aria labels for accessibility

---

### **Page 4: Meet the Team**

#### 3.9 Team Hierarchy Structure

**Founder Section:**
- Large profile card at top
- Founder photo
- Name and title: "Founder"
- Brief biography (2-3 paragraphs)
- Social media links (LinkedIn, Instagram)

**Executive Section:**
- Heading: "Executive Board"
- Grid of executive cards
- Each executive card:
  - Photo
  - Name
  - Title (e.g., "Secretary General", "Deputy Secretary General")
  - Brief one-liner
  - **Clickable** → Opens new portal/page

**Executive Detail Portal:**
When executive is clicked:
- Navigates to dedicated page OR opens detailed modal
- Shows:
  - Executive's full profile
  - Extended biography
  - **Heads of Departments (HODs) under this executive**
  - HOD cards in grid layout

**HODs Section:**
- Each HOD card:
  - Photo
  - Name
  - Department (e.g., "Logistics", "Public Relations", "Tech")
  - Brief description
  - **Clickable** → Shows Secretariat members

**Secretariat Section:**
When HOD is clicked:
- Displays secretariat members under that HOD
- Grid of secretariat cards:
  - Photo
  - Name
  - Role/Committee
  - Brief description

**Navigation Flow:**
```
Founder (standalone)
    ↓
Executives (grid) → Click Executive
    ↓
    Executive Detail Page
        ↓
        HODs under this Executive (grid) → Click HOD
            ↓
            Secretariat members under this HOD (grid)
```

**Technical Requirements:**
- Nested routing structure:
  - `/team` - Main team page
  - `/team/executive/[id]` - Executive detail with HODs
  - `/team/hod/[id]` - HOD detail with Secretariat
- Breadcrumb navigation for easy back-navigation
- Smooth page transitions
- Responsive cards (1 col mobile, 2-3 col tablet, 3-4 col desktop)
- Hover effects on cards
- Modal option as alternative to page navigation

---

### **Page 5: Registration Portal**

#### 3.10 Registration Form
**Multi-Step Form Structure:**

**Step 1: Personal Information**
- Full Name (First + Last)
- Email Address
- Phone Number (with country code)
- School/College Name
- Grade/Year of Study
- Date of Birth
- Gender

**Step 2: MUN Experience**
- Previous MUN experience (dropdown: None, 1-2, 3-5, 5+)
- Committee preferences (1st, 2nd, 3rd choice)
- Country/Portfolio preferences
- Any special requirements/accommodations

**Step 3: Additional Details**
- Emergency contact name and phone
- Dietary restrictions
- T-shirt size (for delegate kit)
- How did you hear about us?
- Consent checkboxes (terms, privacy policy, photo release)

**Step 4: Payment**
- Registration fee display
- Early bird/regular pricing indicator
- Payment method selection:
  - UPI
  - Credit/Debit Card
  - Net Banking
- Apply coupon code (optional)
- Payment gateway integration (Razorpay/Stripe)

#### 3.11 Unique Registration Code System

**After Successful Registration:**
1. User completes payment
2. System generates **unique 6-digit alphanumeric code** (e.g., AR5K2M)
3. Code is displayed on confirmation screen
4. Code is sent via:
   - Email (with full registration details)
   - SMS (optional)
5. User can download registration confirmation PDF with code

**Code Features:**
- Unique per registration
- Stored in database linked to user profile
- Format: 2 letters (AR for Arsenic) + 4 alphanumeric characters
- Non-sequential for security

#### 3.12 Internal Team Code Verification Portal

**Access Requirements:**
- Separate admin login portal
- Role-based access (only team members with permission)
- Located at `/admin/verify` or similar protected route

**Code Lookup Interface:**
- Input field: "Enter 6-digit registration code"
- Submit button
- Results display:
  - Delegate full name
  - Email and phone
  - School/College
  - Committee preferences
  - Payment status
  - Registration date and time
  - Special requirements
  - Photo (if uploaded)
- Quick actions:
  - Mark as checked-in
  - Send email/SMS to delegate
  - Edit registration details
  - Print badge
  - Export details

**Technical Requirements:**
- Secure authentication for admin portal
- Real-time code validation
- Search history log (audit trail)
- Bulk code verification option
- Export to CSV/Excel
- QR code generation for each registration (optional enhancement)
- Scanner app integration for mobile check-in (optional)

---

### **Page 6: Gallery**

#### 3.13 Past Conferences Gallery

**Layout:**
- Heading: "Past Conferences"
- Filter/Category tabs:
  - All
  - Arsenic Summit 2024
  - Arsenic Summit 2023
  - Opening Ceremony
  - Committee Sessions
  - Social Events
  - Closing Ceremony

**Gallery Grid:**
- Masonry or standard grid layout
- High-quality images optimized for web
- Hover effect: Overlay with event name and date
- Click on image: Opens lightbox view

**Lightbox Features:**
- Full-screen image view
- Navigate between images (prev/next arrows)
- Image caption and date
- Download button (for participants)
- Share on social media
- Close button

**Video Integration:**
- Embedded videos from past conferences
- YouTube/Vimeo embeds
- Video thumbnails in grid
- Play in modal or inline

**Technical Requirements:**
- Lazy loading of images (load as user scrolls)
- Image optimization (Next.js Image, WebP format)
- Responsive grid (1 col mobile, 2-3 col tablet, 3-4 col desktop)
- Album-based organization in CMS
- Admin panel to upload/organize gallery images
- Exif data preservation for photo credits

---

## 4. Additional Pages & Features

### 4.1 Footer (All Pages)
- Quick links: Home, About, Committees, Register, Gallery, Contact
- Social media icons (Instagram, LinkedIn, Facebook, Twitter)
- Contact information (email, phone)
- Copyright notice
- Privacy Policy and Terms & Conditions links

### 4.2 Contact Page
- Contact form:
  - Name, Email, Phone, Subject, Message
  - Submit button
- Alternative contact methods:
  - Email addresses (info@, support@)
  - Phone numbers
  - WhatsApp business link
  - Office address (if applicable)
- Google Maps embed for venue/office location
- FAQ section

### 4.3 FAQ Section
- Accordion-style expandable questions
- Categories:
  - General
  - Registration
  - Committees
  - Payment
  - Logistics
- Search functionality

---

## 5. Progressive Web App (PWA) Features

### 5.1 Installability
- Web app manifest with Arsenic branding
- Custom app icons (imperial blue and black theme)
- Splash screen
- Installable on iOS, Android, desktop
- "Add to Home Screen" prompt

### 5.2 Offline Functionality
- Service worker caching strategy
- Offline access to:
  - Committee information
  - Team profiles
  - Gallery (cached images)
  - Registration confirmation (if saved)
- Offline indicator when no connection

### 5.3 Push Notifications
- Registration confirmation notification
- Committee allocation announcement
- Schedule reminders
- Important updates
- Pre-conference checklist reminders

### 5.4 Performance
- Lighthouse score target: 90+ (Performance, Accessibility, Best Practices, SEO)
- Fast initial load (<2 seconds)
- Smooth animations (60fps)
- Optimized images and assets

---

## 6. Backend & Database Structure (Appwrite)

### 6.1 Collections

**Users Collection:**
- userId (unique)
- email
- phoneNumber
- fullName
- role (delegate, admin, team)
- registrationCode (6-digit)
- registrationDate
- paymentStatus
- committeeAssignment
- preferences

**Committees Collection:**
- committeeId
- name
- abbreviation
- description
- agenda
- chairName
- chairBio
- chairPhoto
- viceChairName
- capacity
- backgroundGuideUrl

**Team Collection:**
- memberId
- name
- role (founder, executive, hod, secretariat)
- parentId (for hierarchy)
- photo
- bio
- socialLinks
- department
- order (for display sorting)

**Registrations Collection:**
- registrationId
- userId (foreign key)
- registrationCode (unique, indexed)
- personalInfo (JSON)
- preferences (JSON)
- paymentInfo (JSON)
- checkInStatus
- checkInTime

**Gallery Collection:**
- photoId
- imageUrl
- caption
- eventDate
- category (album)
- uploadedBy
- uploadDate

### 6.2 Authentication
- Email/password
- Magic link (passwordless)
- Social OAuth (Google, optional)
- Two-factor authentication (for admin)

### 6.3 Storage
- Profile photos
- Committee background guides (PDFs)
- Gallery images and videos
- Registration receipts/invoices

### 6.4 Realtime
- Live registration counter
- Real-time countdown timer sync
- Admin dashboard live updates

---

## 7. Admin Panel Features

### 7.1 Dashboard
- Total registrations counter
- Revenue tracking
- Committee-wise breakdown
- Recent registrations list
- Payment status overview
- Quick actions

### 7.2 Registration Management
- View all registrations (table view)
- Filter by:
  - Payment status
  - Committee preference
  - Registration date
  - School/College
- Search by:
  - Name
  - Email
  - Registration code
- Actions:
  - View full details
  - Edit registration
  - Resend confirmation
  - Mark paid/unpaid
  - Assign committee
  - Delete registration

### 7.3 Code Verification Tool
- Input: Registration code
- Output: Full delegate profile
- Quick actions (as described in 3.12)

### 7.4 Committee Management
- CRUD operations for committees
- Assign chairs
- Upload background guides
- Set capacity limits
- View registrations per committee

### 7.5 Team Management
- Add/edit/delete team members
- Manage hierarchy (founder → executive → HOD → secretariat)
- Upload photos and bios
- Reorder team members

### 7.6 Content Management
- Edit homepage content
- Manage "What is MUN" section
- Update event dates and countdown
- Edit FAQs
- Manage announcements

### 7.7 Gallery Management
- Bulk upload images
- Create/manage albums
- Add captions
- Organize by event
- Delete images

### 7.8 Communication Tools
- Send bulk emails to all/filtered registrants
- SMS notifications (optional)
- Push notification sender
- Email templates

### 7.9 Reports & Analytics
- Registration timeline graph
- Payment collection report
- Committee popularity stats
- Export options (CSV, Excel, PDF)

---

## 8. Technical Architecture

### 8.1 Frontend
- **Framework:** Next.js 14+ (App Router)
- **UI Library:** HeroUI components
- **Styling:** Tailwind CSS (custom imperial blue theme)
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **State Management:** Zustand or React Context
- **Icons:** Lucide React or Heroicons

### 8.2 Backend
- **BaaS:** Appwrite
  - Authentication
  - Database (NoSQL)
  - Storage
  - Realtime
  - Functions (for code generation logic)

### 8.3 Payment Integration
- **Gateway:** Razorpay (preferred for India) or Stripe
- **Features:**
  - Multiple payment methods
  - Webhook for payment status
  - Invoice generation
  - Refund processing

### 8.4 Deployment
- **Hosting:** Vercel (optimized for Next.js)
- **CDN:** Vercel Edge Network
- **CI/CD:** Automatic deployment from Git
- **Environment:** Development, Staging, Production

### 8.5 Domain & SSL
- Domain: arsenicsummit.org
- SSL certificate (automatic via Vercel)
- Custom domain configuration

---

## 9. Security Requirements

### 9.1 Authentication Security
- Password hashing (Argon2)
- Session management
- JWT token authentication
- Admin role-based access control (RBAC)
- Two-factor authentication for admin

### 9.2 Data Security
- HTTPS everywhere
- No payment data stored (handled by gateway)
- Encrypted sensitive data
- Regular backups
- GDPR compliance

### 9.3 Input Validation
- Frontend validation (React Hook Form)
- Backend validation (Appwrite rules)
- SQL injection prevention
- XSS protection
- CSRF tokens

### 9.4 Rate Limiting
- API rate limiting (prevent abuse)
- Registration spam prevention
- Contact form rate limiting

---

## 10. User Flows

### 10.1 Delegate Registration Flow
1. User visits homepage
2. Clicks "Register Now"
3. Fills multi-step form (4 steps)
4. Reviews information
5. Proceeds to payment
6. Completes payment
7. Receives **6-digit registration code**
8. Gets confirmation email with code and details
9. Can access delegate dashboard with code

### 10.2 Team Member Browsing Flow
1. User clicks "Meet the Team"
2. Sees founder profile at top
3. Scrolls to executive board grid
4. Clicks on an executive
5. Navigates to executive detail page
6. Sees HODs under that executive
7. Clicks on a HOD
8. Sees secretariat members under that HOD
9. Uses breadcrumb to navigate back

### 10.3 Committee Exploration Flow
1. User navigates to "Committees" page
2. Sees grid of all committees
3. Hovers over committee card (see preview)
4. Clicks on committee
5. Popup/side panel slides in with full details
6. Reads agenda, chair info
7. Downloads background guide (optional)
8. Clicks "Register for this Committee"
9. Directed to registration form with committee pre-selected

### 10.4 Admin Code Verification Flow
1. Admin logs into admin panel
2. Navigates to "Verify Registration"
3. Delegate provides their 6-digit code
4. Admin enters code in search field
5. System displays full registration details
6. Admin marks delegate as checked-in
7. System logs the check-in with timestamp

---

## 11. Design Mockup Requirements

### 11.1 Homepage Mockup
- Hero section with background image
- Logo placement
- Navigation menu
- Countdown timer design
- CTA buttons styling
- About Us preview section
- Footer

### 11.2 Committee Cards Mockup
- Card layout and sizing
- Hover effect design
- Popup/modal design (similar to Indraprastha)
- Typography and spacing

### 11.3 Team Page Mockup
- Hierarchical layout
- Card designs for founder/executive/HOD/secretariat
- Detail page/modal design
- Navigation structure

### 11.4 Registration Form Mockup
- Multi-step progress indicator
- Form field designs
- Button styles
- Success screen with 6-digit code display

### 11.5 Mobile Responsive Mockups
- Mobile navigation (hamburger menu)
- Stacked layouts for small screens
- Touch-friendly buttons
- Responsive tables and cards

---

## 12. Content Requirements from Client

### 12.1 Text Content Needed
- [ ] Arsenic Summit description and tagline
- [ ] Founder bio and photo
- [ ] Executive profiles (name, title, bio, photo)
- [ ] HOD profiles (name, department, bio, photo)
- [ ] Secretariat member details
- [ ] Committee names, descriptions, agendas
- [ ] Chair and Vice-Chair bios
- [ ] "What is MUN" content
- [ ] About Us content
- [ ] FAQ questions and answers
- [ ] Contact information
- [ ] Terms & Conditions
- [ ] Privacy Policy

### 12.2 Visual Assets Needed
- [ ] Arsenic Summit logo (high resolution, transparent background)
- [ ] Favicon
- [ ] Hero background images (high quality)
- [ ] Committee icons/logos
- [ ] Team member photos (professional headshots)
- [ ] Past conference gallery photos
- [ ] Videos (if available)
- [ ] App icons for PWA (512x512, 192x192)

### 12.3 Documents Needed
- [ ] Committee background guides (PDFs)
- [ ] Registration form template/fields list
- [ ] Payment terms and pricing
- [ ] Conference schedule (for countdown)

---

## 13. Timeline & Milestones

### Phase 1: Design & Planning (Week 1-2)
- [ ] Finalize PRD with client
- [ ] Gather all content and assets
- [ ] Create wireframes
- [ ] Design high-fidelity mockups
- [ ] Client approval on designs
- [ ] Set up project repository

### Phase 2: Core Development (Week 3-5)
- [ ] Next.js project setup
- [ ] HeroUI integration and theming
- [ ] Appwrite backend configuration
- [ ] Homepage implementation
- [ ] What is MUN page
- [ ] Committee pages with popup effect
- [ ] Team hierarchy pages
- [ ] Gallery implementation
- [ ] Responsive design

### Phase 3: Registration System (Week 6-7)
- [ ] Multi-step registration form
- [ ] 6-digit code generation logic
- [ ] Payment gateway integration
- [ ] Email/SMS notification system
- [ ] Registration confirmation page
- [ ] Admin code verification portal

### Phase 4: Admin Panel (Week 8-9)
- [ ] Admin authentication
- [ ] Dashboard with analytics
- [ ] Registration management
- [ ] Committee management
- [ ] Team management
- [ ] Gallery management
- [ ] Content management
- [ ] Communication tools

### Phase 5: PWA & Polish (Week 10-11)
- [ ] Service worker implementation
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Accessibility improvements
- [ ] Cross-browser testing

### Phase 6: Testing & Launch (Week 12-13)
- [ ] Comprehensive testing (functional, security, performance)
- [ ] User acceptance testing (UAT)
- [ ] Bug fixes
- [ ] Content population
- [ ] Domain configuration
- [ ] Production deployment
- [ ] Launch!

---

## 14. Success Metrics

### 14.1 Technical KPIs
- [ ] Lighthouse score ≥90 across all categories
- [ ] Page load time <2 seconds
- [ ] Mobile usability score 100%
- [ ] Zero critical security vulnerabilities
- [ ] 99.9% uptime

### 14.2 Business KPIs
- [ ] Registration conversion rate ≥15%
- [ ] Form completion rate ≥85%
- [ ] Payment success rate ≥95%
- [ ] PWA installation rate ≥20% of users
- [ ] Average session duration ≥3 minutes
- [ ] Bounce rate ≤40%

### 14.3 User Experience KPIs
- [ ] Admin task completion without training ≥90%
- [ ] Code verification speed <5 seconds
- [ ] Zero registration errors
- [ ] User satisfaction rating ≥4.5/5

---

## 15. Budget Estimate

### 15.1 Development Costs
| Item | Cost (INR) |
|------|-----------|
| Frontend Development (Next.js + HeroUI) | ₹1,50,000 |
| Backend Development (Appwrite setup) | ₹80,000 |
| Registration System + Code Generation | ₹70,000 |
| Admin Panel | ₹90,000 |
| Team Hierarchy Portal | ₹50,000 |
| Gallery Implementation | ₹30,000 |
| PWA Features | ₹40,000 |
| UI/UX Design | ₹60,000 |
| Testing & QA | ₹40,000 |
| **Total Development** | **₹6,10,000** |

### 15.2 Annual Services
| Service | Cost (INR/year) |
|---------|----------------|
| Domain (arsenicsummit.org) | ₹1,500 |
| Vercel Hosting (Pro) | ₹24,000 |
| Appwrite Cloud | ₹0 - ₹48,000 |
| Payment Gateway (transaction fees) | Variable (2-3%) |
| Email Service (SendGrid) | ₹12,000 |
| SSL Certificate | ₹0 (included) |
| **Total Annual** | **₹37,500 - ₹85,500** |

---

## 16. Deliverables

### 16.1 For Client
- [ ] Fully functional PWA website
- [ ] Admin panel access with credentials
- [ ] User documentation (admin guide, user guide)
- [ ] Video tutorials for admin panel
- [ ] Source code repository access
- [ ] Technical documentation
- [ ] Deployment and maintenance guide

### 16.2 Post-Launch Support
- 30 days of free bug fixes
- Training session for admin team (2 hours)
- Monthly maintenance plan (optional)
- Feature enhancement proposals

---

## 17. Acceptance Criteria

### 17.1 Functional Requirements
- ✅ All pages load correctly with proper content
- ✅ Registration form works end-to-end with payment
- ✅ 6-digit code generated and sent after registration
- ✅ Code verification portal works for admin
- ✅ Team hierarchy navigation works (founder → executive → HOD → secretariat)
- ✅ Committee popup/side panel works smoothly
- ✅ Gallery displays images with lightbox
- ✅ Countdown timer works and syncs
- ✅ PWA is installable on all platforms
- ✅ Push notifications deliver successfully
- ✅ Admin panel allows full content/user management

### 17.2 Design Requirements
- ✅ Imperial blue and black color scheme applied throughout
- ✅ Responsive design on all devices (320px - 2560px)
- ✅ Smooth animations and hover effects
- ✅ Consistent typography and spacing
- ✅ Accessible design (WCAG AA compliant)

### 17.3 Performance Requirements
- ✅ Lighthouse Performance score ≥90
- ✅ First Contentful Paint <1.5s
- ✅ Time to Interactive <3.5s
- ✅ No console errors
- ✅ Images optimized (WebP format)

---

## 18. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Client content delays | Medium | Set hard deadlines, use placeholder content initially |
| Payment gateway integration issues | High | Test thoroughly in sandbox, have backup gateway ready |
| Unique code generation conflicts | Medium | Use UUID-based generation, database constraints, testing |
| Design approval delays | Medium | Iterative approval process, regular check-ins |
| Browser compatibility issues | Low | Cross-browser testing, polyfills, progressive enhancement |
| Performance on mobile | Medium | Mobile-first development, optimization, PWA caching |

---

## 19. Appendix

### 19.1 Reference Materials
- Blueprint document: BLUE-PRINT-WEBSITE-1-.docx_20251121_185459_0000.pdf
- Competitor reference: altior.in/delhi/home
- Indraprastha MUN (for popup effects reference)

### 19.2 Technical Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [HeroUI Components](https://heroui.com/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Razorpay Integration Guide](https://razorpay.com/docs)

### 19.3 Contact Information
- **ZOCAV Project Manager:** [Name, Email, Phone]
- **Arsenic Primary Contact:** [Name, Email, Phone]
- **Technical Lead:** [Name, Email, Phone]

---

## Document Approval

**Prepared by:** ZOCAV Development Team  
**Date:** November 22, 2025  
**Version:** 2.0 (Based on Client Blueprint)

**Client Approval:**
- [ ] Approved by: _________________ (Arsenic Representative)
- [ ] Date: _________________
- [ ] Signature: _________________

---

## Next Steps
1. Client review and approval of this PRD
2. Provide all content and assets (Section 12)
3. Kickoff meeting to finalize timeline
4. Begin design phase
