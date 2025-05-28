import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, register as registerService } from '../services';

// Crear contexto con valor por defecto más robusto
const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token al cargar la aplicación
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginService(credentials);
      console.log('Login response:', data); // Debug log
      
      if (!data.token || !data.user) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Error al iniciar sesión';
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerService(userData);
      console.log('Register response:', data); // Debug log
      
      if (!data.token || !data.user) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Error en register:', error);
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Error al registrarse';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Con el valor por defecto, el contexto nunca debería ser null
  // pero agregamos una verificación adicional por seguridad
  if (!context || context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 