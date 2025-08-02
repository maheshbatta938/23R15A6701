import React, { useEffect, useState } from 'react';

const Statistics = ({ token }) => {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:3000/statistics/all', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            });

            const data = await res.json();
            

            if (!res.ok) {
            setError(data.error || 'Error fetching statistics');
            setStats([]);
            } else {
            setStats(data.urls || []);
            setError('');
            }
        } 
        catch (err) {
            console.error('Fetch error:', err);
            setError('Network error');
            setStats([]);
        }
        };

        if (token) {
        fetchStats();
        }
    }, [token]);

    return (
    <div
      className="stats-container"
      style={{
        maxWidth: 700,
        margin: '40px auto',
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          color: '#007bff',
          marginBottom: 24,
          fontWeight: '700',
          fontSize: '1.8rem',
          letterSpacing: 1,
        }}
      >
        URL Statistics
      </h2>

      {error && (
        <div
          role="alert"
          style={{
            color: '#d32f2f',
            marginBottom: 20,
            textAlign: 'center',
            fontWeight: '600',
          }}
        >
          {error}
        </div>
      )}

      {!error && stats.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            color: '#555',
            marginBottom: 20,
            fontSize: '1rem',
          }}
        >
          No URL statistics found.
        </div>
      )}

      {stats.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <thead style={{ backgroundColor: '#f0f0f0' }}>
              <tr>
                {[
                  'Short URL',
                  'Long URL',
                  'Created At',
                  'Expiry',
                  'Clicks',
                  'Sources',
                ].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      borderBottom: '2px solid #ddd',
                      userSelect: 'none',
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {stats.map((url) => (
                <tr
                  key={url.shortId}
                  style={{
                    borderBottom: '1px solid #eee',
                    verticalAlign: 'top',
                    transition: 'background-color 0.15s ease-in-out',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#fafafa')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  <td
                    style={{
                      padding: '10px 16px',
                      color: '#007bff',
                      wordBreak: 'break-word',
                    }}
                  >
                    <a
                      href={`http://localhost:3000/${url.shortId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: '#007bff' }}
                    >
                      {`http://localhost:3000/${url.shortId}`}
                    </a>
                  </td>

                  <td
                    style={{
                      padding: '10px 16px',
                      wordBreak: 'break-word',
                      maxWidth: 250,
                      fontSize: '0.9rem',
                      color: '#333',
                    }}
                    title={url.originalUrl}
                  >
                    {url.originalUrl}
                  </td>

                  <td
                    style={{
                      padding: '10px 16px',
                      whiteSpace: 'nowrap',
                      fontSize: '0.9rem',
                      color: '#555',
                    }}
                  >
                    {url.createdAt
                      ? new Date(url.createdAt).toLocaleString()
                      : 'N/A'}
                  </td>

                  <td
                    style={{
                      padding: '10px 16px',
                      whiteSpace: 'nowrap',
                      fontSize: '0.9rem',
                      color: '#555',
                    }}
                  >
                    {url.expiry
                      ? new Date(url.expiry).toLocaleString()
                      : 'N/A'}
                  </td>

                  <td
                    style={{
                      padding: '10px 16px',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      color: '#222',
                    }}
                  >
                    {url.clicks || 0}
                  </td>

                  <td
                    style={{
                      padding: '10px 16px',
                      wordBreak: 'break-word',
                      fontSize: '0.9rem',
                      color: '#555',
                    }}
                    title={
                      url.sources && url.sources.length
                        ? url.sources.join(', ')
                        : ''
                    }
                  >
                    {url.sources && url.sources.length
                      ? url.sources.join(', ')
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Statistics;
