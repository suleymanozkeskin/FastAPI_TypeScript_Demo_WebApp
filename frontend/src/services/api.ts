// src/pages/forum/api.ts
import axios from 'axios';

// const API_URL = 'http://localhost:8000'; // Local
const API_URL = 'https://hsrw-backend-demo.herokuapp.com'; // update with your backend URL

export const getAllEntries = async () => {
  try {
    const response = await axios.get(`${API_URL}/entries`);
    return response.data;
  } catch (error) {
    console.error('Error fetching entries:', error);
    return [];
  }
};
