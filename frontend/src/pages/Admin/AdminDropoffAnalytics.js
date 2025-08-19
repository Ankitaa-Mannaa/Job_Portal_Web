import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminDropoffAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.token) return;

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/dropoff-analytics`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => {
        console.log("📊 Dropoff Analytics Response:", res.data);
        setData(res.data);
      })
      .catch(err => {
        console.error('❌ Error fetching analytics:', err);
        setError('Failed to fetch drop-off analytics');
      });
  }, [user]);

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (!data) {
    return <div style={styles.loading}>Loading drop-off analytics...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📉 Drop-off Analytics</h2>

      {Array.isArray(data) && data.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Feedback ID</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td style={styles.td}>{item.id}</td>
                <td style={styles.td}>{item.title}</td>
                <td style={styles.td}>{item.status}</td>
                <td style={styles.td}>{item.email}</td>
                <td style={styles.td}>{item.feedback_id ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center' }}>No drop-off analytics found.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    textAlign: 'center',
    color: '#222',
    marginBottom: '25px',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '15px'
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '12px',
    borderBottom: '2px solid #ddd',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  loading: {
    textAlign: 'center',
    marginTop: '80px',
    fontSize: '18px',
    color: '#555',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '16px',
  },
};
