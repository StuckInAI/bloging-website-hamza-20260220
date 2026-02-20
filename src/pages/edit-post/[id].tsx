import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema } from '@/utils/validation';
import toast from 'react-hot-toast';
import { Edit } from 'lucide-react';
import { getCurrentUser } from '@/utils/auth';

interface PostFormData {
  title: string;
  content: string;
  imageUrl: string;
  category: string;
}

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
        reset(data);
        const user = await getCurrentUser();
        if (user && user.id === data.author.id) {
          setIsAuthorized(true);
        } else {
          router.push('/login');
        }
      } catch (error) {
        toast.error('Error loading post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, reset, router]);

  const onSubmit = async (data: PostFormData) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update post');
      }
      toast.success('Post updated successfully!');
      router.push(`/post/${id}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!isAuthorized) {
    return <div className="text-center py-12">Unauthorized</div>;
  }

  return (
    <div className="max-w-3xl mx-auto card">
      <div className="text-center mb-6">
        <Edit className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
        <p className="text-gray-600 mt-2">Update your entertainment post</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="input-field"
            placeholder="Enter post title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            {...register('content')}
            className="input-field min-h-[200px]"
            placeholder="Write your post content here..."
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            type="text"
            {...register('imageUrl')}
            className="input-field"
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            {...register('category')}
            className="input-field"
          >
            <option value="entertainment">Entertainment</option>
            <option value="movies">Movies</option>
            <option value="music">Music</option>
            <option value="gaming">Gaming</option>
            <option value="lifestyle">Lifestyle</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full btn-primary flex items-center justify-center gap-2">
          <Edit className="h-4 w-4" />
          {isSubmitting ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
}