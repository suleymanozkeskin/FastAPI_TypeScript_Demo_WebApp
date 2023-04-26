// src/utils/auth.ts

import { isClientSide } from './env';

export const getAuthToken = (): string | null => {
  if (isClientSide()) {
    return localStorage.getItem('authToken');
  }
  return null;
};
