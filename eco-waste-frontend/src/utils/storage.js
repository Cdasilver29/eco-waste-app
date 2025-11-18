// src/utils/storage.js

import { STORAGE_KEYS } from './constants';

export const storage = {
  // Generic storage methods
  set: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Specific app storage methods
  token: {
    get: () => storage.get(STORAGE_KEYS.TOKEN),
    set: (token) => storage.set(STORAGE_KEYS.TOKEN, token),
    remove: () => storage.remove(STORAGE_KEYS.TOKEN)
  },

  user: {
    get: () => storage.get(STORAGE_KEYS.USER),
    set: (user) => storage.set(STORAGE_KEYS.USER, user),
    remove: () => storage.remove(STORAGE_KEYS.USER)
  },

  theme: {
    get: () => storage.get(STORAGE_KEYS.THEME, 'light'),
    set: (theme) => storage.set(STORAGE_KEYS.THEME, theme)
  },

  language: {
    get: () => storage.get(STORAGE_KEYS.LANGUAGE, 'en'),
    set: (language) => storage.set(STORAGE_KEYS.LANGUAGE, language)
  },

  location: {
    get: () => storage.get(STORAGE_KEYS.LOCATION),
    set: (location) => storage.set(STORAGE_KEYS.LOCATION, location),
    remove: () => storage.remove(STORAGE_KEYS.LOCATION)
  },

  municipality: {
    get: () => storage.get(STORAGE_KEYS.MUNICIPALITY),
    set: (municipality) => storage.set(STORAGE_KEYS.MUNICIPALITY, municipality),
    remove: () => storage.remove(STORAGE_KEYS.MUNICIPALITY)
  },

  // Clear all app data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      storage.remove(key);
    });
  }
};

export default storage;