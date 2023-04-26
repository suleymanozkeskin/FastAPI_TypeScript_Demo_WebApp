// src/pages/api/api.ts
import axios from 'axios';
import { AxiosError } from "axios";



// const API_URL = 'http://localhost:8000'; // Local

const API_URL = 'https://hsrw-backend-demo.herokuapp.com'; // update with your backend URL


export const login = async (email: string, password: string) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  try {
    const response = await axios.post(`${API_URL}/login`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Store the authentication token in local storage
    localStorage.setItem('authToken', response.data.access_token);
    localStorage.setItem('isLoggedIn', 'true');
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};


export const logout = async () => {
  try {
    const token = localStorage.getItem('authToken');
    await axios.post(`${API_URL}/logout`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Remove the authentication token from local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
  } catch (error) {
    console.error('Logout error:', error);
  }
};



export const signup = async (
  email: string,
  username: string,
  password: string
) => {
  const data = {
    email,
    username,
    password,
  };

  try {
    await axios.post(`${API_URL}/users`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { success: true, error: null };
  } catch (error: unknown) {
    console.error("Signup error:", error);
    const axiosError = error as AxiosError;
    return { success: false, error: axiosError.response?.data };
  }
};
