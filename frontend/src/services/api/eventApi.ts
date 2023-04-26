// src/services/api/eventApi.ts
import { getAuthToken } from '@/utils/auth';
import axios from 'axios';
import { Event } from '@/components/types';

const API_URL = 'https://hsrw-backend-demo.herokuapp.com'; // Update with your backend URL

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

// Add an interceptor to update the headers before each request
instance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete config.headers['Authorization'];
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export const createEvent = async (formData: FormData): Promise<Event | null> => {
    try {
      const response = await instance.post<Event>('/events', formData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
};


export const getUpcomingEvents = async (): Promise<Event[]> => {
    try {
      const response = await instance.get<Event[]>('/events/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  };
  
  export const getPastEvents = async (): Promise<Event[]> => {
    try {
      const response = await instance.get<Event[]>('/events/past');
      return response.data;
    } catch (error) {
      console.error('Error fetching past events:', error);
      return [];
    }
  };