import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../store';
import { useFetch } from '../../../hooks';
import { fondoFitplanner } from '../../../assets';

const Dashboard = () => {
  const { loading, result: routines, error } = useFetch('/routines');
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  const handleRoutineClick = (routineId) => {
    navigate(`/routines/${routineId}`);
  };

  const handleMenuLinkClick = () => {
    setMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="auth-layout with-background" style={backgroundStyle}>
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

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

      <main className="container dashboard-page">
        <div className="routines-header">
          <span className="section-title">Mis Rutinas</span>
          <Link to="/routines/new" className="new-routine-button">
            + Nueva Rutina
          </Link>
        </div>

        {error && <div className="form__error mb-4 text-center">{error}</div>}

        {routines.length === 0 ? (
          <div className="text-center p-4">
            <h3 className="mb-4">No tienes rutinas</h3>
            <p>Comienza creando una nueva rutina.</p>
          </div>
        ) : (
          <div className="routine-card-list">
            {routines.map((routine) => (
              <div
                key={routine.id}
                onClick={() => handleRoutineClick(routine.id)}
                className="routine-item"
              >
                <span className="routine-title">
                  {routine.name}
                </span>
                <span className="routine-count">
                  {(routine.Exercises?.length || routine.exercises?.length || 0)} ejercicios
                </span>
                </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
