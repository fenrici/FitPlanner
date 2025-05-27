import { useState } from 'react';
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
    }
  };

  return (
    <div className="dashboard-layout with-background" style={backgroundStyle}>
      <nav className="navbar">
        <span className="navbar__left">FitPlanner</span>
      </nav>

      <main className="main top-aligned">
        <section className="auth-card">
          <header className="auth-header">
            <h2>Crear una cuenta</h2>
          </header>
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="form__error mb-4">{error}</p>
            )}
            <div className="form__group">
              <label htmlFor="username" className="form__label">
                Nombre de usuario
              </label>
              <input
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
            <section className="mt-4">
              <button type="submit" className="button button--primary w-full">
                Registrarse
              </button>
            </section>
          </form>
          <footer className="auth-footer text-center">
            <Link to="/login" className="auth-link">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default Register; 