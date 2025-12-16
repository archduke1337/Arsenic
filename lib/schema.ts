import { z } from "zod";

// Collection IDs
export const COLLECTIONS = {
    USERS: "users",
    REGISTRATIONS: "registrations",
    EVENTS: "events",
    COMMITTEES: "committees",
    TEAM_MEMBERS: "team_members",
    SPONSORS: "sponsors",
    GALLERY: "gallery",
    ALBUMS: "albums",
    FAQS: "faqs",
    CONTACT_SUBMISSIONS: "contact_submissions",
    AWARDS: "awards",
    SPEAKER_UPDATES: "speaker_updates",
    SCORES: "scores",
    ATTENDANCE: "attendance",
    COUPONS: "coupons",
    ALUMNI: "alumni",
    PAYMENTS: "payments",
    FORUM_POSTS: "forum_posts",
    FORUM_REPLIES: "forum_replies",
    MERCHANDISE: "merchandise",
    MERCHANDISE_ORDERS: "merchandise_orders",
    DOCUMENTS: "documents",
} as const;

// Event Types
export const EVENT_TYPES = ["MUN", "LOK_SABHA", "RAJYA_SABHA", "DEBATE", "YOUTH_PARLIAMENT"] as const;

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
    MUN: "Model United Nations",
    LOK_SABHA: "Lok Sabha",
    RAJYA_SABHA: "Rajya Sabha",
    DEBATE: "Debate Championship",
    YOUTH_PARLIAMENT: "Youth Parliament",
};

export type EventType = (typeof EVENT_TYPES)[number];

// User Roles
export const USER_ROLES = ["delegate", "admin", "speaker", "chairperson"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ADMIN_EMAILS = ["gauravramyadav@gmail.com"];

export function isAdmin(email: string | undefined): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email);
}

// ============================================
// ENHANCED SCHEMAS
// ============================================

// Event Theme Schema
export const eventThemeSchema = z.object({
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    accentColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    bannerUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
});

// Fee Structure Schema
export const feeStructureSchema = z.object({
    baseFee: z.number(),
    earlyBirdPercentage: z.number().optional(),
    earlyBirdDeadline: z.string().optional(),
    groupDiscounts: z.array(z.object({
        tier: z.number(),
        percentage: z.number(),
    })).optional(),
    customTiers: z.array(z.object({
        minDelegates: z.number(),
        discount: z.number(),
    })).optional(),
});

// Payment Config Schema
export const paymentConfigSchema = z.object({
    razorpay: z.boolean().default(true),
    easebuzz: z.boolean().default(false),
    autoFallback: z.boolean().default(false),
});

// Event Settings Schema
export const eventSettingsSchema = z.object({
    allowDoubleDelegation: z.boolean().default(false),
    hybridMode: z.boolean().default(false),
    internationalDelegates: z.boolean().default(false),
    merchandiseUpsell: z.boolean().default(false),
});

// Enhanced Event Schema
export const eventSchema = z.object({
    name: z.string(),
    type: z.enum(EVENT_TYPES),
    description: z.string(),
    agenda: z.string().optional(),
    backgroundGuideUrl: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    registrationDeadline: z.string().optional(),
    portfolioReleaseDate: z.string().optional(),
    fees: z.number().default(0),
    capacity: z.number().optional(),
    venue: z.string().optional(),
    imageUrl: z.string().optional(),
    isActive: z.boolean().default(true),
    // Theme
    theme: eventThemeSchema.optional(),
    // Fee Structure (JSON string)
    feeStructure: z.string().optional(),
    // Payment & Settings (JSON strings)
    paymentConfig: z.string().optional(),
    settings: z.string().optional(),
});

// MUN-specific data
export const munDataSchema = z.object({
    countries: z.array(z.object({
        name: z.string(),
        flag: z.string(),
        isDouble: z.boolean().default(false),
    })),
    difficultyTag: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

// Lok Sabha-specific data
export const lokSabhaDataSchema = z.object({
    state: z.string(),
    reservationType: z.enum(['General', 'SC', 'ST']),
    parties: z.array(z.object({
        name: z.string(),
        seatShare: z.number(),
    })),
    portfolios: z.array(z.object({
        role: z.enum(['PM', 'HM', 'FM', 'Speaker', 'Member']),
        assignedTo: z.string().optional(),
    })).optional(),
});

// Rajya Sabha-specific data
export const rajyaSabhaDataSchema = z.object({
    stateUT: z.string(),
    seatsAvailable: z.number(),
    partyAllocation: z.array(z.object({
        party: z.string(),
        seats: z.number(),
    })),
    nominatedMembers: z.array(z.string()).optional(),
});

// Debate-specific data
export const debateDataSchema = z.object({
    type: z.enum(['PD', 'Turncoat', 'Extempore']),
    topics: z.array(z.string()),
    formatRules: z.string(),
    adjudicators: z.array(z.object({
        name: z.string(),
        expertise: z.string().optional(),
    })).optional(),
});

// Enhanced Committee Schema (Format-Aware)
export const committeeSchema = z.object({
    name: z.string(),
    abbreviation: z.string(),
    type: z.string(),
    eventType: z.enum(EVENT_TYPES),
    description: z.string(),
    agenda: z.string().optional(),
    backgroundGuideUrl: z.string().optional(),
    chairperson: z.string().optional(),
    viceChairperson: z.string().optional(),
    rapporteur: z.string().optional(),
    portfolios: z.array(z.string()),
    capacity: z.number(),
    imageUrl: z.string().optional(),
    linkedEventId: z.string().optional(),
    difficultyTag: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    // Format-specific data (stored as JSON strings in Appwrite)
    munData: z.string().optional(), // JSON string
    lokSabhaData: z.string().optional(), // JSON string
    rajyaSabhaData: z.string().optional(), // JSON string
    debateData: z.string().optional(), // JSON string
});

// Enhanced Registration Schema
export const registrationSchema = z.object({
    userId: z.string(),
    eventId: z.string(),
    code: z.string().min(1).optional(), // Generated if not provided
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    institution: z.string().optional(),
    grade: z.string().optional(),
    city: z.string().optional(),
    age: z.number().optional(),
    committeePreferences: z.array(z.string()).default([]),
    assignedCommittee: z.string().optional(),
    assignedPortfolio: z.string().optional(),
    paymentStatus: z.enum(["pending", "paid", "refunded", "failed"]).default("pending"),
    paymentAmount: z.number().optional(),
    status: z.enum(["pending", "confirmed", "cancelled"]).default("pending"),
    // Check-in system
    checkedIn: z.boolean().default(false),
    checkedInAt: z.string().optional(),
    qrCode: z.string().optional(),
    // Timestamps
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

// Enhanced Team Member Schema (Hierarchical)
export const teamMemberSchema = z.object({
    name: z.string(),
    role: z.string(),
    position: z.enum(["founder", "executive_board", "hod", "secretariat", "subhead", "organizing_committee"]),
    department: z.string().optional(),
    parentId: z.string().optional(), // For hierarchical structure
    bio: z.string().optional(),
    imageUrl: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    socials: z.object({
        linkedin: z.string().optional(),
        twitter: z.string().optional(),
        instagram: z.string().optional(),
    }).optional(),
    displayOrder: z.number().optional(),
});

// Enhanced Gallery Schema
export const galleryImageSchema = z.object({
    imageUrl: z.string(),
    thumbnailUrl: z.string().optional(),
    albumId: z.string().optional(),
    eventType: z.string(),
    conference: z.string().optional(),
    customTags: z.array(z.string()).optional(),
    year: z.string(),
    caption: z.string().optional(),
    featured: z.boolean().optional(),
    uploadedBy: z.string().optional(),
    displayOrder: z.number().optional(),
});

// ============================================
// NEW COLLECTION SCHEMAS
// ============================================

// Albums Schema
export const albumSchema = z.object({
    name: z.string(),
    slug: z.string(),
    eventType: z.string(),
    coverImageUrl: z.string().optional(),
    description: z.string().optional(),
    year: z.string(),
    displayOrder: z.number().optional(),
});

// Sponsors Schema
export const sponsorSchema = z.object({
    tier: z.enum(['title', 'platinum', 'gold', 'silver']),
    name: z.string(),
    logoUrl: z.string(),
    websiteUrl: z.string().optional(),
    displayOrder: z.number().optional(),
    isActive: z.boolean().default(true),
});

// Scores Schema (for ranking and leaderboards)
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

// Attendance Schema (for check-in tracking)
export const attendanceSchema = z.object({
    registrationId: z.string(),
    eventId: z.string(),
    committeeId: z.string().optional(),
    checkedInAt: z.string(),
    checkedInBy: z.string().optional(),
    checkOutTime: z.string().optional(),
    attendanceStatus: z.enum(['present', 'absent', 'late', 'excused']).default('present'),
});

// Coupons Schema (for discount management)
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

// Alumni Schema
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

// Awards Schema
export const awardSchema = z.object({
    eventId: z.string(),
    category: z.string(),
    awardType: z.enum(['best_delegate', 'high_commendation', 'special_mention', 'best_delegation', 'verbal_mention']),
    recipientName: z.string(),
    school: z.string(),
    committee: z.string().optional(),
    position: z.number().optional(),
    certificateUrl: z.string().optional(),
    isPublished: z.boolean().default(false),
});

// FAQs Schema
export const faqSchema = z.object({
    category: z.string(),
    question: z.string(),
    answer: z.string(),
    displayOrder: z.number().optional(),
    isActive: z.boolean().default(true),
});

// Speaker Updates Schema
export const speakerUpdateSchema = z.object({
    committeeId: z.string(),
    speakerId: z.string(),
    type: z.enum(['crisis', 'gavel', 'mention', 'announcement']),
    content: z.string(),
    timestamp: z.string(),
});

// Contact Submissions Schema
export const contactSubmissionSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    subject: z.string(),
    message: z.string(),
    status: z.enum(['new', 'read', 'replied', 'archived']).default('new'),
});

// Payments Schema
export const paymentSchema = z.object({
    registrationId: z.string(),
    amount: z.number(),
    currency: z.string(),
    gateway: z.enum(['razorpay', 'easebuzz']),
    transactionId: z.string(),
    status: z.enum(['pending', 'success', 'failed', 'refunded']),
    invoiceUrl: z.string().optional(),
    createdAt: z.string(),
});

// Forum Schemas
export const forumPostSchema = z.object({
    committeeId: z.string(),
    eventId: z.string(),
    authorId: z.string(),
    authorName: z.string(),
    title: z.string(),
    content: z.string(),
    category: z.enum(['discussion', 'resource', 'question', 'announcement']),
    replies: z.number().default(0),
    views: z.number().default(0),
    likes: z.number().default(0),
    isPinned: z.boolean().default(false),
    isLocked: z.boolean().default(false),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const forumReplySchema = z.object({
    postId: z.string(),
    authorId: z.string(),
    authorName: z.string(),
    content: z.string(),
    likes: z.number().default(0),
    isAnswer: z.boolean().default(false),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// Merchandise Schemas
export const merchandiseItemSchema = z.object({
    name: z.string(),
    description: z.string(),
    category: z.enum(['tshirt', 'badge', 'certificate', 'mug', 'other']),
    price: z.number(),
    quantity: z.number(),
    imageUrl: z.string(),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    eventId: z.string().optional(),
    isAvailable: z.boolean(),
});

export const merchandiseOrderSchema = z.object({
    userId: z.string(),
    // stored as JSON string in Appwrite usually, but kept object here for type inference if used with transformation
    items: z.array(z.object({
        itemId: z.string(),
        quantity: z.number(),
        size: z.string().optional(),
        color: z.string().optional()
    })),
    totalAmount: z.number(),
    // complex object likely stored as JSON string
    shippingAddress: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        pincode: z.string(),
        phone: z.string()
    }),
    status: z.enum(['pending', 'processing', 'shipped', 'delivered']),
    createdAt: z.string(),
    deliveryDate: z.string().optional(),
});

// Document Schema (for resolutions, bills, position papers)
export const documentSchema = z.object({
    authorId: z.string(),
    authorName: z.string(),
    authorEmail: z.string().email(),
    title: z.string(),
    type: z.enum(['resolution', 'position_paper', 'bill', 'amendment']),
    content: z.string(),
    status: z.enum(['draft', 'submitted', 'reviewed', 'approved', 'rejected']).default('draft'),
    feedback: z.string().optional(),
    committeeId: z.string().optional(),
    eventId: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type Event = z.infer<typeof eventSchema>;
export type EventTheme = z.infer<typeof eventThemeSchema>;
export type FeeStructure = z.infer<typeof feeStructureSchema>;
export type PaymentConfig = z.infer<typeof paymentConfigSchema>;
export type EventSettings = z.infer<typeof eventSettingsSchema>;

export type Committee = z.infer<typeof committeeSchema>;
export type MUNData = z.infer<typeof munDataSchema>;
export type LokSabhaData = z.infer<typeof lokSabhaDataSchema>;
export type RajyaSabhaData = z.infer<typeof rajyaSabhaDataSchema>;
export type DebateData = z.infer<typeof debateDataSchema>;

export type Registration = z.infer<typeof registrationSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type GalleryImage = z.infer<typeof galleryImageSchema>;

export type Album = z.infer<typeof albumSchema>;
export type Sponsor = z.infer<typeof sponsorSchema>;
export type Award = z.infer<typeof awardSchema>;
export type FAQ = z.infer<typeof faqSchema>;
export type SpeakerUpdate = z.infer<typeof speakerUpdateSchema>;
export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
export type Score = z.infer<typeof scoreSchema>;
export type Attendance = z.infer<typeof attendanceSchema>;
export type Coupon = z.infer<typeof couponSchema>;
export type Alumni = z.infer<typeof alumniSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type ForumPost = z.infer<typeof forumPostSchema>;
export type ForumReply = z.infer<typeof forumReplySchema>;
export type MerchandiseItem = z.infer<typeof merchandiseItemSchema>;
export type MerchandiseOrder = z.infer<typeof merchandiseOrderSchema>;
export type Document = z.infer<typeof documentSchema>;
