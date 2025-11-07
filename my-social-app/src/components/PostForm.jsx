import { useState } from 'react';
import { createPost } from '../api/api';

export default function PostForm({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const { data } = await createPost({ content });
      onPostCreated(data);
      setContent('');
    } catch {
      alert('Ошибка создания поста');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Что у вас нового?"
        className="w-full p-4 border border-gray-300 rounded-lg resize-none h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={1000}
      />
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-500">{content.length}/1000</span>
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 transition"
        >
          {loading ? 'Публикуем...' : 'Опубликовать'}
        </button>
      </div>
    </form>
  );
}