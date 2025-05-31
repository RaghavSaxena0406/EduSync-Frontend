import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Quiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/assessments/${id}`)
      .then(res => res.json())
      .then(setQuiz);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ assessmentId: id, answers })
    });
    if (res.ok) alert('Submitted!');
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>{quiz.title}</h2>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="my-3">
            <p><strong>{q.text}</strong></p>
            {q.options.map((opt, i) => (
              <div key={i}>
                <input type="radio" name={`q${idx}`} value={opt}
                  onChange={() => setAnswers({ ...answers, [idx]: opt })} />
                {' '}
                {opt}
              </div>
            ))}
          </div>
        ))}
        <button className="btn btn-success">Submit</button>
      </form>
    </div>
  );
}
