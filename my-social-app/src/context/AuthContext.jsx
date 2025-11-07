import { createContext, useContext, useState, useEffect } from 'react';
import { login, register, getProfile } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const { data } = await getProfile();
          setUser(data);
        } catch {
          localStorage.clear();
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const loginUser = async (creds) => {
    const { data } = await login(creds);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    const profile = await getProfile();
    setUser(profile.data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);