import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function PostJob() {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', description: '' });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/job/`, form, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMsg(res.data.msg);
      setForm({ title: '', description: '' });
    } catch (err) {
      setMsg('❌ Failed to post job.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Post a New Job</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Job Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          style={styles.textarea}
          placeholder="Job Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          required
        />
        <button type="submit" style={styles.button}>Submit</button>
      </form>
      {msg && <p style={styles.message}>{msg}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '50px auto',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
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
    borderRadius: 5,
    border: '1px solid #ccc'
  },
  textarea: {
    padding: 10,
    height: 120,
    fontSize: 16,
    borderRadius: 5,
    border: '1px solid #ccc'
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: 12,
    fontWeight: 'bold',
    borderRadius: 5,
    cursor: 'pointer'
  },
  message: {
    marginTop: 20,
    fontWeight: 'bold'
  }
};
