import { MessageCircle } from 'lucide-react';

interface CommentListProps {
  comments: {
    id: number;
    content: string;
    createdAt: string;
    author: { name: string };
  }[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <MessageCircle className="h-12 w-12 mx-auto mb-2" />
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Comments ({comments.length})
      </h3>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium text-gray-900">{comment.author.name}</span>
            <span className="text-sm text-gray-600">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}