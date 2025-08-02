import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Shorten from './components/Shorten';
import Statistics from './components/Statistics';
import './styles/native.css';

function App() {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('shorten');
  const [authMode, setAuthMode] = useState('login');

  if (!token) {
    return (
      <div className="login-container">
        {authMode === 'login' ? (
          <Login setToken={setToken} />
        ) : (
          <Register onRegistered={() => setAuthMode('login')} />
        )}
        <div className="auth-toggle">
          <button
            className={authMode === 'login' ? 'active' : ''}
            onClick={() => setAuthMode('login')}
          >
            Login
          </button>
          <button
            className={authMode === 'register' ? 'active' : ''}
            onClick={() => setAuthMode('register')}
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="nav-bar">
        <button
          className={page === 'shorten' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setPage('shorten')}
        >
          Shorten URL
        </button>
        <button
          className={page === 'stats' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setPage('stats')}
        >
          Statistics
        </button>
        <button className="nav-btn logout-btn" onClick={() => setToken(null)}>
          Logout
        </button>
      </nav>

      <main>
        {page === 'shorten' && <Shorten token={token} />}
        {page === 'stats' && <Statistics token={token} />}
      </main>
    </div>
  );
}

export default App;
