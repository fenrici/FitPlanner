import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../store';
import { getRoutine, updateRoutine, deleteRoutine, addExercise, updateExercise, deleteExercise } from '../../../services';
import { ExerciseSearch } from '../exercises';
import { fondoFitplanner } from '../../../assets';

const RoutineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDay, setEditedDay] = useState('');
  const [editedObjective, setEditedObjective] = useState('');
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [editingSets, setEditingSets] = useState('');
  const [editingReps, setEditingReps] = useState('');
  const [editingWeight, setEditingWeight] = useState('');

  const backgroundStyle = {
    backgroundImage: `url(${fondoFitplanner})`
  };

  const fetchRoutine = async () => {
    try {
      const data = await getRoutine(id);
      setRoutine(data);
      setEditedName(data.name);
      setEditedDay(data.day);
      setEditedObjective(data.objective);
      setError('');
    } catch (err) {
      setError(err.message || 'Error al cargar la rutina');
      setRoutine(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoutine = async () => {
    try {
      await updateRoutine(id, {
        name: editedName,
        day: editedDay,
        objective: editedObjective
      });
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
      setNewExercise({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight || ''
      });
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

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  const handleEditExerciseClick = (exercise) => {
    setEditingExerciseId(exercise.id);
    setEditingSets(exercise.sets);
    setEditingReps(exercise.reps);
    setEditingWeight(exercise.weight || '');
  };

  const handleCancelEditExercise = () => {
    setEditingExerciseId(null);
    setEditingSets('');
    setEditingReps('');
    setEditingWeight('');
  };

  const handleSaveEditExercise = async (exerciseId) => {
    try {
      await updateExercise(id, exerciseId, {
        sets: parseInt(editingSets),
        reps: parseInt(editingReps),
        weight: editingWeight ? parseFloat(editingWeight) : null
      });
      await fetchRoutine();
      setEditingExerciseId(null);
      setEditingSets('');
      setEditingReps('');
      setEditingWeight('');
    } catch (err) {
      setError(err.message || 'Error al actualizar el ejercicio');
    }
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

  const handleToggleExerciseSearch = () => {
    setShowExerciseSearch(prev => !prev);
  };

  const handleEditRoutineSubmit = (e) => {
    e.preventDefault();
    handleUpdateRoutine();
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  const handleEditedNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleEditedDayChange = (e) => {
    setEditedDay(e.target.value);
  };

  const handleEditedObjectiveChange = (e) => {
    setEditedObjective(e.target.value);
  };

  const handleNewExerciseChange = (field, value) => {
    setNewExercise(prev => ({ ...prev, [field]: value }));
  };

  const handleCancelNewExercise = () => {
    setNewExercise({ name: '', sets: '', reps: '', weight: '' });
  };

  const handleEditingSetsChange = (e) => {
    setEditingSets(e.target.value);
  };

  const handleEditingRepsChange = (e) => {
    setEditingReps(e.target.value);
  };

  const handleEditingWeightChange = (e) => {
    setEditingWeight(e.target.value);
  };

  useEffect(() => {
    fetchRoutine();
  }, [id]);

  if (loading) {
    return (
      <div className="auth-layout with-background" style={backgroundStyle}>
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="auth-layout with-background" style={backgroundStyle}>
        <div className="text-center text-error-color">
          {error || 'Rutina no encontrada'}
        </div>
        {error && (
          <div className="text-center error-info">
            ID de rutina: {id}
          </div>
        )}
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

      <main className="main top-aligned">
        <div className="routine-detail-card">
          <div className="routine-header">
            {isEditing ? (
              <form onSubmit={handleEditRoutineSubmit} className="edit-routine-form">
                <input
                  type="text"
                  value={editedName}
                  onChange={handleEditedNameChange}
                  required
                  minLength={3}
                  maxLength={100}
                  placeholder="Nombre de la rutina"
                />
                <select
                  value={editedDay}
                  onChange={handleEditedDayChange}
                  required
                >
                  <option value="">Selecciona un día</option>
                  {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <select
                  value={editedObjective}
                  onChange={handleEditedObjectiveChange}
                  required
                >
                  <option value="">Selecciona un objetivo</option>
                  <option value="strength">Fuerza</option>
                  <option value="endurance">Resistencia</option>
                  <option value="flexibility">Flexibilidad</option>
                  <option value="weight_loss">Pérdida de peso</option>
                  <option value="muscle_gain">Ganancia muscular</option>
                </select>
                <div className="edit-form-buttons">
                  <button type="button" className="button secondary" onClick={handleCancelEditing}>Cancelar</button>
                  <button type="submit" className="button">Guardar</button>
                </div>
              </form>
            ) : (
              <>
                <div className="routine-name">{routine.name}</div>
                <div className="routine-meta">{routine.day} - {routine.objective}</div>
                <div className="routine-actions">
                  <button className="button secondary" onClick={handleStartEditing}>Editar</button>
                  <button className="button delete" onClick={handleDeleteRoutine}>Eliminar</button>
                </div>
              </>
            )}
          </div>
          <div className="routine-body">
            <h3>Ejercicios agregados</h3>
            <button
              className="button add-exercise"
              onClick={handleToggleExerciseSearch}
            >
              {showExerciseSearch ? 'Cerrar búsqueda' : 'Agregar ejercicio'}
            </button>
            {showExerciseSearch && (
              <ExerciseSearch onSelectExercise={handleSelectExercise} />
            )}

            {newExercise.name && !showExerciseSearch && (
              <form onSubmit={handleAddExercise} className="add-exercise-form">
                <div className="add-exercise-title">Ejercicio: {newExercise.name}</div>
                <div className="add-exercise-fields">
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Series"
                    value={newExercise.sets}
                    onChange={(e) => handleNewExerciseChange('sets', e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Reps"
                    value={newExercise.reps}
                    onChange={(e) => handleNewExerciseChange('reps', e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Peso (kg)"
                    value={newExercise.weight}
                    onChange={(e) => handleNewExerciseChange('weight', e.target.value)}
                  />
                </div>
                <div className="add-exercise-buttons">
                  <button type="button" className="button secondary" onClick={handleCancelNewExercise}>
                    Cancelar
                  </button>
                  <button type="submit" className="button">
                    Agregar
                  </button>
                </div>
              </form>
            )}

            {routine.Exercises && routine.Exercises.length > 0 ? (
              <div className="exercises-list--centered">
                <div className="exercises-table-wrapper">
                  <table className="exercises-table">
                    <thead>
                      <tr>
                        <th>Ejercicio</th>
                        <th>Series</th>
                        <th>Reps</th>
                        <th>Peso</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {routine.Exercises.map((ex) => (
                        <tr key={ex.id}>
                          {editingExerciseId === ex.id ? (
                            <>
                              <td>{ex.name}</td>
                              <td>
                                <input
                                  type="number"
                                  min="1"
                                  value={editingSets}
                                  onChange={handleEditingSetsChange}
                                  className="edit-ex-input"
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  min="1"
                                  value={editingReps}
                                  onChange={handleEditingRepsChange}
                                  className="edit-ex-input"
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={editingWeight}
                                  onChange={handleEditingWeightChange}
                                  className="edit-ex-input"
                                  placeholder="kg"
                                />
                              </td>
                              <td className="exercise-actions">
                                <button className="icon-btn" title="Guardar" onClick={() => handleSaveEditExercise(ex.id)}>
                                  <svg className="icon icon-save" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </button>
                                <button className="icon-btn delete" title="Cancelar" onClick={handleCancelEditExercise}>
                                  <svg className="icon icon-cancel" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{ex.name}</td>
                              <td>{ex.sets}</td>
                              <td>{ex.reps}</td>
                              <td>{ex.weight ? `${ex.weight} kg` : '-'}</td>
                              <td className="exercise-actions">
                                <button className="icon-btn edit" title="Editar ejercicio" onClick={() => handleEditExerciseClick(ex)}>
                                  <svg className="icon icon-edit" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.7 2.29a1 1 0 0 1 1.42 0l1.59 1.59a1 1 0 0 1 0 1.42l-9.17 9.17-2.83.71.71-2.83 9.17-9.17zM3 17h14v2H3v-2z" fill="currentColor"/>
                                  </svg>
                                </button>
                                <button className="icon-btn delete" title="Eliminar ejercicio" onClick={() => handleDeleteExercise(ex.id)}>
                                  <svg className="icon icon-trash" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 7v9a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7M4 7h12M9 3h2a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="routine-empty">No hay ejercicios agregados</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoutineDetail; 