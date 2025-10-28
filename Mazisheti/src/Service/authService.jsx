// src/services/authService.js

import axios from 'axios';
import { saveToken } from '../jwtUtil';

const API_URL = 'http://localhost:8082/auth';  // Change this to your backend API URL

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token } = response.data;
    saveToken(token);  // Save the JWT token in localStorage
    return response.data;  // Return user data (if needed)
  } catch (error) {
    throw new Error('Login failed: ' + error.message);
  }
};
