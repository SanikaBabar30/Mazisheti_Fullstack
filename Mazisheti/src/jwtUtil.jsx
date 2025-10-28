// src/jwtUtil.js

export const saveToken = (token) => {
    localStorage.setItem('jwtToken', token);  // Store JWT token
  };
  
  export const getToken = () => {
    return localStorage.getItem('jwtToken');  // Retrieve JWT token
  };
  
  export const removeToken = () => {
    localStorage.removeItem('jwtToken');  // Remove JWT token
  };
  