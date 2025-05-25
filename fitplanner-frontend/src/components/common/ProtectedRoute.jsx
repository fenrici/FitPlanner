import { useAuth } from '../../store';
import { fondoFitplanner } from '../../assets';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  const backgroundStyle = {
    backgroundImage: `url(${fondoFitplanner})`
  };

  if (loading) {
    return (
      <div className="auth-layout with-background" style={backgroundStyle}>
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-layout with-background" style={backgroundStyle}>
        <div className="text-center">
          <h2>Acceso denegado</h2>
          <p>Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 