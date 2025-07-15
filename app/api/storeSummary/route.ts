// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // assuming you created prisma client here

// GET /api/posts - Fetch all posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts ' + error }, { status: 500 });
  }
}

// POST /api/posts - Add a new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { summary } = body;

    const newPost = await prisma.post.create({
      data: { summary },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post ' + error }, { status: 500 });
  }
}
