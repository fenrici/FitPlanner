import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Para rutas públicas (login/register)
export const publicRequest = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Para rutas protegidas
export const protectedRequest = async (method, url, data = null) => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      // Redirigir a login si no hay token
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    let response;
    if (method === 'GET') {
      response = await api.get(url, config);
    } else if (method === 'POST') {
      response = await api.post(url, data, config);
    } else if (method === 'PUT') {
      response = await api.put(url, data, config);
    } else if (method === 'DELETE') {
      response = await api.delete(url, config);
    }

    return response.data;
  } catch (error) {
    // Manejar errores 401 manualmente
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error;
  }
};

export default api; 