import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminJobStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user?.token) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/job-stats`, {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => setStats(res.data)).catch(console.error);
  }, [user]);

  if (!stats) {
    return <div style={styles.loading}>Loading job statistics...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📊 Job Statistics</h2>

      <div style={styles.card}>
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} style={styles.statRow}>
            <span style={styles.label}>{formatKey(key)}:</span>
            <span style={styles.value}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatKey(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize each word
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fdfdfd',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    border: '1px solid #e0e0e0',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    color: '#222',
  },
  loading: {
    textAlign: 'center',
    marginTop: '100px',
    fontSize: '18px',
    color: '#555'
  }
};
