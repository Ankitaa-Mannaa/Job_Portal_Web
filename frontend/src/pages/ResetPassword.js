import { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        password
      });
      setMsg(res.data.msg);
    } catch (err) {
      setError(err.response?.data?.msg || 'Reset failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
      <h2>Reset Your Password</h2>

      <form onSubmit={handleSubmit}>
        <label>New Password:</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ width: '100%', padding: 8, marginTop: 10, marginBottom: 20 }}
        />

        <button type="submit" style={{ padding: 10, width: '100%' }}>Reset Password</button>
      </form>

      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
