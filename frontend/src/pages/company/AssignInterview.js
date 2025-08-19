import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AssignInterview() {
  const { user } = useAuth();
  const [form, setForm] = useState({ user_id: '', job_id: '' });
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setQuestions([]);
    setError('');
    setMessage('');

    const user_id = parseInt(form.user_id);
    const job_id = parseInt(form.job_id);

    if (isNaN(user_id) || isNaN(job_id)) {
      setError('❌ Please enter valid user ID and job ID.');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/interview/assign`, {
        user_id,
        job_id
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (res.data.questions) {
        setQuestions(res.data.questions);
        setMessage('✅ Interview questions generated successfully.');
      } else {
        setError('No questions returned.');
      }
    } catch (err) {
      setError(err.response?.data?.msg || '❌ Assignment failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2>📤 Assign Interview Questions</h2>
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
        <button type="submit" style={styles.button}>Assign Interview</button>
      </form>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {questions.length > 0 && (
        <div style={styles.questionBox}>
          <h4>Generated Questions:</h4>
          <ul>
            {questions.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '50px auto',
    padding: 20,
    backgroundColor: '#fdfdfd',
    borderRadius: 10,
    fontFamily: 'Segoe UI, sans-serif'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  input: {
    padding: 10,
    fontSize: 16,
    border: '1px solid #ccc',
    borderRadius: 5
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
  success: {
    marginTop: 15,
    fontWeight: 'bold',
    color: 'green'
  },
  error: {
    marginTop: 15,
    fontWeight: 'bold',
    color: 'red'
  },
  questionBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 6
  }
};