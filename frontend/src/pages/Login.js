import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const { login } = useAuth();  // pull login from context

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
      form
    );
    const token = res.data.access_token;

    if (!token) throw new Error("No token received from backend");

    const success = await login(token);
    if (success) {
      navigate('/');
    }
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(
        err.response?.data?.msg || 'Login failed. Please check your credentials.'
      );
    }
  };


  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <div style={{ marginTop: 20 }}>
      <span>Don't have an account? </span>
      <button
        onClick={() => navigate('/register')}
        style={{
          background: 'none',
          border: 'none',
          color: '#007bff',
          cursor: 'pointer',
          textDecoration: 'underline',
          fontSize: 14
        }}
      >
        Register here
      </button>
    </div>
  </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '50px auto',
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 8,
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    padding: 10,
    fontSize: 16,
  },
  button: {
    padding: 10,
    backgroundColor: '#28a745',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: 14,
  },
};
