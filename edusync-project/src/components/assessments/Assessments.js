import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { useAuth } from '../../context/AuthContext';

function Assessments() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchAssessments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/Assessments/GetCourse/${courseId}`);
      setAssessments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      if (err.response?.status === 404) {
        setAssessments([]);
        setError(null);
      } else {
        setError('Failed to load assessments. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const handleDelete = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      await axios.delete(`/Assessments/${assessmentId}`);
      fetchAssessments();
    } catch (err) {
      console.error('Error deleting assessment:', err);
      setError('Failed to delete assessment. Please try again later.');
    }
  };

  const handleEdit = (assessmentId) => {
    navigate(`/assessments/course/${courseId}/edit/${assessmentId}`);
  };

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  if (loading) {
    return <div className="container mt-4">Loading assessments...</div>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Course Assessments</h2>
        {user?.role === 'Instructor' && (
          <Link to={`/assessments/course/${courseId}/create`} className="btn btn-primary">
            Create New Assessment
          </Link>
        )}
      </div>

      {assessments.length === 0 ? (
        <div className="alert alert-info">
          <h4>No assessments available</h4>
          <p>There are no assessments available for this course yet.</p>
        </div>
      ) : (
        <div className="list-group">
          {assessments.map(assessment => (
            <div key={assessment.assessmentId} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{assessment.title}</h5>
                  <p className="mb-1">Max Score: {assessment.maxScore}</p>
                </div>
                <div className="d-flex gap-2">
                  <Link 
                    to={`/quiz/${assessment.assessmentId}`} 
                    className="btn btn-primary"
                  >
                    Take Assessment
                  </Link>
                  {user?.role === 'Instructor' && (
                    <>
                      <button
                        onClick={() => handleEdit(assessment.assessmentId)}
                        className="btn btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(assessment.assessmentId)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3">
        <Link to={`/courses/${courseId}`} className="btn btn-secondary me-2">
          Back to Course
        </Link>
        <Link to="/courses" className="btn btn-outline-secondary">
          All Courses
        </Link>
      </div>
    </div>
  );
}

export default Assessments; 