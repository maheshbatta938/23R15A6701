import React, { useState } from 'react';

const Shorten = ({ token }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [validity, setValidity] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!originalUrl.trim()) {
      setError('Please enter a valid URL.');
      return;
    }

    const body = { originalUrl };
    if (validity) body.expiry = validity;
    if (shortcode) body.shortId = shortcode;

    try {
      const res = await fetch('http://localhost:3000/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Error shortening URL');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <div className="shorten-container">
      <form onSubmit={handleSubmit} className="shorten-form">
        <h2>Shorten URL</h2>
        <input
          type="url"
          placeholder="Long URL"
          value={originalUrl}
          onChange={e => setOriginalUrl(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          placeholder="Expiry (optional)"
          value={validity}
          onChange={e => setValidity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Custom shortcode (optional)"
          value={shortcode}
          onChange={e => setShortcode(e.target.value)}
        />
        <button type="submit">Shorten</button>
        {error && <div className="error">{error}</div>}
        {result && (
          <div className="result">
            Short URL:{' '}
            <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
              {result.shortUrl}
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default Shorten;
