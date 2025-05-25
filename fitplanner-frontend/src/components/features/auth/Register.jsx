import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../store';
import { fondoFitplanner } from '../../../assets';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const backgroundStyle = {
    backgroundImage: `url(${fondoFitplanner})`
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
      usernameRef.current?.focus();
    }
  };

  return (
    <div className="dashboard-layout with-background" style={backgroundStyle}>
      <nav className="navbar">
        <span className="navbar__left">FitPlanner</span>
      </nav>

      <main className="main top-aligned">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Crear una cuenta</h2>
          </div>
          <div className="auth-body">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="form__error mb-4">{error}</div>
              )}
              <div className="form__group">
                <label htmlFor="username" className="form__label">
                  Nombre de usuario
                </label>
                <input
                  ref={usernameRef}
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="form__input"
                  placeholder="Nombre de usuario"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form__group">
                <label htmlFor="email" className="form__label">
                  Email
                </label>
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form__input"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form__group">
                <label htmlFor="password" className="form__label">
                  Contraseña
                </label>
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form__input"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-4">
                <button type="submit" className="button button--primary w-full">
                  Registrarse
                </button>
              </div>
            </form>
          </div>
          <div className="auth-footer text-center">
            <Link to="/login" className="auth-link">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register; 