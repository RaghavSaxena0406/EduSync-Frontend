import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/assessments`)
      .then(res => res.json())
      .then(setQuizzes);
  }, []);

  return (
    <div className="container mt-4">
      <h2>Available Quizzes</h2>
      <ul className="list-group">
        {quizzes.map(q => (
          <li key={q.assessmentId} className="list-group-item d-flex justify-content-between">
            {q.title}
            <Link to={`/quiz/${q.assessmentId}`} className="btn btn-sm btn-primary">Take Quiz</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
