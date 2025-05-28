import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, useError } from '../../../hooks';
import { createRoutine } from '../../../services';
import { AppLayout } from '../../layout';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const OBJECTIVES = [
  { value: 'strength', label: 'Fuerza' },
  { value: 'endurance', label: 'Resistencia' },
  { value: 'flexibility', label: 'Flexibilidad' },
  { value: 'weight_loss', label: 'Pérdida de peso' },
  { value: 'muscle_gain', label: 'Ganancia muscular' }
];

const NewRoutine = () => {
  const navigate = useNavigate();
  
  const { formData, handleChange } = useForm({
    name: '',
    day: '',
    objective: ''
  });
  
  const { setError, clearError, ErrorDisplay } = useError();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

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
    <AppLayout>
      <main className="main top-aligned">
        <section className="routine-form-card">
          <header>
            <h2>Nueva Rutina</h2>
            <p>Crea una nueva rutina de ejercicios</p>
          </header>

          <ErrorDisplay />

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

            <section className="form-buttons">
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
            </section>
          </form>
        </section>
      </main>
    </AppLayout>
  );
};

export default NewRoutine; 