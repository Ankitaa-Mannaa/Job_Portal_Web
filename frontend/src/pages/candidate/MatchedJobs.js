import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function MatchedJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/resume/recommendations`, {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => setJobs(res.data)).catch(console.error);
  }, [user.token]);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h2>Recommended Jobs</h2>
      <ul>
        {jobs.map((item, index) => (
          <li key={index}>
            <h3>{item.job.title}</h3>
            <p>{item.job.description}</p>
            <p><strong>Match Score:</strong> {item.score.toFixed(2)}%</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
