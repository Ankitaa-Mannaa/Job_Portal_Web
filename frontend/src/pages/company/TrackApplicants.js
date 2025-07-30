import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function TrackApplicants() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [message, setMessage] = useState('');

  const fetchApplications = useCallback(() => {
    axios.get('http://localhost:5000/api/apply/all', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .then(res => setApps(res.data))
    .catch(console.error);
  }, [user.token]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = (appId, newStatus) => {
    setStatusUpdates(prev => ({ ...prev, [appId]: newStatus }));
  };

  const handleUpdate = async (appId) => {
    try {
      await axios.put(`http://localhost:5000/api/apply/${appId}`, {
        status: statusUpdates[appId]
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessage(` Status updated for application ${appId}`);
      fetchApplications(); // safe to call
    } catch (err) {
      console.error(err);
      setMessage(` Update failed for application ${appId}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Track Applicants</h2>
      {message && <p style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Candidate Name</th>
            <th>Candidate Email</th>
            <th>User ID</th>
            <th>Job</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {apps.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noData}>No applications found</td>
            </tr>
          ) : (
            apps.map(app => (
              <tr key={app.id}>
                <td>{app.candidate_name}</td>
                <td>{app.candidate_email}</td>
                <td>{app.id}</td>
                <td>{app.candidate_id || app.user_id}</td>
                <td>{app.job_id}</td>
                <td>{app.job_title || app.job_id}</td>
                <td>{app.status}</td>
                <td>
                  <select
                    value={statusUpdates[app.id] || app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  >
                    <option value="applied">applied</option>
                    <option value="reviewing">reviewing</option>
                    <option value="interview">interview</option>
                    <option value="rejected">rejected</option>
                    <option value="hired">hired</option>
                  </select>
                  <button onClick={() => handleUpdate(app.id)} style={styles.updateBtn}>Update</button>
                </td>
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
    maxWidth: 1000,
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
  },
  updateBtn: {
    marginLeft: 10,
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  }
};
