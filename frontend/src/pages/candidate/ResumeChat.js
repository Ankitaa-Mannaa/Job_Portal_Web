import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ResumeChat() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');

  const sendMessage = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/chat/resume', { message: input }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setReply(res.data.reply);
    } catch (err) {
      setReply('Failed to fetch response');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h2>Ask about your Resume</h2>
      <textarea rows="3" value={input} onChange={(e) => setInput(e.target.value)} />
      <br />
      <button onClick={sendMessage}>Ask</button>
      <p><strong>Bot:</strong> {reply}</p>
    </div>
  );
}
