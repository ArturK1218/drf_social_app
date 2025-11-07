import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { getPosts } from '../api/api';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then(({ data }) => {
        setPosts(data.results || data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = (id) => setPosts(posts.filter(p => p.id !== id));

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Все посты</h1>
      {loading ? (
        <p className="text-center text-gray-500">Загрузка...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Нет постов</p>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} post={post} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
}