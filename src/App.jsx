import { useRef } from 'react';
import { Navigate, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Login from './Login';

function ProtectedRoute({ isAuthenticated, children }) {

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const navigate = useNavigate();
  const isAuthenticated = useRef(false);

  const login = () => {
    isAuthenticated.current = true;
  };

  const logout = () => {
    isAuthenticated.current = false;
    navigate('/login', { replace: true });
  };

  const isLoggedIn = isAuthenticated.current;

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <button type="button" onClick={logout} style={{ marginLeft: 'auto' }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      <Routes>
        <Route
          path="/login"
          element={<Login isAuthenticated={isLoggedIn} onLogin={login} />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isLoggedIn}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute isAuthenticated={isLoggedIn}>
              <About />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? '/' : '/login'} replace />} />
      </Routes>
    </div>
  );
}

export default App;
