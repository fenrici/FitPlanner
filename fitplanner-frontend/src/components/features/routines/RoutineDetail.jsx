import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRoutine, updateRoutine, deleteRoutine, addExercise, updateExercise, deleteExercise } from '../../../services';
import { ExerciseSearch } from '../exercises';
import { useError } from '../../../hooks';
import { AppLayout } from '../../layout';
import Spinner from '../../common/Spinner';
import { fondoFitplanner } from '../../../assets';

const RoutineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setError, clearError, ErrorDisplay } = useError();
  const [isEditing, setIsEditing] = useState(false);
  const [editedRoutine, setEditedRoutine] = useState({
    name: '',
    day: '',
    objective: ''
  });
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [editingExercise, setEditingExercise] = useState({
    id: null,
    sets: '',
    reps: '',
    weight: ''
  });

  const fetchRoutine = async () => {
    try {
      const data = await getRoutine(id);
      setRoutine(data);
      setEditedRoutine({
        name: data.name,
        day: data.day,
        objective: data.objective
      });
      clearError();
    } catch (err) {
      setError(err.message || 'Error al cargar la rutina');
      setRoutine(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoutine = async () => {
    try {
      await updateRoutine(id, editedRoutine);
      await fetchRoutine();
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Error al actualizar la rutina');
    }
  };

  const handleDeleteRoutine = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
      try {
        await deleteRoutine(id);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message || 'Error al eliminar la rutina');
      }
    }
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    try {
      const exerciseData = {
        ...newExercise,
        sets: parseInt(newExercise.sets),
        reps: parseInt(newExercise.reps),
        weight: newExercise.weight ? parseFloat(newExercise.weight) : null
      };

      await addExercise(id, exerciseData);
      await fetchRoutine();
      setNewExercise({ name: '', sets: '', reps: '', weight: '' });
    } catch (err) {
      setError(err.message || 'Error al agregar el ejercicio');
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
      try {
        await deleteExercise(id, exerciseId);
        await fetchRoutine();
      } catch (err) {
        setError(err.message || 'Error al eliminar el ejercicio');
      }
    }
  };

  const handleSelectExercise = (exercise) => {
    if (exercise.sets && exercise.reps) {
      const exerciseData = {
        name: exercise.name,
        sets: parseInt(exercise.sets),
        reps: parseInt(exercise.reps),
        weight: exercise.weight ? parseFloat(exercise.weight) : null
      };
      
      addExercise(id, exerciseData)
        .then(() => {
          fetchRoutine();
          setNewExercise({ name: '', sets: '', reps: '', weight: '' });
        })
        .catch((err) => {
          setError(err.message || 'Error al agregar el ejercicio');
        });
    } else {
      setNewExercise({
        name: exercise.name,
        sets: '',
        reps: '',
        weight: ''
      });
    }
    setShowExerciseSearch(false);
  };

  const handleEditExerciseClick = (exercise) => {
    setEditingExercise({
      id: exercise.id,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight || ''
    });
  };

  const handleSaveEditExercise = async () => {
    try {
      await updateExercise(id, editingExercise.id, {
        sets: parseInt(editingExercise.sets),
        reps: parseInt(editingExercise.reps),
        weight: editingExercise.weight ? parseFloat(editingExercise.weight) : null
      });
      await fetchRoutine();
      setEditingExercise({ id: null, sets: '', reps: '', weight: '' });
    } catch (err) {
      setError(err.message || 'Error al actualizar el ejercicio');
    }
  };

  // Generic change handlers
  const handleEditedRoutineChange = (field, value) => {
    setEditedRoutine(prev => ({ ...prev, [field]: value }));
  };

  const handleEditingExerciseChange = (field, value) => {
    setEditingExercise(prev => ({ ...prev, [field]: value }));
  };

  const handleNewExerciseChange = (field, value) => {
    setNewExercise(prev => ({ ...prev, [field]: value }));
  };

  const resetEditingExercise = () => {
    setEditingExercise({ id: null, sets: '', reps: '', weight: '' });
  };

  const resetNewExercise = () => {
    setNewExercise({ name: '', sets: '', reps: '', weight: '' });
  };

  useEffect(() => {
    if (id) fetchRoutine();
  }, [id]);

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

  if (!routine) {
    return (
      <div className="auth-layout with-background" style={{ backgroundImage: `url(${fondoFitplanner})` }}>
        <main className="main">
          <section className="text-center text-error-color">
            <h2>Error</h2>
            <ErrorDisplay />
            <section className="text-center error-info">
              <Link to="/dashboard">Volver al Dashboard</Link>
            </section>
          </section>
        </main>
      </div>
    );
  }

  return (
    <AppLayout>

      <main className="main top-aligned">
        <section className="routine-detail-card">
          <header className="routine-header">
            {isEditing ? (
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateRoutine(); }} className="edit-routine-form">
                <input
                  type="text"
                  value={editedRoutine.name}
                  onChange={(e) => handleEditedRoutineChange('name', e.target.value)}
                  placeholder="Nombre de la rutina"
                  required
                />
                <select
                  value={editedRoutine.day}
                  onChange={(e) => handleEditedRoutineChange('day', e.target.value)}
                  required
                >
                  <option value="">Selecciona un día</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
                <select
                  value={editedRoutine.objective}
                  onChange={(e) => handleEditedRoutineChange('objective', e.target.value)}
                  required
                >
                  <option value="">Selecciona un objetivo</option>
                  <option value="strength">Fuerza</option>
                  <option value="endurance">Resistencia</option>
                  <option value="flexibility">Flexibilidad</option>
                  <option value="weight_loss">Pérdida de peso</option>
                  <option value="muscle_gain">Ganancia muscular</option>
                </select>
                <section className="edit-form-buttons">
                  <button type="submit" className="button button--primary">Guardar</button>
                  <button type="button" className="button button--secondary" onClick={() => setIsEditing(false)}>Cancelar</button>
                </section>
              </form>
            ) : (
              <>
                <section className="routine-name">{routine.name}</section>
                <section className="routine-meta">{routine.day} - {routine.objective}</section>
                <section className="routine-actions">
                  <button className="button button--secondary" onClick={() => setIsEditing(true)}>Editar</button>
                  <button className="button delete" onClick={handleDeleteRoutine}>Eliminar</button>
                </section>
              </>
            )}
          </header>

                      <section className="routine-body">
            <h3>Ejercicios</h3>
            
            <ErrorDisplay />

            <button 
              className="button button--primary add-button" 
              onClick={() => setShowExerciseSearch(!showExerciseSearch)}
            >
              {showExerciseSearch ? 'Cerrar búsqueda' : 'Agregar ejercicio'}
            </button>

            {showExerciseSearch && (
              <ExerciseSearch onSelectExercise={handleSelectExercise} />
            )}

            {newExercise.name && (
              <form onSubmit={handleAddExercise} className="add-exercise-form">
                <header className="add-exercise-title">Ejercicio: {newExercise.name}</header>
                <section className="add-exercise-fields">
                  <input
                    type="number"
                    min="1"
                    placeholder="Series"
                    value={newExercise.sets}
                    onChange={(e) => handleNewExerciseChange('sets', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Reps"
                    value={newExercise.reps}
                    onChange={(e) => handleNewExerciseChange('reps', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Peso (kg)"
                    value={newExercise.weight}
                    onChange={(e) => handleNewExerciseChange('weight', e.target.value)}
                  />
                </section>
                <section className="add-exercise-buttons">
                  <button type="button" className="button secondary" onClick={resetNewExercise}>
                    Cancelar
                  </button>
                  <button type="submit" className="button">
                    Agregar
                  </button>
                </section>
              </form>
            )}

            {routine.exercises && routine.exercises.length > 0 ? (
              <section className="exercises-list--centered">
                <section className="exercises-table-wrapper">
                  <table className="exercises-table">
                    <thead>
                      <tr>
                        <th>Ejercicio</th>
                        <th>Series</th>
                        <th>Reps</th>
                        <th>Peso (kg)</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {routine.exercises.map((exercise) => (
                        <tr key={exercise.id}>
                          <td>{exercise.name}</td>
                          <td>
                            {editingExercise.id === exercise.id ? (
                              <input
                                type="number"
                                min="1"
                                className="edit-ex-input"
                                value={editingExercise.sets}
                                onChange={(e) => handleEditingExerciseChange('sets', e.target.value)}
                              />
                            ) : (
                              exercise.sets
                            )}
                          </td>
                          <td>
                            {editingExercise.id === exercise.id ? (
                              <input
                                type="number"
                                min="1"
                                className="edit-ex-input"
                                value={editingExercise.reps}
                                onChange={(e) => handleEditingExerciseChange('reps', e.target.value)}
                              />
                            ) : (
                              exercise.reps
                            )}
                          </td>
                          <td>
                            {editingExercise.id === exercise.id ? (
                              <input
                                type="number"
                                min="0"
                                step="0.1"
                                className="edit-ex-input"
                                value={editingExercise.weight}
                                onChange={(e) => handleEditingExerciseChange('weight', e.target.value)}
                              />
                            ) : (
                              exercise.weight || '-'
                            )}
                          </td>
                          <td>
                            <section className="exercise-actions">
                              {editingExercise.id === exercise.id ? (
                                <>
                                  <button
                                    className="icon-btn"
                                    onClick={handleSaveEditExercise}
                                    title="Guardar"
                                  >
                                    <span className="icon">✓</span>
                                  </button>
                                  <button
                                    className="icon-btn"
                                    onClick={resetEditingExercise}
                                    title="Cancelar"
                                  >
                                    <span className="icon">✕</span>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="icon-btn"
                                    onClick={() => handleEditExerciseClick(exercise)}
                                    title="Editar"
                                  >
                                    <span className="icon">✎</span>
                                  </button>
                                  <button
                                    className="icon-btn delete"
                                    onClick={() => handleDeleteExercise(exercise.id)}
                                    title="Eliminar"
                                  >
                                    <span className="icon">🗑</span>
                                  </button>
                                </>
                              )}
                            </section>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </section>
            ) : (
              <p className="routine-empty">No hay ejercicios agregados</p>
            )}
          </section>
        </section>
      </main>
    </AppLayout>
  );
};

export default RoutineDetail; 