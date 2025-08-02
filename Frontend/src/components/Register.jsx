import React, { useState } from 'react';

const Register = ({ onRegistered }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registration successful! You can now log in.');
        setUsername('');
        setEmail('');
        setPassword('');
        if (onRegistered) onRegistered();
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 style={{ marginBottom: '24px' }}>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ marginTop: '8px' }}>Register</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="result">{success}</div>}
      </form>
    </div>
  );
};

export default Register;
