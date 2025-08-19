import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function CandidateFeedback() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [error, setError] = useState('');

  const fetchAllFeedbacks = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/feedback/my`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAllFeedbacks(res.data);
      setFeedbacks(res.data);
      const uniqueJobs = Array.from(
        new Set(res.data.map(fb => fb.job_id))
      ).map(id => {
        const job = res.data.find(f => f.job_id === id);
        return { id, title: job.job_title };
      });
      setJobs(uniqueJobs);
    } catch (err) {
      setError('❌ Failed to fetch feedback');
    }
  }, [user.token]);

  const fetchFeedbackForJob = async (jobId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/feedback/for-job/${jobId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFeedbacks(res.data);
    } catch (err) {
      setError('❌ Failed to fetch job-specific feedback');
    }
  };

  useEffect(() => {
    fetchAllFeedbacks();
  }, [fetchAllFeedbacks]);

  const handleJobChange = (e) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);
    if (jobId === '') {
      setFeedbacks(allFeedbacks);
    } else {
      fetchFeedbackForJob(jobId);
    }
  };

  return (
    <div style={styles.container}>
      <h2>📥 Feedback from Companies</h2>

      <label htmlFor="jobFilter"><strong>Filter by Job:</strong></label>
      <select
        id="jobFilter"
        value={selectedJobId}
        onChange={handleJobChange}
        style={styles.select}
      >
        <option value="">All Jobs</option>
        {jobs.map(job => (
          <option key={job.id} value={job.id}>{job.title}</option>
        ))}
      </select>

      {error && <p style={styles.error}>{error}</p>}

      {feedbacks.length === 0 ? (
        <p>No feedback available.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Feedback</th>
              <th>Company</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f, i) => (
              <tr key={i}>
                <td>{f.job_title || 'N/A'}</td>
                <td>{f.feedback}</td>
                <td>{f.posted_by || f.company_name || 'N/A'}</td>
                <td>{new Date(f.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1000,
    margin: '50px auto',
    padding: 20,
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#fefefe',
    borderRadius: 8
  },
  select: {
    padding: 8,
    marginBottom: 20,
    marginLeft: 10
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  error: {
    color: 'red',
    fontWeight: 'bold'
  }
};
    