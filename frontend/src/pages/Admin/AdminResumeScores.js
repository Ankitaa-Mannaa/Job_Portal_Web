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
      <table border="1" cellPadding={8}>
      <thead>
        <tr>
          <th>Job Title</th>
          <th>Job ID</th>
          <th>Avg. Resume Score</th>
          <th>Candidates Scored</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((row, i) => (
          <tr key={i}>
            <td>{row.job_title}</td>
            <td>{row.job_id}</td>
            <td>{row.avg_score}</td>
            <td>{row.num_candidates}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
