import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../api/api';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ bio: '', avatar: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ bio: user.bio || '', avatar: user.avatar || '' });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(form);
      setEditing(false);
    } catch {
      alert('Ошибка обновления профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Мой профиль</h1>
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <img
            src={user?.avatar || 'https://via.placeholder.com/150'}
            alt="Аватар"
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg"
          />
          <h2 className="text-2xl font-bold mt-4 text-gray-800">{user?.username}</h2>
        </div>

        {editing ? (
          <div className="space-y-4">
            <textarea
              placeholder="О себе"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              placeholder="Ссылка на аватар"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition font-semibold"
              >
                {loading ? 'Сохраняем...' : 'Сохранить'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition font-semibold"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-700 mb-6">{user?.bio || 'Нет информации о себе'}</p>
            <button
              onClick={() => setEditing(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold"
            >
              Редактировать профиль
            </button>
          </div>
        )}
      </div>
    </div>
  );
}