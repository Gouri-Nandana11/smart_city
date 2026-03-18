import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/issues")
      .then(res => {
        setIssues(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#ffa726';
      case 'in progress': return '#42a5f5';
      case 'resolved': return '#66bb6a';
      default: return '#999';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Hero Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '60px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '20px',
          fontWeight: '300',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Smart City Issue Tracker
        </h1>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '30px',
          opacity: '0.9'
        }}>
          Report and track community issues for a better city
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Link to="/login" style={{
            background: 'white',
            color: '#667eea',
            padding: '12px 30px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }}>
            Login
          </Link>
          <Link to="/register" style={{
            background: 'transparent',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: '600',
            border: '2px solid white',
            transition: 'all 0.2s'
          }}>
            Register
          </Link>
        </div>
      </div>

      {/* Issues Section */}
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: '40px',
          fontSize: '2.5rem',
          fontWeight: '300'
        }}>
          Recent Issues
        </h2>

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {issues.map(issue => (
              <div key={issue.id} style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    color: '#333',
                    margin: '0',
                    flex: '1'
                  }}>
                    {issue.title}
                  </h3>
                  <span style={{
                    background: getStatusColor(issue.status),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {issue.status}
                  </span>
                </div>

                <p style={{
                  color: '#666',
                  marginBottom: '15px',
                  lineHeight: '1.5'
                }}>
                  {issue.description.length > 100
                    ? `${issue.description.substring(0, 100)}...`
                    : issue.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#888',
                  fontSize: '0.9rem',
                  marginBottom: '15px'
                }}>
                  <span style={{ marginRight: '20px' }}>
                    📍 {issue.location}
                  </span>
                </div>

                <Link
                  to={`/issue/${issue.id}`}
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loading && issues.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: 'white',
            padding: '60px 20px'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
              No issues reported yet
            </h3>
            <p>Be the first to report an issue in your community!</p>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Home;