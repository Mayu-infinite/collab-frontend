import { useState } from 'react';
import { signup } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import './Signup.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setError('');
      await signup(email, password);
      navigate('/login');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div
      className="signup-page"
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="signup-card"
        style={{
          padding: '32px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
        }}
      >
        <h2 className="signup-title" style={{ marginBottom: '20px' }}>
          Create Account
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '12px',
            borderRadius: '6px',
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '16px',
            borderRadius: '6px',
          }}
        />

        {error && (
          <p className="signup-error" style={{ marginBottom: '10px' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSignup}
          className="signup-button"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Sign Up
        </button>

        <p className="signup-footer" style={{ marginTop: '14px', fontSize: '14px' }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="signup-link"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
