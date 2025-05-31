import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { useAuth } from '../../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log('Fetching course details for ID:', id);
        console.log('Current user:', user);
        console.log('Auth token:', localStorage.getItem('token'));
        
        setLoading(true);
        const response = await axios.get(`/Courses/${id}`);
        console.log('Course response:', response.data);
        
        setCourse(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching course:', err);
        console.error('Error details:', {
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers
        });
        
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, user]);

  if (loading) {
    return <div className="container mt-4">Loading course details...</div>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Course not found</div>
        <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      {course.mediaUrl && (
        <div className="my-3">
          <a href={course.mediaUrl} target="_blank" rel="noreferrer" className="btn btn-info">
            View Course Material
          </a>
        </div>
      )}
      <div className="mt-3">
        <Link to={`/assessments/course/${course.courseId}`} className="btn btn-primary me-2">
          Take Quiz
        </Link>
        <Link to="/courses" className="btn btn-secondary">
          Back to Courses
        </Link>
      </div>
    </div>
  );
}
