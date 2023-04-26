// src/pages/forum/entriesApi.ts

import axios from 'axios';
import { EntryType, EntryWithComments,ShowEntry,ShowComment } from '../components/types';
import { getAuthToken } from '../utils/auth';





// const API_URL = 'http://localhost:8000'; Local

const API_URL = 'https://hsrw-backend-demo.herokuapp.com'; // update with your backend URL



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



    export const getAllEntries = async (): Promise<EntryType[]> => {
        try {
        const response = await instance.get('/entries');
        return response.data;
        } catch (error) {
        console.error('Error fetching entries:', error);
        return [];
        }
    };

    export const getPaginatedEntries = async (page: number): Promise<EntryType[]> => {
        try {
        const response = await instance.get(`${API_URL}/entries/sort_by_date`, {
            params: {
            page,
            },
        });
        return response.data;
        } catch (error) {
        console.error('Error fetching paginated entries:', error);
        return [];
        }
    };

    export const likeEntry = async (entryId: number) => {
        try {
            const response = await instance.post(`${API_URL}/entries/${entryId}/like`);
            return response.data;
        } catch (error) {
            console.error('Error liking entry:', error);
            throw error;
        }
    };
    
    export const dislikeEntry = async (entryId: number) => {
        try {
            const response = await instance.post(`${API_URL}/entries/${entryId}/dislike`);
            return response.data;
        } catch (error) {
            console.error('Error disliking entry:', error);
            throw error;
        }
    };
    
    
    export const likeComment = async (commentId: number) => {
        try {
        const response = await instance.post(`${API_URL}/comments/${commentId}/like`);
        return response.data;
        } catch (error) {
        console.error('Error liking comment:', error);
        throw error;
        }
    };


    export const dislikeComment = async (commentId: number) => {
        try {
        const response = await instance.post(`${API_URL}/comments/${commentId}/dislike`);
        return response.data;
        } catch (error) {
        console.error('Error disliking comment:', error);
        throw error;
        }
    };

    export const getEntryById = async (entryId: number): Promise<EntryType> => {
        try {
          const response = await instance.get(`/entries/${entryId}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching entry:', error);
          throw error;
        }
      };
      

      export const getEntriesbyUsername = async (
        username: string,
        skip: number,
        limit: number = 10
      ) => {
        try {
          const response = await instance.get<EntryType[]>(`/entries/username/${username}`, {
            params: {
              skip,
              limit,
            },
          });
          return response.data;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            return [];
          } else {
            console.error('Error fetching entries:', error);
            throw error;
          }
        }
      };
      


      export const getEntryWithComments = async (
        entryId: number,
        page: number = 1,
        limit: number = 10
      ): Promise<EntryWithComments> => {
        try {
          const skip = (page - 1) * limit;
          const response = await instance.get(`/entries/${entryId}/comments/paginated`, {
            params: {
              skip,
              limit,
            },
          });
          return response.data;
        } catch (error) {
          console.error("Error fetching entry with comments:", error);
          throw error;
        }
      };
      
      

      export const searchForum = async (query: string): Promise<(ShowEntry | ShowComment)[]> => {
        try {
          const response = await instance.get('/search', { params: { q: query } });
          return response.data;
        } catch (error) {
          console.error('Error searching forum:', error);
          return [];
        }
      };
      

      export const createEntry = async ({ title, content, tag }: { title: string; content: string; tag: string }) => {
        try {
          const response = await instance.post('/entries', { title, content, tag });
          return response.data;
        } catch (error) {
          console.error('Error creating entry:', error);
          throw error;
        }
      };
      

      export const createComment = async (entryId: number, content: string) => {
        try {
          const response = await instance.post(`/entries/${entryId}/comments`, { content });
          return response.data;
        } catch (error) {
          console.error('Error creating comment:', error);
          throw error;
        }
      }

      export const getEntriesByTag = async (tag: string, skip: number, limit: number = 10) => {
        try {
          const response = await instance.get<EntryType[]>(`/entries/tag/${tag}`, {
            params: {
              skip,
              limit,
            },
          });
          return response.data;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            return [];
          } else {
            console.error('Error fetching entries:', error);
            throw error;
          }
        }
      };
      