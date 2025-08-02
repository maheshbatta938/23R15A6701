import React, { useEffect, useState } from 'react';

const Statistics = ({ token }) => {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/statistics/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
          setStats(data.urls || []);
          setError('');
        } else {
          setStats([]);
          setError(data.error || `Error: ${res.status}`);
        }
      } catch (err) {
        setStats([]);
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div className="stats-container">
      <h2>URL Statistics</h2>
      {loading && <p>Loading statistics...</p>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && stats.length === 0 && <p>No URLs found.</p>}
      {!loading && stats.length > 0 && (
        <table className="stats-table">
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Long URL</th>
              <th>Created At</th>
              <th>Expiry</th>
              <th>Clicks</th>
              <th>Sources</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(url => (
              <tr key={url.shortId}>
                <td><a href={`http://localhost:3000/${url.shortId}`} target="_blank" rel="noopener noreferrer">{`http://localhost:3000/${url.shortId}`}</a></td>
                <td style={{ wordBreak: 'break-word' }}>{url.originalUrl}</td>
                <td>{url.createdAt ? new Date(url.createdAt).toLocaleString() : 'N/A'}</td>
                <td>{url.expiry ? new Date(url.expiry).toLocaleString() : 'N/A'}</td>
                <td>{url.clicks || 0}</td>
                <td>{url.sources && url.sources.length ? url.sources.join(', ') : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Statistics;
