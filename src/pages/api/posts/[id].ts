import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';
import { getCurrentUser } from '@/utils/auth';
import { postSchema } from '@/utils/validation';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await AppDataSource.initialize();
  const postId = parseInt(params.id);
  const postRepository = AppDataSource.getRepository(Post);
  const post = await postRepository.findOne({ where: { id: postId }, relations: ['author', 'comments', 'comments.author'] });
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json({
    id: post.id,
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl,
    category: post.category,
    createdAt: post.createdAt,
    author: { id: post.author.id, name: post.author.name },
    comments: post.comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: { id: comment.author.id, name: comment.author.name },
    })),
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await AppDataSource.initialize();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const postId = parseInt(params.id);
  const postRepository = AppDataSource.getRepository(Post);
  const post = await postRepository.findOne({ where: { id: postId }, relations: ['author'] });
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  if (post.author.id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json();
  const result = postSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
  }
  Object.assign(post, result.data);
  await postRepository.save(post);
  return NextResponse.json({ message: 'Post updated', post });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await AppDataSource.initialize();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const postId = parseInt(params.id);
  const postRepository = AppDataSource.getRepository(Post);
  const post = await postRepository.findOne({ where: { id: postId }, relations: ['author'] });
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  if (post.author.id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await postRepository.remove(post);
  return NextResponse.json({ message: 'Post deleted' });
}