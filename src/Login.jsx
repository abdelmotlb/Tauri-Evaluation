import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Login({ isAuthenticated, onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin();
    navigate(location.state?.from || '/', { replace: true });
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <input type="email" placeholder="Email" defaultValue="user@example.com" style={inputStyle} />
        <input type="password" placeholder="Password" defaultValue="password" style={inputStyle} />
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '10px 12px',
  fontSize: 16,
  border: '1px solid #ccc',
  borderRadius: 8,
};

const buttonStyle = {
  padding: '10px 16px',
  fontSize: 16,
  border: 'none',
  borderRadius: 8,
  background: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
};

export default Login;
