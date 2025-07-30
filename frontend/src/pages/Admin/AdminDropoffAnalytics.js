import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminDropoffAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/dropoff-analytics', {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => setData(res.data)).catch(console.error);
  }, [user]);

  return (
    <div style={{ padding: '30px' }}>
      <h2>Drop-off Analytics</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
