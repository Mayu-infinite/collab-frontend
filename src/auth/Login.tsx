import { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div
      className="login-page"
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="login-card"
        style={{
          padding: '32px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
        }}
      >
        <h2 className="login-title" style={{ marginBottom: '20px' }}>
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
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
          className="login-input"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '16px',
            borderRadius: '6px',
          }}
        />

        {error && (
          <p className="login-error" style={{ marginBottom: '10px' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="login-button"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Login
        </button>

        <p className="login-footer" style={{ marginTop: '14px', fontSize: '14px' }}>
          New user?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="login-link"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}
