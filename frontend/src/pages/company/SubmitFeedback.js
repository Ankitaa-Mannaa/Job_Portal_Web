import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function SubmitFeedback() {
  const { user } = useAuth();
  const [form, setForm] = useState({ user_id: '', job_id: '', feedback: '' });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/feedback/`, form, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg('❌ Feedback submission failed.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Submit Feedback</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Candidate User ID"
          value={form.user_id}
          onChange={e => setForm({ ...form, user_id: e.target.value })}
          required
          style={styles.input}
        />
        <input
          placeholder="Job ID"
          value={form.job_id}
          onChange={e => setForm({ ...form, job_id: e.target.value })}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Write your feedback..."
          value={form.feedback}
          onChange={e => setForm({ ...form, feedback: e.target.value })}
          required
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>Send Feedback</button>
      </form>
      {msg && <p style={styles.message}>{msg}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15
  },
  input: {
    padding: 10,
    fontSize: 16,
    border: '1px solid #ccc',
    borderRadius: 6
  },
  textarea: {
    height: 100,
    padding: 10,
    fontSize: 16,
    border: '1px solid #ccc',
    borderRadius: 6
  },
  button: {
    padding: 12,
    backgroundColor: '#28a745',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer'
  },
  message: {
    marginTop: 15,
    fontWeight: 'bold'
  }
};
