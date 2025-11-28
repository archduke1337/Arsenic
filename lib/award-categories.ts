// Award categories for different event types

export const MUN_AWARDS = [
    'BEST_DELEGATE',
    'HIGH_COMMENDATION',
    'SPECIAL_MENTION',
    'VERBAL_MENTION',
    'BEST_POSITION_PAPER',
    'BEST_CRISIS_MANAGEMENT',
] as const;

export const LOK_SABHA_AWARDS = [
    'BEST_MP',
    'BEST_OPPOSITION_MP',
    'BEST_MAIDEN_SPEAKER',
    'BEST_QUESTION_HOUR',
    'BEST_POINT_OF_ORDER',
    'SPEAKER_EXCELLENCE',
] as const;

export const RAJYA_SABHA_AWARDS = [
    'BEST_RS_MEMBER',
    'BEST_NOMINATED_MEMBER',
    'BEST_DEBATE_PERFORMANCE',
    'BEST_LEGISLATIVE_CONTRIBUTION',
] as const;

export const DEBATE_AWARDS = [
    'BEST_SPEAKER',
    'BEST_INTERJECTOR',
    'BEST_REBUTTAL',
    'WINNER_TEAM',
    'RUNNER_UP_TEAM',
    'BEST_CROSS_EXAMINATION',
] as const;

export const YOUTH_PARLIAMENT_AWARDS = [
    'BEST_PARLIAMENTARIAN',
    'BEST_BILL_PRESENTATION',
    'RISING_STAR',
    'BEST_TEAM_COLLABORATION',
] as const;

export const AWARD_CATEGORIES = {
    MUN: MUN_AWARDS,
    LOK_SABHA: LOK_SABHA_AWARDS,
    RAJYA_SABHA: RAJYA_SABHA_AWARDS,
    DEBATE: DEBATE_AWARDS,
    YOUTH_PARLIAMENT: YOUTH_PARLIAMENT_AWARDS,
} as const;

export const AWARD_LABELS: Record<string, string> = {
    // MUN
    BEST_DELEGATE: 'Best Delegate',
    HIGH_COMMENDATION: 'High Commendation',
    SPECIAL_MENTION: 'Special Mention',
    VERBAL_MENTION: 'Verbal Mention',
    BEST_POSITION_PAPER: 'Best Position Paper',
    BEST_CRISIS_MANAGEMENT: 'Best Crisis Management',

    // Lok Sabha
    BEST_MP: 'Best Member of Parliament',
    BEST_OPPOSITION_MP: 'Best Opposition MP',
    BEST_MAIDEN_SPEAKER: 'Best Maiden Speaker',
    BEST_QUESTION_HOUR: 'Best Question Hour Performance',
    BEST_POINT_OF_ORDER: 'Best Point of Order',
    SPEAKER_EXCELLENCE: 'Speaker Excellence Award',

    // Rajya Sabha
    BEST_RS_MEMBER: 'Best Rajya Sabha Member',
    BEST_NOMINATED_MEMBER: 'Best Nominated Member',
    BEST_DEBATE_PERFORMANCE: 'Best Debate Performance',
    BEST_LEGISLATIVE_CONTRIBUTION: 'Best Legislative Contribution',

    // Debate
    BEST_SPEAKER: 'Best Speaker',
    BEST_INTERJECTOR: 'Best Interjector',
    BEST_REBUTTAL: 'Best Rebuttal',
    WINNER_TEAM: 'Winner',
    RUNNER_UP_TEAM: 'Runner-up',
    BEST_CROSS_EXAMINATION: 'Best Cross Examination',

    // Youth Parliament
    BEST_PARLIAMENTARIAN: 'Best Parliamentarian',
    BEST_BILL_PRESENTATION: 'Best Bill Presentation',
    RISING_STAR: 'Rising Star',
    BEST_TEAM_COLLABORATION: 'Best Team Collaboration',
};

export type AwardCategory =
    | typeof MUN_AWARDS[number]
    | typeof LOK_SABHA_AWARDS[number]
    | typeof RAJYA_SABHA_AWARDS[number]
    | typeof DEBATE_AWARDS[number]
    | typeof YOUTH_PARLIAMENT_AWARDS[number];

export function getAwardCategoriesForEvent(eventType: string): readonly string[] {
    const key = eventType as keyof typeof AWARD_CATEGORIES;
    return AWARD_CATEGORIES[key] || [];
}

export function getAwardLabel(category: string): string {
    return AWARD_LABELS[category] || category.replace(/_/g, ' ');
}

// Award tier colors for display
export const AWARD_TIER_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
    BEST_DELEGATE: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', gradient: 'from-yellow-400 to-orange-500' },
    HIGH_COMMENDATION: { bg: 'bg-purple-500/20', text: 'text-purple-400', gradient: 'from-purple-400 to-pink-500' },
    SPECIAL_MENTION: { bg: 'bg-blue-500/20', text: 'text-blue-400', gradient: 'from-blue-400 to-cyan-500' },
    VERBAL_MENTION: { bg: 'bg-green-500/20', text: 'text-green-400', gradient: 'from-green-400 to-emerald-500' },
    BEST_SPEAKER: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', gradient: 'from-yellow-400 to-orange-500' },
    WINNER_TEAM: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', gradient: 'from-yellow-400 to-orange-500' },
    RUNNER_UP_TEAM: { bg: 'bg-gray-500/20', text: 'text-gray-300', gradient: 'from-gray-400 to-gray-600' },
};

export function getAwardTierColor(category: string) {
    return AWARD_TIER_COLORS[category] || {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        gradient: 'from-blue-400 to-purple-500'
    };
}
