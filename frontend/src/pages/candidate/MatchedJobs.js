import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function MatchedJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/resume/recommendations', {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => setJobs(res.data)).catch(console.error);
  }, [user.token]);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h2>Recommended Jobs</h2>
      <ul>
        {jobs.map((job, i) => (
          <li key={i}>
            <strong>{job.title}</strong><br />
            {job.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
