import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminExportReport() {
  const { user } = useAuth();

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/export-report', {
      headers: { Authorization: `Bearer ${user.token}` },
      responseType: 'blob'
    }).then(res => {
      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.csv');
      document.body.appendChild(link);
      link.click();
    }).catch(console.error);
  }, [user]);

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h3>Exporting Report...</h3>
    </div>
  );
}
