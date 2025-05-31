import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';

function CreateAssessment() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState({
    title: '',
    questions: [],
    maxScore: 0
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    score: 1
  });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssessment(prev => ({
      ...prev,
      [name]: name === 'maxScore' ? parseInt(value) || 0 : value
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: name === 'correctAnswer' || name === 'score' ? parseInt(value) || 0 : value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.text || currentQuestion.options.some(opt => !opt)) {
      setError('Please fill in all question fields');
      return;
    }

    if (currentQuestion.score <= 0) {
      setError('Question score must be greater than 0');
      return;
    }

    const newQuestion = JSON.parse(JSON.stringify(currentQuestion)); // 🔑 Deep clone

    if (editingIndex >= 0) {
      const updatedQuestions = [...assessment.questions];
      updatedQuestions[editingIndex] = newQuestion;
      setAssessment(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
      setEditingIndex(-1);
    } else {
      setAssessment(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));
    }

    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      score: 1
    });
    setError(null);
  };

  const editQuestion = (index) => {
    const questionToEdit = assessment.questions[index];
    setCurrentQuestion(questionToEdit);
    setEditingIndex(index);
  };

  const deleteQuestion = (index) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (assessment.questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    if (assessment.maxScore <= 0) {
      setError('Please enter a valid maximum score greater than 0');
      return;
    }

    const totalQuestionScore = assessment.questions.reduce((sum, q) => sum + q.score, 0);
    if (totalQuestionScore !== assessment.maxScore) {
      setError(`Total question scores (${totalQuestionScore}) must equal the maximum score (${assessment.maxScore})`);
      return;
    }

    try {
      setIsSubmitting(true);
      const assessmentData = {
        title: assessment.title,
        questions: JSON.stringify(assessment.questions),
        maxScore: assessment.maxScore,
        courseId: courseId
      };

      console.log('Sending assessment data:', assessmentData);
      const response = await axios.post(`/Assessments/ByCourse/${courseId}/create`, assessmentData);
      console.log('Assessment created:', response.data);

      setTimeout(() => {
        navigate(`/assessments/course/${courseId}`, { replace: true });
      }, 100);
    } catch (err) {
      console.error('Error creating assessment:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create assessment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Assessment</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Assessment Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={assessment.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="maxScore" className="form-label">Maximum Score</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              id="maxScore"
              name="maxScore"
              value={assessment.maxScore}
              onChange={handleInputChange}
              min="1"
              required
            />
            <span className="input-group-text">points</span>
          </div>
          <small className="form-text text-muted">
            Total points possible for this assessment
          </small>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h4>{editingIndex >= 0 ? 'Edit Question' : 'Add Question'}</h4>
            <div className="mb-3">
              <label htmlFor="questionText" className="form-label">Question Text</label>
              <input
                type="text"
                className="form-control"
                id="questionText"
                name="text"
                value={currentQuestion.text}
                onChange={handleQuestionChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="questionScore" className="form-label">Question Score</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  id="questionScore"
                  name="score"
                  value={currentQuestion.score}
                  onChange={handleQuestionChange}
                  min="1"
                  required
                />
                <span className="input-group-text">points</span>
              </div>
              <small className="form-text text-muted">
                Points awarded for this question
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Options</label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="mb-3">
              <label htmlFor="correctAnswer" className="form-label">Correct Answer</label>
              <select
                className="form-select"
                id="correctAnswer"
                name="correctAnswer"
                value={currentQuestion.correctAnswer}
                onChange={handleQuestionChange}
                required
              >
                {currentQuestion.options.map((option, index) => (
                  <option key={index} value={index}>
                    {option || `Option ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" className="btn btn-secondary" onClick={addQuestion}>
              {editingIndex >= 0 ? 'Update Question' : 'Add Question'}
            </button>
            {editingIndex >= 0 && (
              <button 
                type="button" 
                className="btn btn-outline-secondary ms-2"
                onClick={() => {
                  setEditingIndex(-1);
                  setCurrentQuestion({
                    text: '',
                    options: ['', '', '', ''],
                    correctAnswer: 0,
                    score: 1
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {assessment.questions.length > 0 && (
          <div className="mb-4">
            <h4>Added Questions ({assessment.questions.length})</h4>
            <div className="alert alert-info">
              Total Question Score: {assessment.questions.reduce((sum, q) => sum + q.score, 0)} / {assessment.maxScore} points
            </div>
            <ul className="list-group">
              {assessment.questions.map((q, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Q{index + 1}:</strong> {q.text}
                    <br />
                    <small>Score: {q.score} points</small>
                    <br />
                    <small>Correct Answer: {q.options[q.correctAnswer]}</small>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => editQuestion(index)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteQuestion(index)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Post Assessment'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/assessments/course/${courseId}`, { replace: true })}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAssessment; 