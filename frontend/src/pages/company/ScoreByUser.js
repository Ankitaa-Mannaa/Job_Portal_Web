import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ScoreByUserId() {
  const { user } = useAuth();
  const [form, setForm] = useState({ user_id: '', job_id: '' });
  const [score, setScore] = useState(null);
  const [taskId, setTaskId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setScore(null);
  setError('');
  setTaskId('');

  const user_id = parseInt(form.user_id);
  const job_id = parseInt(form.job_id);

  if (isNaN(user_id) || isNaN(job_id)) {
    setError('Please enter valid numbers for user ID and job ID');
    return;
  }

  try {
    const res = await axios.post('http://localhost:5000/api/resume/score', {
      user_id,
      job_id
    }, {
      headers: { Authorization: `Bearer ${user.token}` }
    });

    if (res.data.score !== undefined) {
      setScore(res.data.score);
    } else if (res.data.task_id) {
      setTaskId(res.data.task_id);
    } else {
      setError('Unexpected response format');
    }
  } catch (err) {
    setError(err.response?.data?.msg || '❌ Scoring failed');
  }
};


  return (
    <div style={styles.container}>
      <h2>📊 Score Resume by User ID</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="number"
          placeholder="Candidate User ID"
          value={form.user_id}
          onChange={(e) => setForm({ ...form, user_id: e.target.value })}
          style={styles.input}
          required
        />
        <input
          type="number"
          placeholder="Job ID"
          value={form.job_id}
          onChange={(e) => setForm({ ...form, job_id: e.target.value })}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Score</button>
      </form>

      {score !== null && <p style={styles.score}>✅ Match Score: {score}%</p>}
      {taskId && <p style={styles.task}>⏳ Task started. Task ID: {taskId}</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      <p style={styles.note}>
        This uses the <code>/api/resume/score</code> route. Backend may run <strong>synchronously or via Celery</strong>
        depending on which block is commented in <code>resume_routes.py</code>.
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '50px auto',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
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
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: 12,
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer'
  },
  score: {
    marginTop: 20,
    fontWeight: 'bold',
    color: 'green'
  },
  task: {
    marginTop: 20,
    fontWeight: 'bold',
    color: '#555'
  },
  error: {
    marginTop: 20,
    fontWeight: 'bold',
    color: 'red'
  },
  note: {
    marginTop: 30,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic'
  }
};
