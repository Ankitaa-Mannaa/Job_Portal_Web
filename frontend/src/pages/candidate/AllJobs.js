import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AllJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/job/', {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => setJobs(res.data)).catch(console.error);
  }, [user.token]);

  const applyToJob = async (job_id) => {
    try {
      const res = await axios.post('http://localhost:5000/api/apply/', { job_id }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg('Apply failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Available Jobs</h2>
      {msg && <p>{msg}</p>}
      <ul>
        {jobs.map(job => (
          <li key={job.id} style={styles.job}>
            <strong>{job.title}</strong><br />
            <em>{job.description}</em><br />
            <button onClick={() => applyToJob(job.id)}>Apply</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '40px auto' },
  job: { marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 }
};
