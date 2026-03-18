import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API from "../config/api";  

function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingIssue, setUpdatingIssue] = useState(null);

  useEffect(() => {
    fetchIssues();
  }, []);

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

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.get("http://localhost:5000/api/issues", config);
      setIssues(res.data);
      setFilteredIssues(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingIssue(id);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(
        `http://localhost:5000/api/issues/${id}`,
        { status },
        config
      );

      // Update local state
      setIssues(issues.map(issue =>
        issue.id === id ? { ...issue, status } : issue
      ));
    } catch (err) {
      console.log(err);
      alert("Failed to update issue status");
    } finally {
      setUpdatingIssue(null);
    }
  };

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStats = () => {
    const total = issues.length;
    const pending = issues.filter(issue => issue.status.toLowerCase() === 'pending').length;
    const inProgress = issues.filter(issue => issue.status.toLowerCase() === 'in progress').length;
    const resolved = issues.filter(issue => issue.status.toLowerCase() === 'resolved').length;
    return { total, pending, inProgress, resolved };
  };

  const stats = getStats();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 20px'
          }}>
            👑
          </div>
          <h1 style={{
            color: '#333',
            fontSize: '2.2rem',
            marginBottom: '10px',
            fontWeight: '700'
          }}>
            Admin Dashboard
          </h1>
          <p style={{
            color: '#666',
            fontSize: '1.1rem',
            margin: '0'
          }}>
            Manage and resolve community issues
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '25px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: '2px solid #667eea20'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: '#667eea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 15px'
            }}>
              📊
            </div>
            <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '0.9rem', fontWeight: '600' }}>
              Total Issues
            </h3>
            <p style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#667eea',
              margin: '0'
            }}>
              {stats.total}
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: '2px solid #ffa72620'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: '#ffa726',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 15px'
            }}>
              ⏳
            </div>
            <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '0.9rem', fontWeight: '600' }}>
              Pending
            </h3>
            <p style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#ffa726',
              margin: '0'
            }}>
              {stats.pending}
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: '2px solid #42a5f520'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: '#42a5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 15px'
            }}>
              🔄
            </div>
            <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '0.9rem', fontWeight: '600' }}>
              In Progress
            </h3>
            <p style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#42a5f5',
              margin: '0'
            }}>
              {stats.inProgress}
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: '2px solid #66bb6a20'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: '#66bb6a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 15px'
            }}>
              ✅
            </div>
            <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '0.9rem', fontWeight: '600' }}>
              Resolved
            </h3>
            <p style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#66bb6a',
              margin: '0'
            }}>
              {stats.resolved}
            </p>
          </div>
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
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
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
                    border: filter === status ? '2px solid #667eea' : '2px solid #e0e0e0',
                    borderRadius: '25px',
                    background: filter === status ? '#667eea' : 'white',
                    color: filter === status ? 'white' : '#333',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize'
                  }}
                  onMouseEnter={(e) => {
                    if (filter !== status) {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.color = '#667eea';
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
              border: '4px solid rgba(102, 126, 234, 0.3)',
              borderTop: '4px solid #667eea',
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
                  No issues found
                </h3>
                <p style={{ color: '#666' }}>
                  {issues.length === 0
                    ? 'No issues have been reported yet.'
                    : 'Try adjusting your search or filter criteria.'}
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                gap: '25px'
              }}>
                {filteredIssues.map(issue => (
                  <div key={issue.id} style={{
                    background: 'white',
                    borderRadius: '15px',
                    padding: '25px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0,0,0,0.05)'
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
                      {issue.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: '#888',
                      fontSize: '0.85rem',
                      marginBottom: '20px'
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

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap'
                    }}>
                      {issue.status.toLowerCase() !== 'in progress' && (
                        <button
                          onClick={() => updateStatus(issue.id, 'in progress')}
                          disabled={updatingIssue === issue.id}
                          style={{
                            padding: '8px 16px',
                            background: updatingIssue === issue.id ? '#ccc' : '#42a5f5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: updatingIssue === issue.id ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (updatingIssue !== issue.id) {
                              e.target.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (updatingIssue !== issue.id) {
                              e.target.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          {updatingIssue === issue.id ? 'Updating...' : 'Start Work'}
                        </button>
                      )}

                      {issue.status.toLowerCase() !== 'resolved' && (
                        <button
                          onClick={() => updateStatus(issue.id, 'resolved')}
                          disabled={updatingIssue === issue.id}
                          style={{
                            padding: '8px 16px',
                            background: updatingIssue === issue.id ? '#ccc' : '#66bb6a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: updatingIssue === issue.id ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (updatingIssue !== issue.id) {
                              e.target.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (updatingIssue !== issue.id) {
                              e.target.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          {updatingIssue === issue.id ? 'Updating...' : 'Mark Resolved'}
                        </button>
                      )}

                      {issue.status.toLowerCase() !== 'closed' && (
                        <button
                          onClick={() => updateStatus(issue.id, 'closed')}
                          disabled={updatingIssue === issue.id}
                          style={{
                            padding: '8px 16px',
                            background: updatingIssue === issue.id ? '#ccc' : '#999',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: updatingIssue === issue.id ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (updatingIssue !== issue.id) {
                              e.target.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (updatingIssue !== issue.id) {
                              e.target.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          {updatingIssue === issue.id ? 'Updating...' : 'Close Issue'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              background: 'transparent',
              color: '#667eea',
              padding: '12px 30px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              border: '2px solid #667eea',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#667eea';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#667eea';
            }}
          >
            ← Back to Home
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

export default AdminDashboard;