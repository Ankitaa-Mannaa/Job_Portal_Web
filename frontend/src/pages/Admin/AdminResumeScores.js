import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminResumeScores() {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/resume-scores', {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => setScores(res.data)).catch(console.error);
  }, [user]);

  return (
    <div style={{ padding: '30px' }}>
      <h2>Resume Score Analytics</h2>
      <pre>{JSON.stringify(scores, null, 2)}</pre>
    </div>
  );
}
