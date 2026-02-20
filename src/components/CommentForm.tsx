import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema } from '@/utils/validation';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;
}

type CommentFormData = {
  content: string;
};

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentFormData) => {
    try {
      const response = await fetch(`/api/comments/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      toast.success('Comment added!');
      reset();
      onCommentAdded();
    } catch (error) {
      toast.error('Error adding comment');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <div className="mb-4">
        <textarea
          {...register('content')}
          placeholder="Add a comment..."
          className="input-field min-h-[100px]"
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
        <Send className="h-4 w-4" />
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}