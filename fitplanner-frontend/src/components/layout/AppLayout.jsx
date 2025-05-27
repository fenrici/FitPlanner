import { Link } from 'react-router-dom';
import { useMenu } from '../../hooks/useMenu';
import { fondoFitplanner } from '../../assets';

const AppLayout = ({ children, className = "dashboard-layout" }) => {
  const { menuOpen, openMenu, closeMenu, handleLogout } = useMenu();

  const backgroundStyle = {
    backgroundImage: `url(${fondoFitplanner})`
  };

  return (
    <div className={`${className} with-background`} style={backgroundStyle}>
      <nav className="navbar">
        <span className="navbar__left">FitPlanner</span>
        <button className="hamburger" onClick={openMenu} aria-label="Abrir menú">
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>
      </nav>

      <aside className={`sidebar-menu${menuOpen ? ' open' : ''}`}>
        <button className="close-menu" onClick={closeMenu} aria-label="Cerrar menú">×</button>
        <ul>
          <li><Link to="/dashboard" onClick={closeMenu}>Home</Link></li>
          <li><button className="logout-link" onClick={handleLogout}>Cerrar sesión</button></li>
        </ul>
      </aside>
      {menuOpen && <div className="sidebar-backdrop" onClick={closeMenu}></div>}

      {children}
    </div>
  );
};

export default AppLayout; 