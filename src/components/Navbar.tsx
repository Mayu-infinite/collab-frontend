import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { toggleTheme } from '../utils/theme';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  const handleToggleTheme = () => {
    toggleTheme();
    setIsDark(document.documentElement.classList.contains('dark'));
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2
          className="navbar-title"
          onClick={() => navigate('/')}
        >
          Collab Docs
        </h2>

        <div className="navbar-actions">
          <button
            onClick={handleToggleTheme}
            className="theme-toggle"
          >
            {isDark ? '🌞' : '🌙'}
          </button>

          {!token ? (
            <>
              <button
                onClick={() => navigate('/login')}
                className="nav-button nav-button-outline"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="nav-button nav-button-primary"
              >
                Signup
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="nav-button nav-button-danger"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
        