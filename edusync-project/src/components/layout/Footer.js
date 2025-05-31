import React from 'react';

export default function Footer() {
  return (
    <footer className="text-center mt-5 mb-3">
      <hr />
      <p>&copy; {new Date().getFullYear()} EduSync LMS</p>
    </footer>
  );
}
