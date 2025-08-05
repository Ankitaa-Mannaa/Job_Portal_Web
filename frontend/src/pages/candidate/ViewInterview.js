import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ViewInterview() {
  const { user } = useAuth();
  const [jobId, setJobId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/interview/assigned/${jobId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setQuestions(res.data.questions);
      setError('');
    } catch (err) {
      setQuestions([]);
      setError(err.response?.data?.msg || 'Failed to fetch');
    }
  };

  return (
    <div style={styles.container}>
      <h2>📄 My Interview Questions</h2>
      <input type="number" placeholder="Enter Job ID" value={jobId} onChange={(e) => setJobId(e.target.value)} />
      <button onClick={fetchQuestions}>Get Questions</button>
      {questions.length > 0 && <ul>{questions.map((q, i) => <li key={i}>{q}</li>)}</ul>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: 'auto', padding: 20 }
};
