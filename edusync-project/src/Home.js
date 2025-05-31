import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="display-4 text-primary mb-4">Welcome to EduSync</h1>
          <p className="lead mb-5">Your centralized platform for collaborative education.</p>
          
          <div className="d-flex justify-content-center gap-3 mb-5">
            <Link to="/login" className="btn btn-outline-primary btn-lg px-4">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-lg px-4">
              Register
            </Link>
          </div>

          <div className="row mt-5">
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">Course Management</h5>
                  <p className="card-text">Organize and manage your courses efficiently with our intuitive interface.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">Assessments</h5>
                  <p className="card-text">Create and take assessments with real-time feedback and analytics.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">Collaboration</h5>
                  <p className="card-text">Connect with students and teachers for seamless communication.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 