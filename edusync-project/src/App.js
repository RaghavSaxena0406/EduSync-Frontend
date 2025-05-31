import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Courses from './components/courses/Courses';
import CourseDetail from './components/courses/CourseDetail';
import Assessments from './components/assessments/Assessments';
import CreateAssessment from './components/assessments/CreateAssessment';
import EditAssessment from './components/assessments/EditAssessment';
import QuizV2 from './components/assessments/QuizV2';
import Results from './components/assessments/Results';
import Home from './Home';
import ProtectedRoute from './components/auth/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
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
            <ul className="navbar-nav ms-auto">
              {user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/courses">Courses</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/results">Results</Link>
                  </li>
                  <li className="nav-item">
                    <button onClick={handleLogout} className="btn btn-outline-light ms-2">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/courses" element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        } />
        <Route path="/courses/:id" element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        } />
        <Route path="/assessments/course/:courseId" element={
          <ProtectedRoute>
            <Assessments />
          </ProtectedRoute>
        } />
        <Route path="/assessments/course/:courseId/create" element={
          <ProtectedRoute>
            <CreateAssessment />
          </ProtectedRoute>
        } />
        <Route path="/assessments/course/:courseId/edit/:assessmentId" element={
          <ProtectedRoute>
            <EditAssessment />
          </ProtectedRoute>
        } />
        <Route path="/quiz/:assessmentId" element={
          <ProtectedRoute>
            <QuizV2 />
          </ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        } />
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
