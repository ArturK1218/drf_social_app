import { useState, useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { getFeed } from '../api/api';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeed()
      .then(({ data }) => {
        setPosts(data.results || data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePost = (newPost) => setPosts([newPost, ...posts]);
  const handleDelete = (id) => setPosts(posts.filter(p => p.id !== id));

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Лента новостей</h1>
      <PostForm onPostCreated={handlePost} />
      {loading ? (
        <p className="text-center text-gray-500">Загрузка...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Пусто. Создайте первый пост!</p>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} post={post} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
}