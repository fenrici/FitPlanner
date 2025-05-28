import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useFetch, useError } from '../../../hooks';
import { AppLayout } from '../../layout';
import Spinner from '../../common/Spinner';
import { fondoFitplanner } from '../../../assets';

const Dashboard = () => {
  const { loading, result: routines } = useFetch('/routines');
  const { ErrorDisplay } = useError();
  const navigate = useNavigate();

  const handleRoutineClick = (routineId) => {
    navigate(`/routines/${routineId}`);
  };

  if (loading) {
    return (
      <div className="auth-layout with-background" style={{ backgroundImage: `url(${fondoFitplanner})` }}>
        <main className="main">
          <section className="text-center">
            <Spinner size="large" />
          </section>
        </main>
      </div>
    );
  }

  return (
    <AppLayout>
      <main className="container dashboard-page">
        <header className="routines-header">
          <h1 className="section-title">Mis Rutinas</h1>
          <Link to="/routines/new" className="new-routine-button">
            + Nueva Rutina
          </Link>
        </header>

        <ErrorDisplay className="form__error mb-4 text-center" />

        {routines.length === 0 ? (
          <section className="text-center p-4">
            <h3 className="mb-4">No tienes rutinas</h3>
            <p>Comienza creando una nueva rutina.</p>
          </section>
        ) : (
          <section className="routine-card-list">
            {routines.map((routine) => (
              <article
                key={routine.id}
                onClick={() => handleRoutineClick(routine.id)}
                className="routine-item"
              >
                <h3 className="routine-title">
                  {routine.name}
                </h3>
                <p className="routine-count">
                  {(routine.exercises?.length || 0)} ejercicios
                </p>
                </article>
            ))}
          </section>
        )}
      </main>
    </AppLayout>
  );
};

export default Dashboard;
