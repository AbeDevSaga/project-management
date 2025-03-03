import axios from 'axios';
import { useAuthStore } from '../utils/authStore';

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API;

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${AUTH_API}/login`, { email, password });
    localStorage.setItem('token', response.data.token);
    useAuthStore.getState().setAuthenticated(true);
    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    return null;
  }
};

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${AUTH_API}/register`, { username, email, password });
    return response.data;
  } catch (error) {
    console.error('Registration Error:', error);
    return null;
  }
};

export const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    useAuthStore.getState().setAuthenticated(true);
    return true;
  }
  return false;
};
