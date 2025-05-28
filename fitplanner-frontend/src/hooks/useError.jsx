import { useState } from 'react';

export const useError = (initialError = '') => {
  const [error, setError] = useState(initialError);

  const clearError = () => setError('');
  
  const setErrorMessage = (message) => {
    setError(typeof message === 'string' ? message : message?.message || 'Error desconocido');
  };

  const ErrorDisplay = ({ className = "form__error mb-4" }) => (
    error && <p className={className}>{error}</p>
  );

  return {
    error,
    setError: setErrorMessage,
    clearError,
    ErrorDisplay
  };
}; 