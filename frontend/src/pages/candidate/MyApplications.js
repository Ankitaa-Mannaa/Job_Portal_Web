import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function MyApplications() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);

  const fetchApps = () => {
    axios.get('http://localhost:5000/api/apply/my', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .then(res => setApps(res.data))
    .catch(err => {
      console.error('❌ Failed to fetch applications:', err);
    });
  };

  useEffect(fetchApps, [user.token]);

  const handleDelete = async (app_id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/apply/${app_id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchApps();
    } catch (err) {
      console.error('❌ Delete failed:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📄 My Applications</h2>
      {apps.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul style={styles.list}>
          {apps.map(app => (
            <li key={app.application_id} style={styles.card}>
              <strong>{app.job_title}</strong>
              <p>Status: <span style={styles.status}>{app.status}</span></p>
              <button onClick={() => handleDelete(app.application_id)} style={styles.deleteButton}>
                ❌ Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px'
  },
  list: {
    listStyleType: 'none',
    padding: 0
  },
  card: {
    backgroundColor: '#f8f8f8',
    border: '1px solid #ccc',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '6px'
  },
  description: {
    fontStyle: 'italic',
    color: '#444'
  },
  status: {
    fontWeight: 'bold',
    color: '#2e86de'
  },
  deleteButton: {
    marginTop: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
