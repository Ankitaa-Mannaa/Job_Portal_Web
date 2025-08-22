import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser({ ...res.data, token }))
        .catch(() => setUser(null))
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);
    setAuthLoading(true); // ✅ ensure loading during profile fetch
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...res.data, token });
    } catch (err) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
