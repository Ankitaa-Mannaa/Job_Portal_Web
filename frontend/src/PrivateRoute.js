import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // ✅ correct import path

export default function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();  // include loading here

  if (loading) return <div>Loading...</div>;  // 🕒 wait until auth state resolves

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/unauthorized" />;

  return children;
}
