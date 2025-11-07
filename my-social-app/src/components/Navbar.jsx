import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-yellow-300 transition">
          SocialApp
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-yellow-300 transition">Лента</Link>
          <Link to="/posts" className="hover:text-yellow-300 transition">Посты</Link>
          <Link to="/groups" className="hover:text-yellow-300 transition">Группы</Link>
          <Link to="/dialogs" className="hover:text-yellow-300 transition">Чаты</Link>
          <Link to="/profile" className="hover:text-yellow-300 transition">Профиль</Link>
          <span className="text-sm opacity-90">Привет, {user?.username}!</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
          >
            Выйти
          </button>
        </div>
      </div>
    </nav>
  );
}