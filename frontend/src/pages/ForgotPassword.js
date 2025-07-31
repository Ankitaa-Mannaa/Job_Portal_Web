import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMsg(res.data.msg);
    } catch (err) {
      setError(err.response?.data?.msg || 'Request failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <label>Email:</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginTop: 10, marginBottom: 20 }}
        />

        <button type="submit" style={{ padding: 10, width: '100%' }}>Send Reset Link</button>
      </form>

      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
