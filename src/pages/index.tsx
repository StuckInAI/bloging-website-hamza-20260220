import PostCard from '@/components/PostCard';
import { initializeDatabase } from '@/lib/database';
import { Post } from '@/entities/Post';
import { AppDataSource } from '@/lib/database';

export default async function Home() {
  await initializeDatabase();
  const postRepository = AppDataSource.getRepository(Post);
  const posts = await postRepository.find({ relations: ['author'], order: { createdAt: 'DESC' } });

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Bloging Website</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Your go-to destination for the latest entertainment news, reviews, and vibrant discussions.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              id: post.id,
              title: post.title,
              content: post.content,
              imageUrl: post.imageUrl || undefined,
              category: post.category,
              createdAt: post.createdAt.toISOString(),
              author: { name: post.author.name },
            }}
          />
        ))}
      </div>
      {posts.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p className="text-xl">No posts yet. Be the first to create one!</p>
        </div>
      )}
    </div>
  );
}