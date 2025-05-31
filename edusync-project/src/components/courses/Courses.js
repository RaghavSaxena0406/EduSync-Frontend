import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';

function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    mediaUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editSelectedFile, setEditSelectedFile] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/Courses');
      const coursesData = Array.isArray(response.data) ? response.data : [response.data];
      setCourses(coursesData);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCourses();
    } else {
      setLoading(false);
    }
  }, [user, fetchCourses]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Create course
      const response = await axios.post('/Courses', {
        title: newCourse.title,
        description: newCourse.description,
        mediaUrl: ''
      });

      const courseId = response.data.courseId;
      let mediaUrl = '';

      // Step 2: Upload file if exists
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResponse = await axios.post(`/Courses/${courseId}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        mediaUrl = uploadResponse.data.mediaUrl;

        // Step 3: Update course with media URL
        await axios.put(`/Courses/${courseId}`, {
          title: newCourse.title,
          description: newCourse.description,
          mediaUrl
        });
      }

      setNewCourse({ title: '', description: '', mediaUrl: '' });
      setSelectedFile(null);
      fetchCourses();
    } catch (err) {
      console.error('Error adding course:', err);
      setError('Failed to add course.');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`/Courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course.');
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      let updatedMediaUrl = editingCourse.mediaUrl;

      if (editSelectedFile) {
        const formData = new FormData();
        formData.append('file', editSelectedFile);

        const uploadResponse = await axios.post(`/Courses/${editingCourse.courseId}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        updatedMediaUrl = uploadResponse.data.mediaUrl;
      }

      await axios.put(`/Courses/${editingCourse.courseId}`, {
        ...editingCourse,
        mediaUrl: updatedMediaUrl
      });

      setEditingCourse(null);
      setEditSelectedFile(null);
      fetchCourses();
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingCourse(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="container mt-4">Loading courses...</div>;

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button onClick={fetchCourses} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Courses</h2>

      {user?.role === 'Instructor' && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Add New Course</h3>
            <form onSubmit={handleAddCourse}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" className="form-control" name="title" value={newCourse.title} onChange={handleInputChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" name="description" value={newCourse.description} onChange={handleInputChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="fileUpload" className="form-label">Upload Material (PDF, Video, etc.)</label>
                <input type="file" className="form-control" id="fileUpload" onChange={(e) => setSelectedFile(e.target.files[0])} />
              </div>
              <button type="submit" className="btn btn-primary">Add Course</button>
            </form>
          </div>
        </div>
      )}

      {user?.role === 'Instructor' && editingCourse && (
        <div className="card mb-4">
          <div className="card-body">
            <h3>Edit Course</h3>
            <form onSubmit={handleUpdateCourse}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control" name="title" value={editingCourse.title} onChange={handleEditInputChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" name="description" value={editingCourse.description} onChange={handleEditInputChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Upload New Material (optional)</label>
                <input className="form-control" type="file" onChange={(e) => setEditSelectedFile(e.target.files[0])} />
              </div>
              <button className="btn btn-success" type="submit">Save</button>
              <button className="btn btn-secondary ms-2" onClick={() => setEditingCourse(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {courses.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">No courses available.</div>
          </div>
        ) : (
          courses.map(course => (
            <div key={course.courseId} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  {course.mediaUrl && (
                    <a href={course.mediaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info mb-2">
                      View Material
                    </a>
                  )}
                  <Link to={`/courses/${course.courseId}`} className="btn btn-primary d-block">View Details</Link>
                  {user?.role === 'Instructor' && (
                    <div className="mt-3">
                      <button className="btn btn-warning me-2" onClick={() => setEditingCourse(course)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDeleteCourse(course.courseId)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Courses;
