import { useState, useEffect } from 'react';
import { getGroups, createGroup } from '../api/api';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGroups()
      .then(({ data }) => {
        setGroups(data.results || data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createGroup(form);
      setGroups([data, ...groups]);
      setForm({ name: '', description: '' });
    } catch {
      alert('Ошибка создания группы');
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Группы</h1>

      <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl shadow-md mb-8">
        <input
          type="text"
          placeholder="Название группы"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <textarea
          placeholder="Описание (необязательно)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition font-semibold"
        >
          Создать группу
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-500">Загрузка...</p>
      ) : groups.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Нет групп. Создайте первую!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map(group => (
            <div key={group.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-800">{group.name}</h3>
              <p className="text-gray-600 mt-2">{group.description || 'Без описания'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}