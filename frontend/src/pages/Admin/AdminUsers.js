import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminUsers.css'; // Import styles

export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (user.role !== 'admin') {
      alert('Access denied. Admins only.');
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log('🧠 API response:', res.data);
        setUsers(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching users:', err);
        if (err.response?.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchUsers();
  }, [user, navigate]);

  if (!user) return <h3 className="admin-loading">Checking auth...</h3>;
  if (loading) return <h3 className="admin-loading">Loading users...</h3>;

  return (
    <div className="admin-container">
      <h2>👥 Admin User Management</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-data">No users found</td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                </td>
                <td>
                  <button className="delete-btn" onClick={() => deleteUser(u.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  async function deleteUser(id) {
    if (!window.confirm(`Delete user ${id}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('❌ Delete failed:', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }
}
