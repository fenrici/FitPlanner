import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../store';
import { useForm } from '../../../hooks';
import { createRoutine } from '../../../services';
import { fondoFitplanner } from '../../../assets';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const OBJECTIVES = [
  { value: 'strength', label: 'Fuerza' },
  { value: 'endurance', label: 'Resistencia' },
  { value: 'flexibility', label: 'Flexibilidad' },
  { value: 'weight_loss', label: 'Pérdida de peso' },
  { value: 'muscle_gain', label: 'Ganancia muscular' }
];

const NewRoutine = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const { formData, handleChange } = useForm({
    name: '',
    day: '',
    objective: ''
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backgroundStyle = {
    backgroundImage: `url(${fondoFitplanner})`
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleBackdropClick = () => {
    setMenuOpen(false);
  };

  const handleMenuLinkClick = () => {
    setMenuOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!formData.name.trim()) {
      setError('El nombre de la rutina es requerido');
      setIsSubmitting(false);
      return;
    }

    try {
      await createRoutine(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al crear rutina:', err);
      setError(err.message || 'Error al crear la rutina');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout with-background" style={backgroundStyle}>
      <nav className="navbar">
        <span className="navbar__left">FitPlanner</span>
        <button className="hamburger" onClick={handleMenuOpen} aria-label="Abrir menú">
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>
      </nav>

      <aside className={`sidebar-menu${menuOpen ? ' open' : ''}`}>
        <button className="close-menu" onClick={handleMenuClose} aria-label="Cerrar menú">×</button>
        <ul>
          <li><Link to="/dashboard" onClick={handleMenuLinkClick}>Home</Link></li>
          <li><button className="logout-link" onClick={handleLogout}>Cerrar sesión</button></li>
        </ul>
      </aside>
      {menuOpen && <div className="sidebar-backdrop" onClick={handleBackdropClick}></div>}

      <main className="main top-aligned">
        <div className="routine-form-card">
          <h2>Nueva Rutina</h2>
          <p>Crea una nueva rutina de ejercicios</p>

          {error && (
            <div className="form__error mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            <div className="form__group">
              <label htmlFor="name">Nombre de la rutina</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ej: Rutina de pecho y espalda"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="day">Día</label>
              <select
                id="day"
                name="day"
                value={formData.day}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un día</option>
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__group">
              <label htmlFor="objective">Objetivo</label>
              <select
                id="objective"
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un objetivo</option>
                {OBJECTIVES.map((obj) => (
                  <option key={obj.value} value={obj.value}>
                    {obj.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-buttons">
              <Link to="/dashboard" className="button button--secondary">
                Cancelar
              </Link>
              <button 
                type="submit" 
                className="button button--primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creando...' : 'Crear Rutina'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewRoutine; 