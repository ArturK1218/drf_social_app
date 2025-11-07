import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Posts from './pages/Posts';
import Groups from './pages/Groups';
import Dialogs from './pages/Dialogs';
import DialogChat from './pages/DialogChat';
import Profile from './pages/Profile';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Загрузка...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Protected><Feed /></Protected>} />
            <Route path="/posts" element={<Protected><Posts /></Protected>} />
            <Route path="/groups" element={<Protected><Groups /></Protected>} />
            <Route path="/dialogs" element={<Protected><Dialogs /></Protected>} />
            <Route path="/dialogs/:dialogId" element={<Protected><DialogChat /></Protected>} />
            <Route path="/profile" element={<Protected><Profile /></Protected>} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}