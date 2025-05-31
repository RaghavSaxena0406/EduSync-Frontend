import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Unauthorized() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="display-1 text-danger mb-4">403</h1>
              <h2 className="mb-4">Access Denied</h2>
              <p className="lead mb-4">
                Sorry, you don't have permission to access this page.
              </p>
              <Link to="/" className="btn btn-primary me-2">
                Go Home
              </Link>
              <Link to="/login" className="btn btn-outline-primary">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized; 