import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';
import { getCurrentUser } from '@/utils/auth';
import { postSchema } from '@/utils/validation';

export async function GET() {
  await AppDataSource.initialize();
  const postRepository = AppDataSource.getRepository(Post);
  const posts = await postRepository.find({ relations: ['author'], order: { createdAt: 'DESC' } });
  return NextResponse.json(posts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl,
    category: post.category,
    createdAt: post.createdAt,
    author: { id: post.author.id, name: post.author.name },
  })));
}

export async function POST(request: NextRequest) {
  await AppDataSource.initialize();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const result = postSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
  }
  const postRepository = AppDataSource.getRepository(Post);
  const post = postRepository.create({ ...result.data, author: user });
  await postRepository.save(post);
  return NextResponse.json({ message: 'Post created', post }, { status: 201 });
}