import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function UploadResume() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMsg(res.data.msg || 'Uploaded');
    } catch (err) {
      setMsg('Upload failed.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload Resume</h2>
      <form onSubmit={handleUpload} style={styles.form}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit">Upload</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: '40px auto' },
  form: { display: 'flex', gap: 10 }
};
