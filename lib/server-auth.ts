import { account } from '@/lib/appwrite';

// Simple admin email check using env list; returns email if admin, else null
export async function isAdminEmail(request: Request): Promise<string | null> {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  if (adminEmails.length === 0) return null;

  try {
    const user = await account.get();
    if (user?.email && adminEmails.includes(user.email)) return user.email;
    return null;
  } catch {
    return null;
  }
}
