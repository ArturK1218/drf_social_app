import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { connectChat, sendMessage, disconnectChat } from '../api/websocket';
import { useAuth } from '../context/AuthContext';
import { getDialog } from '../api/api';

export default function DialogChat() {
  const { dialogId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Загрузка истории
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getDialog(dialogId);
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Ошибка загрузки истории');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [dialogId]);

  // WebSocket
  useEffect(() => {
    connectChat(dialogId, (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => disconnectChat();
  }, [dialogId]);

  // Автоскролл
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  if (loading) return <div className="p-8 text-center">Загрузка чата...</div>;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg flex items-center">
        <button onClick={() => navigate('/dialogs')} className="mr-4 text-2xl">
          ←
        </button>
        <h2 className="text-xl font-bold">Чат #{dialogId}</h2>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Начните общение!</p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === user?.username ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${
                  msg.sender === user?.username
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'bg-white text-gray-800 border'
                }`}
              >
                <p className="text-xs opacity-75 font-medium">{msg.sender}</p>
                <p className="mt-1">{msg.text}</p>
                <p className="text-xs opacity-60 mt-1">{msg.created_at}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Напишите сообщение..."
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-indigo-700 transition font-semibold"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}