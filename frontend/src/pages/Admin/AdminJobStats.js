import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminJobStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/job-stats', {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => setStats(res.data)).catch(console.error);
  }, [user]);

  return (
    <div style={{ padding: '30px' }}>
      <h2>Job Stats</h2>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
