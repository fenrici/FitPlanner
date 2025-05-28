import { publicRequest, protectedRequest } from './api';

export const login = async (credentials) => {
  return await publicRequest('/auth/login', credentials);
};

export const register = async (userData) => {
  return await publicRequest('/auth/register', userData);
};

export const getCurrentUser = async () => {
  return await protectedRequest('GET', '/auth/me');
}; 