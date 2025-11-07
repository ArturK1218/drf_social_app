import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDialogs } from '../api/api';

export default function Dialogs() {
  const [dialogs, setDialogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDialogs()
      .then(({ data }) => {
        setDialogs(data.results || data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Мои диалоги</h1>
      {loading ? (
        <p className="text-center text-gray-500">Загрузка...</p>
      ) : dialogs.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Нет диалогов. Начните общение!</p>
      ) : (
        <div className="space-y-4">
          {dialogs.map(dialog => (
            <Link
              key={dialog.id}
              to={`/dialogs/${dialog.id}`}
              className="block bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg text-gray-800">
                Диалог #{dialog.id}
              </h3>
              <p className="text-sm text-gray-600">
                Участники: {dialog.participants?.map(p => p.username).join(', ') || 'Неизвестно'}
              </p>
              {dialog.last_message && (
                <p className="text-sm text-gray-500 mt-1">
                  Последнее: {dialog.last_message}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}