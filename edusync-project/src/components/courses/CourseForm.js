import React, { useState } from 'react';

export default function CourseForm() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [file, setFile] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('Title', form.title);
    data.append('Description', form.description);
    if (file) data.append('File', file);

    const res = await fetch(`${process.env.REACT_APP_API_URL}/courses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });

    if (res.ok) {
      alert('Course uploaded');
    } else {
      alert('Upload failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Upload Course</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" name="title" placeholder="Course Title" onChange={handleChange} required />
        <textarea className="form-control my-2" name="description" placeholder="Course Description" onChange={handleChange} required />
        <input type="file" className="form-control my-2" onChange={e => setFile(e.target.files[0])} />
        <button className="btn btn-success">Submit</button>
      </form>
    </div>
  );
}
