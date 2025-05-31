import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // Check if we have user data in localStorage
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');

  console.log('ProtectedRoute Debug:', {
    user,
    storedUser: storedUser ? JSON.parse(storedUser) : null,
    storedToken: storedToken ? 'exists' : 'not found',
    currentPath: location.pathname
  });

  // If we have a token but no user in context, try to restore the user
  if (!user && storedUser && storedToken) {
    console.log('Restoring user from localStorage');
    // The AuthContext will handle this on next render
    return <Navigate to={location.pathname} replace />;
  }

  // If we have neither user nor token, redirect to login
  if (!user && !storedToken) {
    console.log('No authentication found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we have either user or token, render the protected content
  console.log('User authenticated, rendering protected content');
  return children;
}

export default ProtectedRoute; 