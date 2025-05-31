import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">EduSync</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/courses">Courses</Link>
            </li>
            {/* {user?.role === 'Instructor' && (
              <li className="nav-item">
                <Link className="nav-link" to="/courses/new">Upload</Link>
              </li>
            )} */}
            {user?.role === 'Instructor' && (
              <li className="nav-item">
                <Link className="nav-link" to="/analytics">Dashboard</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/results">Results</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="text-light me-3">Welcome, {user.name}</span>
                <button 
                  className="btn btn-outline-light" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link className="btn btn-outline-light" to="/login">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
