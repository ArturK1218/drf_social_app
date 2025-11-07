import { useState } from 'react';
import { deletePost } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const isOwner = post.author?.id === user?.id || post.author?.username === user?.username;

  const handleDelete = async () => {
    if (!window.confirm('Удалить пост?')) return;
    setDeleting(true);
    try {
      await deletePost(post.id);
      onDelete(post.id);
    } catch {
      alert('Ошибка удаления');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{post.author?.username}</h3>
          <p className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleString('ru-RU')}
          </p>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
          >
            {deleting ? 'Удаляем...' : 'Удалить'}
          </button>
        )}
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
    </div>
  );
}