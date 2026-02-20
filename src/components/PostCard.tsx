import Link from 'next/link';
import { Calendar, User, MessageCircle } from 'lucide-react';
import { Post } from '@/entities/Post';

type PostCardProps = {
  post: {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    category: string;
    createdAt: string;
    author: { name: string };
  };
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="card hover:scale-[1.02] transition-transform">
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-4" />
      )}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
          {post.category}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {post.author.name}
        </span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
      <div className="flex justify-between items-center">
        <Link href={`/post/${post.id}`} className="btn-primary">
          Read More
        </Link>
        <span className="flex items-center gap-1 text-gray-600">
          <MessageCircle className="h-4 w-4" />
          Comments
        </span>
      </div>
    </div>
  );
}