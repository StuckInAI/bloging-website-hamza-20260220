import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';
import { Calendar, User, Edit, Trash2 } from 'lucide-react';
import { getCurrentUser } from '@/utils/auth';
import toast from 'react-hot-toast';
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  category: string;
  createdAt: string;
  author: { id: number; name: string };
  comments: Array<{
    id: number;
    content: string;
    createdAt: string;
    author: { name: string };
  }>;
};

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/posts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setPost(data);
    } catch (error) {
      toast.error('Error loading post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      toast.success('Post deleted');
      router.push('/');
    } catch (error) {
      toast.error('Error deleting post');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center py-12">Post not found</div>;
  }

  const isAuthor = user && user.id === post.author.id;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
              {post.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mt-2">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author.name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          {isAuthor && (
            <div className="flex gap-2 mt-4 md:mt-0">
              <Link href={`/edit-post/${post.id}`} className="btn-secondary flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </Link>
              <button onClick={handleDelete} className="btn-primary bg-red-600 hover:bg-red-700 flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="w-full h-96 object-cover rounded-lg mb-6" />
        )}
        <div className="prose max-w-none text-gray-700">
          {post.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <CommentForm postId={post.id} onCommentAdded={fetchPost} />
      <CommentList comments={post.comments} />
    </div>
  );
}