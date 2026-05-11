import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. verify that all fields are filled in
    if (!name || !email || !password || !confirm) { 
      setError('Please fill in all fields'); 
      return; 
    }

    // 2. verify email format using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // 3. verify that password and confirm password match
    if (password !== confirm) { 
      setError('Passwords do not match'); 
      return; 
    }

    // 4. verify password strength (at least 6 characters)
    if (password.length < 6) { 
      setError('Password must be at least 6 characters'); 
      return; 
    }

    // 5.send the registration data to the AuthContext register function
    const result = register(name, email, password);
    if (result.error) { 
      setError(result.error); 
      return; 
    }
    
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">✦</div>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join SetJetters and start exploring</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
            />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
            />
          </div>
          <div className="auth-field">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setError(''); }}
            />
          </div>
          <button type="submit" className="auth-btn">Create Account</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}