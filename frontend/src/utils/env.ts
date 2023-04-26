// src/utils/env.ts

export const isClientSide = (): boolean => {
    return typeof window !== 'undefined';
  };
  