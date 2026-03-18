import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API from "../config/api";  

function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [votingIssue, setVotingIssue] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log('Fetching user issues with token:', token);
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const res = await axios.get(`${API}/user/issues`, config);
        console.log('Fetched issues:', res.data);
        setIssues(res.data);
        setFilteredIssues(res.data);
        setLoading(false);
      } catch (err) {
        console.log('Error fetching issues:', err);
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const upvoteIssue = async (id) => {
    setVotingIssue(id);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: token }
      };

      await axios.put(`${API}/issues/${id}/upvote`, {}, config);

      // Update local state
      setIssues(issues.map(issue =>
        issue.id === id ? { ...issue, votes: (issue.votes || 0) + 1 } : issue
      ));
    } catch (err) {
      console.log('Error upvoting:', err);
      alert("Failed to upvote issue");
    } finally {
      setVotingIssue(null);
    }
  };

  useEffect(() => {
    let filtered = issues;

    // Filter by status
    if (filter !== "all") {
      filtered = filtered.filter(issue => issue.status.toLowerCase() === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredIssues(filtered);
  }, [issues, filter, searchTerm]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#ffa726';
      case 'in progress': return '#42a5f5';
      case 'resolved': return '#66bb6a';
      case 'closed': return '#999';
      default: return '#999';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳';
      case 'in progress': return '🔄';
      case 'resolved': return '✅';
      case 'closed': return '❌';
      default: return '📋';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 20px'
          }}>
            📋
          </div>
          <h1 style={{
            color: '#333',
            fontSize: '2.2rem',
            marginBottom: '10px',
            fontWeight: '700'
          }}>
            My Reported Issues
          </h1>
          <p style={{
            color: '#666',
            fontSize: '1.1rem',
            margin: '0'
          }}>
            Track the status of all issues you've reported
          </p>
        </div>

        {/* Filters and Search */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            alignItems: 'center'
          }}>
            {/* Search */}
            <div style={{ flex: '1', minWidth: '250px' }}>
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4ecdc4'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['all', 'pending', 'in progress', 'resolved', 'closed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  style={{
                    padding: '10px 20px',
                    border: filter === status ? '2px solid #4ecdc4' : '2px solid #e0e0e0',
                    borderRadius: '25px',
                    background: filter === status ? '#4ecdc4' : 'white',
                    color: filter === status ? 'white' : '#333',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize'
                  }}
                  onMouseEnter={(e) => {
                    if (filter !== status) {
                      e.target.style.borderColor = '#4ecdc4';
                      e.target.style.color = '#4ecdc4';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filter !== status) {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.color = '#333';
                    }
                  }}
                >
                  {status === 'all' ? 'All Issues' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Issues List */}
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
              border: '4px solid rgba(78, 205, 196, 0.3)',
              borderTop: '4px solid #4ecdc4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        ) : (
          <div>
            {filteredIssues.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '60px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  margin: '0 auto 20px'
                }}>
                  📭
                </div>
                <h3 style={{ color: '#333', marginBottom: '10px', fontSize: '1.5rem' }}>
                  {issues.length === 0 ? 'No issues reported yet' : 'No issues match your filters'}
                </h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  {issues.length === 0
                    ? 'Start by reporting your first community issue!'
                    : 'Try adjusting your search or filter criteria.'}
                </p>
                {issues.length === 0 && (
                  <Link
                    to="/report"
                    style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                      color: 'white',
                      padding: '12px 30px',
                      borderRadius: '25px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    Report First Issue
                  </Link>
                )}
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '25px'
              }}>
                {filteredIssues.map(issue => (
                  <div key={issue.id} style={{
                    background: 'white',
                    borderRadius: '15px',
                    padding: '25px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer',
                    border: '1px solid rgba(0,0,0,0.05)'
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
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '15px'
                    }}>
                      <h3 style={{
                        fontSize: '1.2rem',
                        color: '#333',
                        margin: '0',
                        flex: '1',
                        lineHeight: '1.3'
                      }}>
                        {issue.title}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: getStatusColor(issue.status),
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        <span style={{ marginRight: '5px' }}>
                          {getStatusIcon(issue.status)}
                        </span>
                        {issue.status}
                      </div>
                    </div>

                    <p style={{
                      color: '#666',
                      marginBottom: '15px',
                      lineHeight: '1.5',
                      fontSize: '0.95rem'
                    }}>
                      {issue.description.length > 120
                        ? `${issue.description.substring(0, 120)}...`
                        : issue.description}
                    </p>

                    {/* Vote Section */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <span style={{
                          fontSize: '1.2rem',
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
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: '#888',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span>📍 {issue.location}</span>
                        {issue.createdAt && (
                          <span>📅 {formatDate(issue.createdAt)}</span>
                        )}
                      </div>
                      {issue.category && (
                        <span style={{
                          background: '#f0f0f0',
                          padding: '4px 8px',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {issue.category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Back to Dashboard */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-block',
              background: 'transparent',
              color: '#4ecdc4',
              padding: '12px 30px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              border: '2px solid #4ecdc4',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#4ecdc4';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#4ecdc4';
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>
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

export default MyIssues;