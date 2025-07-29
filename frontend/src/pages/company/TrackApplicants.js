import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function TrackApplicants() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/apply/all', {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => setApps(res.data)).catch(console.error);
  }, [user]);

  return (
    <div style={styles.container}>
      <h2>Track Applicants</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Job ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {apps.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>No applications found</td>
            </tr>
          ) : (
            apps.map(app => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.user_id}</td>
                <td>{app.job_id}</td>
                <td>{app.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: '50px auto',
    padding: 20,
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#fefefe',
    borderRadius: 8
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 20
  },
  noData: {
    textAlign: 'center',
    padding: 15,
    fontStyle: 'italic'
  }
};
