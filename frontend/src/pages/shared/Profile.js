import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, login } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [msg, setMsg] = useState('');

  if (!user) return <h2>Loading...</h2>;

  const handleUpdate = async () => {
    try {
      await axios.put('http://localhost:5000/api/auth/me', {
        name,
        email
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      // update AuthContext state
      login(user.token);  // re-decode with updated name/email
      setMsg(' Profile updated successfully');
    } catch (err) {
      console.error(' Update failed:', err);
      setMsg(' Failed to update profile');
    }
  };

  return (
    <div style={styles.container}>
      <h2>User Profile</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <label>
        <strong>Name:</strong>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
      <label>
        <strong>Email:</strong>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />

      <button onClick={handleUpdate}>Update Profile</button>

      <p>{msg}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: '40px auto',
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
};
