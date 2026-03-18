import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

/* Import Pages from services */

import Home from "./services/Home";
import Login from "./services/Login";
import Register from "./services/Register";
import Dashboard from "./services/Dashboard";
import ReportIssue from "./services/ReportIssue";
// import IssueDetails from "./services/IssueDetails";
import AdminDashboard from "./services/AdminDashboard";
import MyIssues from "./services/MyIssues";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <nav style={{
        background: 'white',
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: '0',
        zIndex: '1000'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#667eea'
        }}>
          🏙️ Smart City
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="/" style={{
            textDecoration: 'none',
            color: '#333',
            fontWeight: '500',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f0f0f0';
            e.target.style.color = '#667eea';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#333';
          }}>
            Home
          </a>

          {isLoggedIn ? (
            <>
              <a href="/dashboard" style={{
                textDecoration: 'none',
                color: '#333',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f0f0f0';
                e.target.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#333';
              }}>
                Dashboard
              </a>

              <a href="/report" style={{
                textDecoration: 'none',
                color: '#333',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f0f0f0';
                e.target.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#333';
              }}>
                Report Issue
              </a>

              <a href="/myissues" style={{
                textDecoration: 'none',
                color: '#333',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f0f0f0';
                e.target.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#333';
              }}>
                My Issues
              </a>

              <a href="/admin" style={{
                textDecoration: 'none',
                color: '#333',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f0f0f0';
                e.target.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#333';
              }}>
                Admin
              </a>

              <button
                onClick={handleLogout}
                style={{
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ee5a24';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ff6b6b';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" style={{
                textDecoration: 'none',
                color: '#667eea',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '8px',
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
              }}>
                Login
              </a>

              <a href="/register" style={{
                textDecoration: 'none',
                color: 'white',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}>
                Sign Up
              </a>
            </>
          )}
        </div>
      </nav>

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportIssue />} />
        {/* <Route path="/issue/:id" element={<IssueDetails />} /> */}
        <Route path="/myissues" element={<MyIssues />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;