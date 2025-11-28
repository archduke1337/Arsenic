import { databases, account, ID } from '@/lib/appwrite';

export interface ForumPost {
  id: string;
  committeeId: string;
  eventId: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  category: 'discussion' | 'resource' | 'question' | 'announcement';
  attachments?: Array<{ url: string; name: string }>;
  replies: number;
  views: number;
  likes: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  attachments?: Array<{ url: string; name: string }>;
  likes: number;
  isAnswer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create forum post
 */
export async function createForumPost(
  committeeId: string,
  eventId: string,
  title: string,
  content: string,
  category: 'discussion' | 'resource' | 'question' | 'announcement'
): Promise<ForumPost> {
  try {
    const user = await account.get();
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

    if (!databaseId) {
      throw new Error('Database not configured');
    }

    const post = await databases.createDocument(
      databaseId,
      'forum_posts',
      ID.unique(),
      {
        committeeId,
        eventId,
        authorId: user.$id,
        authorName: user.name || user.email,
        title,
        content,
        category,
        replies: 0,
        views: 0,
        likes: 0,
        isPinned: false,
        isLocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    return {
      id: post.$id,
      committeeId,
      eventId,
      authorId: user.$id,
      authorName: user.name || user.email,
      title,
      content,
      category,
      replies: 0,
      views: 0,
      likes: 0,
      isPinned: false,
      isLocked: false,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    };
  } catch (error) {
    console.error('Error creating forum post:', error);
    throw error;
  }
}

/**
 * Reply to forum post
 */
export async function replyToPost(
  postId: string,
  content: string
): Promise<ForumReply> {
  try {
    const user = await account.get();
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

    if (!databaseId) {
      throw new Error('Database not configured');
    }

    const reply = await databases.createDocument(
      databaseId,
      'forum_replies',
      ID.unique(),
      {
        postId,
        authorId: user.$id,
        authorName: user.name || user.email,
        content,
        likes: 0,
        isAnswer: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    // Increment reply count on post
    const post = await databases.getDocument(
      databaseId,
      'forum_posts',
      postId
    );
    await databases.updateDocument(
      databaseId,
      'forum_posts',
      postId,
      { replies: (post.replies || 0) + 1 }
    );

    return {
      id: reply.$id,
      postId,
      authorId: user.$id,
      authorName: user.name || user.email,
      content,
      likes: 0,
      isAnswer: false,
      createdAt: new Date(reply.createdAt),
      updatedAt: new Date(reply.updatedAt),
    };
  } catch (error) {
    console.error('Error replying to post:', error);
    throw error;
  }
}

/**
 * Get forum posts by committee
 */
export async function getForumPosts(
  committeeId: string,
  eventId: string,
  category?: string,
  limit: number = 20
): Promise<ForumPost[]> {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

    if (!databaseId) {
      throw new Error('Database not configured');
    }

    const filters = [
      `committeeId == "${committeeId}"`,
      `eventId == "${eventId}"`,
    ];

    if (category) {
      filters.push(`category == "${category}"`);
    }

    const results = await databases.listDocuments(
      databaseId,
      'forum_posts',
      filters,
      limit,
      0,
      undefined,
      ['-isPinned', '-createdAt'] // Pin important posts first
    );

    return results.documents.map((post) => ({
      id: post.$id,
      committeeId: post.committeeId,
      eventId: post.eventId,
      authorId: post.authorId,
      authorName: post.authorName,
      title: post.title,
      content: post.content,
      category: post.category,
      replies: post.replies || 0,
      views: post.views || 0,
      likes: post.likes || 0,
      isPinned: post.isPinned || false,
      isLocked: post.isLocked || false,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    throw error;
  }
}

/**
 * Get replies to post
 */
export async function getPostReplies(postId: string): Promise<ForumReply[]> {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

    if (!databaseId) {
      throw new Error('Database not configured');
    }

    const results = await databases.listDocuments(
      databaseId,
      'forum_replies',
      [`postId == "${postId}"`],
      100,
      0,
      undefined,
      ['-isAnswer', '-likes', '-createdAt'] // Show answers first
    );

    return results.documents.map((reply) => ({
      id: reply.$id,
      postId: reply.postId,
      authorId: reply.authorId,
      authorName: reply.authorName,
      content: reply.content,
      likes: reply.likes || 0,
      isAnswer: reply.isAnswer || false,
      createdAt: new Date(reply.createdAt),
      updatedAt: new Date(reply.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching replies:', error);
    throw error;
  }
}

/**
 * Like post
 */
export async function likePost(postId: string): Promise<void> {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

    if (!databaseId) {
      throw new Error('Database not configured');
    }

    const post = await databases.getDocument(
      databaseId,
      'forum_posts',
      postId
    );

    await databases.updateDocument(
      databaseId,
      'forum_posts',
      postId,
      { likes: (post.likes || 0) + 1 }
    );
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
}

/**
 * Like reply
 */
export async function likeReply(replyId: string): Promise<void> {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

    if (!databaseId) {
      throw new Error('Database not configured');
    }

    const reply = await databases.getDocument(
      databaseId,
      'forum_replies',
      replyId
    );

    await databases.updateDocument(
      databaseId,
      'forum_replies',
      replyId,
      { likes: (reply.likes || 0) + 1 }
    );
  } catch (error) {
    console.error('Error liking reply:', error);
    throw error;
  }
}

/**
 * Mark reply as answer
 */
export async function markAsAnswer(replyId: string): Promise<void> {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

    if (!databaseId) {
      throw new Error('Database not configured');
    }

    const reply = await databases.getDocument(
      databaseId,
      'forum_replies',
      replyId
    );

    // Unmark other answers in same post first
    if (!reply.isAnswer) {
      const allReplies = await databases.listDocuments(
        databaseId,
        'forum_replies',
        [`postId == "${reply.postId}"`]
      );

      for (const otherReply of allReplies.documents) {
        if (otherReply.isAnswer && otherReply.$id !== replyId) {
          await databases.updateDocument(
            databaseId,
            'forum_replies',
            otherReply.$id,
            { isAnswer: false }
          );
        }
      }
    }

    await databases.updateDocument(
      databaseId,
      'forum_replies',
      replyId,
      { isAnswer: !reply.isAnswer }
    );
  } catch (error) {
    console.error('Error marking answer:', error);
    throw error;
  }
}

/**
 * Search forum posts
 */
export async function searchForumPosts(
  query: string,
  eventId: string,
  limit: number = 20
): Promise<ForumPost[]> {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

    if (!databaseId) {
      throw new Error('Database not configured');
    }

    // Note: This is a simple filter, for production use full-text search
    const results = await databases.listDocuments(
      databaseId,
      'forum_posts',
      [`eventId == "${eventId}"`],
      1000
    );

    const filtered = results.documents.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
    );

    return filtered.slice(0, limit).map((post) => ({
      id: post.$id,
      committeeId: post.committeeId,
      eventId: post.eventId,
      authorId: post.authorId,
      authorName: post.authorName,
      title: post.title,
      content: post.content,
      category: post.category,
      replies: post.replies || 0,
      views: post.views || 0,
      likes: post.likes || 0,
      isPinned: post.isPinned || false,
      isLocked: post.isLocked || false,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }));
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
}

/**
 * Delete post (admins only)
 */
export async function deletePost(postId: string): Promise<void> {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

    if (!databaseId) {
      throw new Error('Database not configured');
    }

    // Delete all replies first
    const replies = await databases.listDocuments(
      databaseId,
      'forum_replies',
      [`postId == "${postId}"`],
      1000
    );

    for (const reply of replies.documents) {
      await databases.deleteDocument(
        databaseId,
        'forum_replies',
        reply.$id
      );
    }

    // Delete post
    await databases.deleteDocument(
      databaseId,
      'forum_posts',
      postId
    );
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}
