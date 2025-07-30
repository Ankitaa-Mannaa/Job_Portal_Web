import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // ✅ required for backend call

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        console.warn('🔑 Token expired');
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
        return;
      }

      // Call /auth/me to get name + email
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          setUser({
            id: res.data.id,
            role: res.data.role,
            name: res.data.name,
            email: res.data.email,
            token: token
          });
        })
        .catch(err => {
          console.error('⚠️ Failed to fetch /me:', err);
          setUser(null);
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));

    } catch (err) {
      console.error('❌ Invalid token:', err);
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({
        id: res.data.id,
        role: res.data.role,
        name: res.data.name,
        email: res.data.email,
        token: token,
      });
    } catch (err) {
      console.error('⚠️ Failed to fetch user after login:', err);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
