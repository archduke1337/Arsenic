import { NextRequest, NextResponse } from 'next/server';
import { createForumPost, replyToPost, getForumPosts, searchForumPosts } from '@/lib/forum-service';

/**
 * POST /api/forum/posts
 * Create new forum post
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { committeeId, eventId, title, content, category } = body;

    if (!committeeId || !eventId || !title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const post = await createForumPost(committeeId, eventId, title, content, category);

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error creating forum post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/forum/posts?committeeId=xxx&eventId=xxx&category=xxx
 * Get forum posts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const committeeId = searchParams.get('committeeId');
    const eventId = searchParams.get('eventId');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!committeeId || !eventId) {
      return NextResponse.json(
        { error: 'Missing committeeId or eventId' },
        { status: 400 }
      );
    }

    const posts = await getForumPosts(committeeId, eventId, category || undefined, limit);

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
