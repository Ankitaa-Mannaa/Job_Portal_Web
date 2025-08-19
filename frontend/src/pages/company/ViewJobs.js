import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ViewJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/job/`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      }
    };

    fetchJobs();
  }, [user.token]); // 🔍 React hook dependency resolved properly

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/job/${jobId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setJobs(jobs.filter(j => j.id !== jobId));
      setMessage('✅ Job deleted.');
    } catch (err) {
      console.error('Delete failed:', err);
      setMessage('❌ Failed to delete job.');
    }
  };

  const handleEdit = (job) => {
    setEditingId(job.id);
    setEditForm({ title: job.title, description: job.description });
  };

  const handleUpdate = async (jobId) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/job/${jobId}`, editForm, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessage(res.data.msg);
      setEditingId(null);
      const updated = jobs.map(j => j.id === jobId ? { ...j, ...editForm } : j);
      setJobs(updated);
    } catch (err) {
      console.error('Update failed:', err);
      setMessage('❌ Failed to update job.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>📋 View Jobs</h2>
      {message && <p style={styles.message}>{message}</p>}

      {jobs.length === 0 ? (
        <p>loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>
                  {editingId === job.id ? (
                    <input
                      value={editForm.title}
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      style={styles.input}
                    />
                  ) : (
                    job.title
                  )}
                </td>
                <td>
                  {editingId === job.id ? (
                    <textarea
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      style={styles.textarea}
                    />
                  ) : (
                    job.description
                  )}
                </td>
                <td>
                  {editingId === job.id ? (
                    <>
                      <button style={styles.saveBtn} onClick={() => handleUpdate(job.id)}>Save</button>
                      <button style={styles.cancelBtn} onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button style={styles.editBtn} onClick={() => handleEdit(job)}>Edit</button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(job.id)}>Delete</button>
                    </>
                  )}
                </td>
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
    maxWidth: 1000,
    margin: '50px auto',
    padding: 20,
    backgroundColor: '#fefefe',
    fontFamily: 'Segoe UI, sans-serif',
    borderRadius: 8
  },
  message: {
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  input: {
    width: '100%',
    padding: 6,
    fontSize: 14
  },
  textarea: {
    width: '100%',
    height: 60,
    fontSize: 14,
    padding: 6
  },
  editBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '6px 10px',
    marginRight: 5,
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '6px 10px',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  },
  saveBtn: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '6px 10px',
    marginRight: 5,
    border: 'none',
    borderRadius: 4
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    color: '#fff',
    padding: '6px 10px',
    border: 'none',
    borderRadius: 4
  }
};
