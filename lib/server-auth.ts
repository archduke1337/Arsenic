import { Client, Account, Users } from 'node-appwrite';
import { cookies } from 'next/headers';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'gauravramyadav@gmail.com')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean);

// Get authenticated user from session cookie
export async function getAuthenticatedUser(): Promise<{ $id: string; email: string; name: string } | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');
    
    if (!sessionCookie?.value) return null;

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || '')
      .setProject(process.env.APPWRITE_PROJECT_ID || '');

    client.setSession(sessionCookie.value);
    
    const account = new Account(client);
    const user = await account.get();
    
    return {
      $id: user.$id,
      email: user.email,
      name: user.name,
    };
  } catch {
    return null;
  }
}

// Check if user is admin (returns email if admin, null otherwise)
export async function isAdminEmail(request?: Request): Promise<string | null> {
  const user = await getAuthenticatedUser();
  if (!user?.email) return null;
  
  if (ADMIN_EMAILS.includes(user.email)) {
    return user.email;
  }
  
  return null;
}

// Check if specific email is in admin list
export function isEmailAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}

// Get user by ID (server-side using API key)
export async function getUserById(userId: string) {
  try {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || '')
      .setProject(process.env.APPWRITE_PROJECT_ID || '')
      .setKey(process.env.APPWRITE_API_KEY || '');
    
    const users = new Users(client);
    return await users.get(userId);
  } catch {
    return null;
  }
}
