import { NextResponse } from 'next/server';
import { getAllPosts, getPostsByType } from '@/lib/writings';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as 'reading-note' | 'enrichment' | null;

  try {
    const posts = type ? getPostsByType(type) : getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching writings:', error);
    return NextResponse.json([], { status: 500 });
  }
}
