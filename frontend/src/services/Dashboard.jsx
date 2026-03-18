import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API from "../config/api";

function Dashboard() {
  const [userStats, setUserStats] = useState({
    totalIssues: 0,
    pendingIssues: 0,
    resolvedIssues: 0
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [communityIssues, setCommunityIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingIssue, setVotingIssue] = useState(null);

  useEffect(() => {
    // Fetch user's issues and stats
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // Fetch user's issues
        const issuesRes = await axios.get(`${API}/user/issues`, config);
        const issues = issuesRes.data;

        setRecentIssues(issues.slice(0, 3)); // Show last 3 issues

        // Calculate stats
        const total = issues.length;
        const pending = issues.filter(issue => issue.status.toLowerCase() === 'pending').length;
        const resolved = issues.filter(issue => issue.status.toLowerCase() === 'resolved').length;

        setUserStats({
          totalIssues: total,
          pendingIssues: pending,
          resolvedIssues: resolved
        });

        // Fetch community issues (all issues, sorted by votes)
        const communityRes = await axios.get(`${API}/issues`, config);
        const allIssues = communityRes.data;
        // Sort by votes descending and take top 6
        const sortedIssues = allIssues.sort((a, b) => (b.votes || 0) - (a.votes || 0)).slice(0, 6);
        setCommunityIssues(sortedIssues);

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const upvoteIssue = async (id) => {
    setVotingIssue(id);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(`${API}/issues/${id}/upvote`, {}, config);

      // Update local state for community issues
      setCommunityIssues(communityIssues.map(issue =>
        issue.id === id ? { ...issue, votes: (issue.votes || 0) + 1 } : issue
      ));
    } catch (err) {
      console.log('Error upvoting:', err);
      alert("Failed to upvote issue");
    } finally {
      setVotingIssue(null);
    }
  };

  const StatCard = ({ title, value, color, icon }) => (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      border: `2px solid ${color}20`,
      transition: 'transform 0.3s, box-shadow 0.3s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          marginRight: '15px'
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{ margin: '0', color: '#333', fontSize: '0.9rem', fontWeight: '600' }}>
            {title}
          </h3>
        </div>
      </div>
      <p style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: color,
        margin: '0'
      }}>
        {value}
      </p>
    </div>
  );

  const ActionCard = ({ title, description, link, icon, color }) => (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
        height: '100%',
        display: 'block'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '15px',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          marginBottom: '15px'
        }}>
          {icon}
        </div>
        <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.2rem' }}>
          {title}
        </h3>
        <p style={{ margin: '0', color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
          {description}
        </p>
      </div>
    </Link>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '30px 40px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            color: '#333',
            fontSize: '2.5rem',
            marginBottom: '10px',
            fontWeight: '700'
          }}>
            Welcome to Smart City
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', margin: '0' }}>
            Manage your community issues and stay connected
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
        {/* Stats Section */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{
            color: '#333',
            fontSize: '1.8rem',
            marginBottom: '30px',
            fontWeight: '600'
          }}>
            Your Activity Overview
          </h2>

          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '150px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid rgba(102, 126, 234, 0.3)',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '25px',
              marginBottom: '40px'
            }}>
              <StatCard
                title="Total Issues"
                value={userStats.totalIssues}
                color="#667eea"
                icon="📊"
              />
              <StatCard
                title="Pending Issues"
                value={userStats.pendingIssues}
                color="#ffa726"
                icon="⏳"
              />
              <StatCard
                title="Resolved Issues"
                value={userStats.resolvedIssues}
                color="#66bb6a"
                icon="✅"
              />
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{
            color: '#333',
            fontSize: '1.8rem',
            marginBottom: '30px',
            fontWeight: '600'
          }}>
            Quick Actions
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '25px'
          }}>
            <ActionCard
              title="Report New Issue"
              description="Found a problem in your community? Report it here so authorities can address it quickly."
              link="/report"
              icon="🚨"
              color="#ff6b6b"
            />
            <ActionCard
              title="View My Issues"
              description="Check the status of all issues you've reported and track their progress."
              link="/myissues"
              icon="📋"
              color="#4ecdc4"
            />
            <ActionCard
              title="Community Issues"
              description="Browse all public issues in the community and see what's being addressed."
              link="/"
              icon="🌆"
              color="#45b7d1"
            />
          </div>
        </div>

        {/* Recent Issues */}
        {!loading && recentIssues.length > 0 && (
          <div>
            <h2 style={{
              color: '#333',
              fontSize: '1.8rem',
              marginBottom: '30px',
              fontWeight: '600'
            }}>
              Recent Issues
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {recentIssues.map(issue => (
                <div key={issue.id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '10px'
                  }}>
                    <h4 style={{
                      margin: '0',
                      color: '#333',
                      fontSize: '1.1rem',
                      flex: '1'
                    }}>
                      {issue.title}
                    </h4>
                    <span style={{
                      background: issue.status.toLowerCase() === 'pending' ? '#ffa726' :
                                 issue.status.toLowerCase() === 'resolved' ? '#66bb6a' : '#42a5f5',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {issue.status}
                    </span>
                  </div>
                  <p style={{
                    color: '#666',
                    fontSize: '0.9rem',
                    marginBottom: '10px',
                    lineHeight: '1.4'
                  }}>
                    {issue.description.length > 80
                      ? `${issue.description.substring(0, 80)}...`
                      : issue.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#888',
                    fontSize: '0.8rem'
                  }}>
                    <span>📍 {issue.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Issues */}
        {!loading && communityIssues.length > 0 && (
          <div>
            <h2 style={{
              color: '#333',
              fontSize: '1.8rem',
              marginBottom: '30px',
              fontWeight: '600'
            }}>
              Popular Community Issues
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {communityIssues.map(issue => (
                <div key={issue.id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  border: '1px solid #e0e0e0',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '10px'
                  }}>
                    <h4 style={{
                      margin: '0',
                      color: '#333',
                      fontSize: '1.1rem',
                      flex: '1'
                    }}>
                      {issue.title}
                    </h4>
                    <span style={{
                      background: issue.status.toLowerCase() === 'pending' ? '#ffa726' :
                                 issue.status.toLowerCase() === 'resolved' ? '#66bb6a' : '#42a5f5',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {issue.status}
                    </span>
                  </div>
                  <p style={{
                    color: '#666',
                    fontSize: '0.9rem',
                    marginBottom: '15px',
                    lineHeight: '1.4'
                  }}>
                    {issue.description.length > 100
                      ? `${issue.description.substring(0, 100)}...`
                      : issue.description}
                  </p>

                  {/* Vote Section */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span style={{
                        fontSize: '1rem',
                        color: '#4ecdc4'
                      }}>
                        👍 {issue.votes || 0}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          upvoteIssue(issue.id);
                        }}
                        disabled={votingIssue === issue.id}
                        style={{
                          padding: '6px 12px',
                          background: votingIssue === issue.id ? '#ccc' : '#4ecdc4',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: votingIssue === issue.id ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (votingIssue !== issue.id) {
                            e.target.style.transform = 'scale(1.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (votingIssue !== issue.id) {
                            e.target.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        {votingIssue === issue.id ? 'Voting...' : 'Upvote'}
                      </button>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#888',
                    fontSize: '0.8rem'
                  }}>
                    <span>📍 {issue.location}</span>
                    {issue.category && (
                      <span style={{
                        background: '#f0f0f0',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        marginLeft: '10px'
                      }}>
                        {issue.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
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

export default Dashboard;