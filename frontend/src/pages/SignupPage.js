import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/signup', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="center-page">
      <div className="card">
        <h2>Create Account</h2>
        {error && <p style={{ color: 'red', marginBottom: 8 }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>
          <div className="form-group">
            <label>Mobile</label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              type="email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Create Account
          </button>
        </form>
        <p style={{ marginTop: 12, fontSize: 13, textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
