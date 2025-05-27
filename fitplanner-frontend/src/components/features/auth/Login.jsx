import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../store';
import { fondoFitplanner } from '../../../assets';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

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
    setLoading(true);
    setError('');
    
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error en el componente Login:', err);
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
    } finally {
      setLoading(false);
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
            <h2>Iniciar sesión</h2>
          </header>
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="form__error mb-4">
                {error}
              </p>
            )}
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
              <button 
                type="submit" 
                className="button button--primary w-full"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </section>
          </form>
          <footer className="auth-footer text-center">
            <Link to="/register" className="auth-link">
              ¿No tienes una cuenta? Regístrate
            </Link>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default Login; 