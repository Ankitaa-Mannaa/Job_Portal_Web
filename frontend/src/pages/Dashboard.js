import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔐 LocalStorage token:', token);

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log('✅ Decoded JWT:', decoded);

      const sub = decoded.sub;
      if (!sub || !sub.role) {
        console.warn('⚠️ Role missing from token payload');
        setUser(null);
        return;
      }

      setUser(sub);
    } catch (err) {
      console.error('❌ Failed to decode token:', err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <h2 style={styles.loading}>User role missing from token</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>Welcome, {user.role.toUpperCase()}!</h2>
      <p>Your user ID: <strong>{user.id}</strong></p>

      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'company' && <CompanyDashboard />}
      {user.role === 'candidate' && <CandidateDashboard />}

      <button onClick={logout} style={styles.logout}>Logout</button>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div style={styles.box}>
      <h3>Admin Dashboard</h3>
      <ul>
        <li><a href="/admin/users">View all users</a></li>
        <li>Resume score analytics</li>
        <li>Drop-off insights</li>
      </ul>
    </div>
  );
}

function CompanyDashboard() {
  return (
    <div style={styles.box}>
      <h3>Company Dashboard</h3>
      <ul>
        <li>Post a Job</li>
        <li>Track Applicants</li>
        <li>Submit Feedback</li>
      </ul>
    </div>
  );
}

function CandidateDashboard() {
  return (
    <div style={styles.box}>
      <h3>Candidate Dashboard</h3>
      <ul>
        <li>Upload Resume</li>
        <li>View Matched Jobs</li>
        <li>AI Chat about Resume</li>
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '50px auto',
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 8,
    textAlign: 'center',
  },
  box: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    border: '1px solid #bbb',
    borderRadius: 6,
  },
  logout: {
    marginTop: 30,
    padding: '10px 20px',
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    marginTop: '100px',
    fontSize: '20px',
  },
};
