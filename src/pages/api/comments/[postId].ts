import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';
import { Comment } from '@/entities/Comment';
import { Post } from '@/entities/Post';
import { getCurrentUser } from '@/utils/auth';
import { commentSchema } from '@/utils/validation';

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  await AppDataSource.initialize();
  const postId = parseInt(params.postId);
  const commentRepository = AppDataSource.getRepository(Comment);
  const comments = await commentRepository.find({ where: { post: { id: postId } }, relations: ['author'], order: { createdAt: 'DESC' } });
  return NextResponse.json(comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    author: { id: comment.author.id, name: comment.author.name },
  })));
}

export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
  await AppDataSource.initialize();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const postId = parseInt(params.postId);
  const postRepository = AppDataSource.getRepository(Post);
  const post = await postRepository.findOne({ where: { id: postId } });
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  const body = await request.json();
  const result = commentSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
  }
  const commentRepository = AppDataSource.getRepository(Comment);
  const comment = commentRepository.create({ ...result.data, author: user, post });
  await commentRepository.save(comment);
  return NextResponse.json({ message: 'Comment added', comment }, { status: 201 });
}