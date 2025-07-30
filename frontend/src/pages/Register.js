import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    role: 'candidate', // default role
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        form
      );
      alert(res.data.msg); // Optional toast

      // Auto redirect to login after success
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.msg || 'Registration failed. Try again.'
      );
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          style={styles.input}
        />
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
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="candidate">Candidate</option>
          <option value="company">Company</option>
        </select>

        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
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
    backgroundColor: '#007bff',
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
