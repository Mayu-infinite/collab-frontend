import { useState } from 'react';
import { signup } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';


export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setError('');
      await signup(email, password);
      navigate('/login'); // after signup → login
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(error.response?.data?.message || 'Signup failed');
    }

  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '60px auto',
        padding: '20px',
        fontFamily: 'Arial',
      }}
    >
      <h2>Signup</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />

      <button
        onClick={handleSignup}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#2ecc71',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Create Account
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p style={{ marginTop: '10px' }}>
        Already have an account?{' '}
        <span
          style={{ color: '#3498db', cursor: 'pointer' }}
          onClick={() => navigate('/login')}
        >
          Login
        </span>
      </p>
    </div>
  );
}
