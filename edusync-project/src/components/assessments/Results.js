// import React, { useEffect, useState } from 'react';
// import axios from '../../utils/axiosConfig';
// import { useAuth } from '../../context/AuthContext';

// export default function Results() {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`/AssessmentResults/student/${user.id}`);
//         setResults(response.data);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching results:', err);
//         setError('Failed to load results. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.id) {
//       fetchResults();
//     }
//   }, [user]);

//   if (loading) {
//     return <div className="container mt-4">Loading results...</div>;
//   }

//   if (error) {
//     return (
//       <div className="container mt-4">
//         <div className="alert alert-danger">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       <h2>Assessment Results</h2>
//       {results.length === 0 ? (
//         <div className="alert alert-info">
//           <h4>No results available</h4>
//           <p>You haven't taken any assessments yet.</p>
//         </div>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped">
//             <thead>
//               <tr>
//                 <th>Assessment</th>
//                 <th>Score</th>
//                 <th>Max Score</th>
//                 <th>Percentage</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {results.map(result => (
//                 <tr key={result.resultId}>
//                   <td>{result.assessmentTitle || 'N/A'}</td>
//                   <td>{result.score}</td>
//                   <td>{result.maxScore}</td>
//                   <td>{((result.score / result.maxScore) * 100).toFixed(1)}%</td>
//                   <td>{new Date(result.attemptDate).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useAuth } from '../../context/AuthContext';

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        let response;

        if (user.role === 'Instructor') {
          response = await axios.get('/AssessmentResults/instructor');
        } else {
          response = await axios.get(`/AssessmentResults/student/${user.id}`);
        }

        setResults(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchResults();
    }
  }, [user]);

  if (loading) {
    return <div className="container mt-4">Loading results...</div>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Assessment Results</h2>
      {results.length === 0 ? (
        <div className="alert alert-info">
          <h4>No results available</h4>
          <p>No assessments have been taken yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                {user.role === 'Instructor' && <th>Student</th>}
                {user.role === 'Instructor' && <th>Course</th>}
                <th>Assessment</th>
                <th>Score</th>
                <th>Max Score</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  {user.role === 'Instructor' && <td>{result.studentName}</td>}
                  {user.role === 'Instructor' && <td>{result.courseName}</td>}
                  <td>{result.assessmentTitle || result.assessmentTitle || 'N/A'}</td>
                  <td>{result.marksObtained || result.score}</td>
                  <td>{result.maxScore}</td>
                  <td>{result.percentage?.toFixed(1) || ((result.score / result.maxScore) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

