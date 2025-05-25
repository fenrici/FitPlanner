import { useState } from 'react';
import { getExercisesByMuscle } from '../../../services';

const VALID_MUSCLES = [
  'abdominals',
  'abductors',
  'adductors',
  'biceps',
  'calves',
  'chest',
  'forearms',
  'glutes',
  'hamstrings',
  'lats',
  'lower_back',
  'middle_back',
  'neck',
  'quadriceps',
  'traps',
  'triceps',
];

const MUSCLE_LABELS = {
  abdominals: 'Abdominales',
  abductors: 'Abductores',
  adductors: 'Aductores',
  biceps: 'Bíceps',
  calves: 'Pantorrillas',
  chest: 'Pectorales',
  forearms: 'Antebrazos',
  glutes: 'Glúteos',
  hamstrings: 'Isquiotibiales',
  lats: 'Dorsales',
  lower_back: 'Zona lumbar',
  middle_back: 'Espalda media',
  neck: 'Cuello',
  quadriceps: 'Cuádriceps',
  traps: 'Trapecios',
  triceps: 'Tríceps',
};

const ExerciseSearch = ({ onSelectExercise }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualExercise, setManualExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });
  const [expanded, setExpanded] = useState({});

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedMuscle) {
      setError('Selecciona un músculo');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await getExercisesByMuscle(selectedMuscle);
      setExercises(data);
    } catch (err) {
      setError('Error al buscar ejercicios');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExercise = (exercise) => {
    onSelectExercise({
      name: exercise.name,
      description: exercise.instructions,
      muscles: [exercise.muscle],
      type: exercise.type,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty
    });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualExercise.name || !manualExercise.sets || !manualExercise.reps) return;
    onSelectExercise({
      name: manualExercise.name,
      sets: manualExercise.sets,
      reps: manualExercise.reps,
      weight: manualExercise.weight,
      muscle: '',
      type: '',
      equipment: '',
      difficulty: '',
      description: ''
    });
    setManualExercise({ name: '', sets: '', reps: '', weight: '' });
    setShowManualForm(false);
  };

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleMuscleChange = (e) => {
    setSelectedMuscle(e.target.value);
  };

  const handleToggleManualForm = () => {
    setShowManualForm(prev => !prev);
  };

  const handleManualExerciseChange = (field, value) => {
    setManualExercise(prev => ({ ...prev, [field]: value }));
  };

  const handleCloseManualForm = () => {
    setShowManualForm(false);
  };

  return (
    <div className="exercise-search">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="search-actions">
          <select
            value={selectedMuscle}
            onChange={handleMuscleChange}
            className="form__input"
            required
          >
            <option value="">Selecciona un músculo</option>
            {VALID_MUSCLES.map(muscle => (
              <option key={muscle} value={muscle}>
                {MUSCLE_LABELS[muscle]}
              </option>
            ))}
          </select>
          <button 
            type="button" 
            className="button secondary manual-exercise-button"
            onClick={handleToggleManualForm}
          >
            {showManualForm ? 'Cerrar' : 'Manual'}
          </button>
        </div>
        {!showManualForm && (
          <button type="submit" className="button button--primary mt-2">
            Buscar
          </button>
        )}
      </form>

      {showManualForm && (
        <form onSubmit={handleManualSubmit} className="add-exercise-form">
          <div className="add-exercise-title">Agregar ejercicio manual</div>
          <div className="add-exercise-fields">
            <input
              type="text"
              placeholder="Nombre"
              value={manualExercise.name}
              onChange={(e) => handleManualExerciseChange('name', e.target.value)}
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Series"
              value={manualExercise.sets}
              onChange={(e) => handleManualExerciseChange('sets', e.target.value)}
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Reps"
              value={manualExercise.reps}
              onChange={(e) => handleManualExerciseChange('reps', e.target.value)}
              required
            />
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="Peso (kg)"
              value={manualExercise.weight}
              onChange={(e) => handleManualExerciseChange('weight', e.target.value)}
            />
          </div>
          <div className="add-exercise-buttons">
            <button type="button" className="button secondary" onClick={handleCloseManualForm}>
              Cancelar
            </button>
            <button type="submit" className="button">
              Agregar
            </button>
          </div>
        </form>
      )}

      {error && <div className="form__error mb-4">{error}</div>}

      <div className="exercise-results">
        {exercises.map((exercise, index) => {
          const isLong = exercise.instructions && exercise.instructions.length > 50;
          const isExpanded = expanded[index];
          return (
            <div
              key={`exercise-${exercise.name}-${index}`}
              className="exercise-card"
            >
              <div className="exercise-card__content">
                <h4 className="exercise-card__title">{exercise.name}</h4>
                <p><strong>Músculo:</strong> {exercise.muscle}</p>
                <p><strong>Tipo:</strong> {exercise.type}</p>
                <p><strong>Equipo:</strong> {exercise.equipment}</p>
                <p><strong>Dificultad:</strong> {exercise.difficulty}</p>
                <p>
                  <strong>Instrucciones:</strong> {isLong && !isExpanded
                    ? exercise.instructions.slice(0, 50) + '...'
                    : exercise.instructions}
                  {isLong && (
                    <button
                      type="button"
                      className="button manual read-more-button"
                      onClick={() => toggleExpand(index)}
                    >
                      {isExpanded ? 'Leer menos' : 'Leer más'}
                    </button>
                  )}
                </p>
                <button
                  onClick={() => handleSelectExercise(exercise)}
                  className="select-button"
                >
                  Seleccionar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="text-center mt-4">Cargando...</div>
      )}
    </div>
  );
};

export default ExerciseSearch; 