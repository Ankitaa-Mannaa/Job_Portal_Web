import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/user-stats`, {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => setStats(res.data)).catch(console.error);
  }, [user]);

  return (
    <div style={styles.container}>
      <h2>User Statistics</h2>

      {stats.length === 0 ? (
        <p style={styles.loading}>No data available</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>User Count</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat, index) => (
              <tr key={index}>
                <td style={styles.td}>
                  <span className={`badge ${stat.name}`}>{stat.name}</span>
                </td>
                <td style={styles.td}>{stat.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '50px auto',
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    fontFamily: 'Segoe UI, sans-serif',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 20,
  },
  th: {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px 4px 0 0',
  },
  td: {
    padding: '12px 10px',
    borderBottom: '1px solid #ddd',
  },
  loading: {
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
    color: '#777',
  }
};
