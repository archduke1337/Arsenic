import { Client, Account, Users, Databases, Query } from 'node-appwrite';
import { cookies } from 'next/headers';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'gauravramyadav@gmail.com')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || '';
const COLLECTIONS = {
  TEAM_MEMBERS: 'team_members',
  COMMITTEES: 'committees',
};

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

// Check if user is a chairperson and get their assigned committee
export async function getChairpersonInfo(): Promise<{ userId: string; email: string; name: string; committeeId: string; committeeName: string } | null> {
  try {
    const user = await getAuthenticatedUser();
    if (!user?.email) return null;

    // Admins can act as chairs for any committee
    if (ADMIN_EMAILS.includes(user.email)) {
      return {
        userId: user.$id,
        email: user.email,
        name: user.name,
        committeeId: 'all',
        committeeName: 'All Committees (Admin)',
      };
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || '')
      .setProject(process.env.APPWRITE_PROJECT_ID || '')
      .setKey(process.env.APPWRITE_API_KEY || '');

    const databases = new Databases(client);

    // Check if user is listed as chairperson in team_members
    const teamResult = await databases.listDocuments(DATABASE_ID, COLLECTIONS.TEAM_MEMBERS, [
      Query.equal('email', user.email),
      Query.equal('role', 'chairperson'),
    ]);

    if (teamResult.documents.length > 0) {
      const teamMember = teamResult.documents[0];
      // Look up the committee they chair
      const committees = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COMMITTEES, [
        Query.equal('chairperson', teamMember.name),
      ]);

      const committee = committees.documents[0];
      return {
        userId: user.$id,
        email: user.email,
        name: user.name,
        committeeId: committee?.$id || 'unassigned',
        committeeName: committee?.name || 'Unassigned',
      };
    }

    // Also check if user email is directly assigned as chair in committees
    const committeeByEmail = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COMMITTEES, [
      Query.contains('chairperson', user.email),
    ]);

    if (committeeByEmail.documents.length > 0) {
      const committee = committeeByEmail.documents[0];
      return {
        userId: user.$id,
        email: user.email,
        name: user.name,
        committeeId: committee.$id,
        committeeName: committee.name,
      };
    }

    return null;
  } catch (error) {
    console.error('Error checking chairperson status:', error);
    return null;
  }
}

// Check if user is either admin or chair (for scoring API)
export async function isAdminOrChair(): Promise<{ isAdmin: boolean; isChair: boolean; user: { $id: string; email: string; name: string } | null; committeeId?: string }> {
  const user = await getAuthenticatedUser();
  if (!user) return { isAdmin: false, isChair: false, user: null };

  const isAdmin = ADMIN_EMAILS.includes(user.email);
  if (isAdmin) {
    return { isAdmin: true, isChair: true, user, committeeId: 'all' };
  }

  const chairInfo = await getChairpersonInfo();
  if (chairInfo) {
    return { isAdmin: false, isChair: true, user, committeeId: chairInfo.committeeId };
  }

  return { isAdmin: false, isChair: false, user };
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
