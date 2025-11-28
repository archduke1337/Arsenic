import { databases, Query } from '@/lib/appwrite';


export interface AnalyticsData {
  registrationStats: {
    total: number;
    byEvent: Record<string, number>;
    byCommittee: Record<string, number>;
    conversionRate: number;
  };
  revenueStats: {
    totalRevenue: number;
    byPaymentGateway: Record<string, number>;
    averagePerRegistration: number;
    refunds: number;
  };
  participantDemographics: {
    byInstitution: Record<string, number>;
    byCity: Record<string, number>;
    byRole: Record<string, number>;
    retentionRate: number;
  };
}

/**
 * Get registration analytics
 */
export async function getRegistrationAnalytics(eventId?: string): Promise<{
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  byEvent: Record<string, number>;
  byCommittee: Record<string, number>;
  conversionRate: number;
  growth: Array<{ date: string; count: number }>;
}> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    const filters = eventId ? [`eventId == "${eventId}"`] : [];
    const registrations = await databases.listDocuments(
      databaseId,
      'registrations',
      [...filters, Query.limit(10000)]
    );

    const stats = {
      total: registrations.documents.length,
      confirmed: registrations.documents.filter((r) => r.status === 'confirmed').length,
      pending: registrations.documents.filter((r) => r.status === 'pending').length,
      cancelled: registrations.documents.filter((r) => r.status === 'cancelled').length,
      byEvent: {} as Record<string, number>,
      byCommittee: {} as Record<string, number>,
      conversionRate: 0,
      growth: [] as Array<{ date: string; count: number }>,
    };

    // Group by event and committee
    for (const reg of registrations.documents) {
      stats.byEvent[reg.eventId] = (stats.byEvent[reg.eventId] || 0) + 1;
      stats.byCommittee[reg.assignedCommittee || 'Unassigned'] =
        (stats.byCommittee[reg.assignedCommittee || 'Unassigned'] || 0) + 1;
    }

    // Calculate conversion rate (confirmed / total)
    stats.conversionRate =
      stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0;

    return stats;
  } catch (error) {
    console.error('Error fetching registration analytics:', error);
    throw error;
  }
}

/**
 * Get revenue analytics
 */
export async function getRevenueAnalytics(eventId?: string): Promise<{
  totalRevenue: number;
  byGateway: Record<string, number>;
  byStatus: Record<string, number>;
  averagePerRegistration: number;
  pendingRevenue: number;
  refundedAmount: number;
}> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    const filters = eventId ? [`eventId == "${eventId}"`] : [];
    const payments = await databases.listDocuments(
      databaseId,
      'payments',
      [...filters, Query.limit(10000)]
    );

    const stats = {
      totalRevenue: 0,
      byGateway: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      averagePerRegistration: 0,
      pendingRevenue: 0,
      refundedAmount: 0,
    };

    for (const payment of payments.documents) {
      if (payment.status === 'success') {
        stats.totalRevenue += payment.amount || 0;
      } else if (payment.status === 'pending') {
        stats.pendingRevenue += payment.amount || 0;
      } else if (payment.status === 'refunded') {
        stats.refundedAmount += payment.amount || 0;
      }

      stats.byGateway[payment.gateway] = (stats.byGateway[payment.gateway] || 0) + 1;
      stats.byStatus[payment.status] = (stats.byStatus[payment.status] || 0) + 1;
    }

    // Get registration count for average calculation
    const registrations = await databases.listDocuments(
      databaseId,
      'registrations',
      [...filters, Query.limit(10000)]
    );

    stats.averagePerRegistration =
      registrations.documents.length > 0
        ? Math.round(stats.totalRevenue / registrations.documents.length)
        : 0;

    return stats;
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    throw error;
  }
}

/**
 * Get participant demographics
 */
export async function getParticipantDemographics(eventId?: string): Promise<{
  byInstitution: Record<string, number>;
  byCity: Record<string, number>;
  byRole: Record<string, number>;
  avgAgeGroup: string;
  returneeRate: number;
  totalParticipants: number;
}> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    const filters = eventId ? [`eventId == "${eventId}"`] : [];
    const registrations = await databases.listDocuments(
      databaseId,
      'registrations',
      [...filters, Query.limit(10000)]
    );

    const stats = {
      byInstitution: {} as Record<string, number>,
      byCity: {} as Record<string, number>,
      byRole: {} as Record<string, number>,
      avgAgeGroup: '16-18',
      returneeRate: 0,
      totalParticipants: registrations.documents.length,
    };

    for (const reg of registrations.documents) {
      stats.byInstitution[reg.institution || 'Unknown'] =
        (stats.byInstitution[reg.institution || 'Unknown'] || 0) + 1;
      stats.byCity[reg.city || 'Unknown'] =
        (stats.byCity[reg.city || 'Unknown'] || 0) + 1;
    }

    return stats;
  } catch (error) {
    console.error('Error fetching participant demographics:', error);
    throw error;
  }
}

/**
 * Get event performance metrics
 */
export async function getEventMetrics(eventId: string): Promise<{
  attendanceRate: number;
  checkInRate: number;
  averageScore: number;
  completionRate: number;
  feedbackScore: number;
}> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    const registrations = await databases.listDocuments(
      databaseId,
      'registrations',
      [`eventId == "${eventId}"`, Query.limit(10000)]
    );

    const attendance = registrations.documents.filter((r) => r.checkedIn).length;
    const attendanceRate = registrations.documents.length
      ? Math.round((attendance / registrations.documents.length) * 100)
      : 0;

    const scores = await databases.listDocuments(
      databaseId,
      'scores',
      [`eventId == "${eventId}"`, Query.limit(10000)]
    );

    const avgScore =
      scores.documents.length > 0
        ? Math.round(
          (scores.documents.reduce((sum, s) => sum + s.score, 0) /
            scores.documents.length) *
          10
        ) / 10
        : 0;

    return {
      attendanceRate,
      checkInRate: attendanceRate,
      averageScore: avgScore,
      completionRate: attendanceRate, // Based on actual check-ins
      feedbackScore: 0, // Requires feedback collection from participants
    };
  } catch (error) {
    console.error('Error fetching event metrics:', error);
    throw error;
  }
}

/**
 * Generate analytics report
 */
export async function generateAnalyticsReport(eventId?: string): Promise<AnalyticsData> {
  try {
    const [registrationStats, revenueStats, demographics] = await Promise.all([
      getRegistrationAnalytics(eventId),
      getRevenueAnalytics(eventId),
      getParticipantDemographics(eventId),
    ]);

    return {
      registrationStats: {
        total: registrationStats.total,
        byEvent: registrationStats.byEvent,
        byCommittee: registrationStats.byCommittee,
        conversionRate: registrationStats.conversionRate,
      },
      revenueStats: {
        totalRevenue: revenueStats.totalRevenue,
        byPaymentGateway: revenueStats.byGateway,
        averagePerRegistration: revenueStats.averagePerRegistration,
        refunds: revenueStats.refundedAmount,
      },
      participantDemographics: {
        byInstitution: demographics.byInstitution,
        byCity: demographics.byCity,
        byRole: demographics.byRole,
        retentionRate: demographics.returneeRate,
      },
    };
  } catch (error) {
    console.error('Error generating analytics report:', error);
    throw error;
  }
}

/**
 * Export analytics to CSV
 */
export async function exportAnalyticsToCSV(eventId?: string): Promise<string> {
  try {
    const data = await generateAnalyticsReport(eventId);

    const lines = [
      'ARSENIC SUMMIT - ANALYTICS REPORT',
      `Generated: ${new Date().toISOString()}`,
      '',
      'REGISTRATION STATISTICS',
      `Total Registrations: ${data.registrationStats.total}`,
      `Conversion Rate: ${data.registrationStats.conversionRate}%`,
      '',
      'REVENUE STATISTICS',
      `Total Revenue: ₹${data.revenueStats.totalRevenue}`,
      `Average per Registration: ₹${data.revenueStats.averagePerRegistration}`,
      `Refunds: ₹${data.revenueStats.refunds}`,
      '',
      'PARTICIPANT DEMOGRAPHICS',
      `Total Participants: ${Object.values(data.participantDemographics.byInstitution).reduce((a, b) => a + b, 0)}`,
      `Retention Rate: ${data.participantDemographics.retentionRate}%`,
    ];

    return lines.join('\n');
  } catch (error) {
    console.error('Error exporting analytics:', error);
    throw error;
  }
}
