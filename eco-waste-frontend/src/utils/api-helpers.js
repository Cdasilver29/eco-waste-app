// src/utils/api-helpers.js

import { ERROR_MESSAGES } from './constants';

export const handleApiError = (error) => {
  // Network error
  if (!error.response) {
    if (error.message === 'Network Error') {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    return error.message || ERROR_MESSAGES.SERVER_ERROR;
  }

  // Server responded with error
  const status = error.response.status;
  const message = error.response.data?.message || error.response.data?.error;

  switch (status) {
    case 400:
      return message || ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return message || ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return message || ERROR_MESSAGES.NOT_FOUND;
    case 422:
      return message || ERROR_MESSAGES.VALIDATION_ERROR;
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR;
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return message || ERROR_MESSAGES.SERVER_ERROR;
  }
};

export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';

  const query = Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined && params[key] !== '')
    .map(key => {
      const value = params[key];
      if (Array.isArray(value)) {
        return value.map(v => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');

  return query ? `?${query}` : '';
};

export const parseQueryString = (queryString) => {
  if (!queryString) return {};

  return queryString
    .replace('?', '')
    .split('&')
    .reduce((params, param) => {
      const [key, value] = param.split('=');
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value);

      // Handle array parameters (key[])
      if (decodedKey.endsWith('[]')) {
        const arrayKey = decodedKey.slice(0, -2);
        params[arrayKey] = params[arrayKey] || [];
        params[arrayKey].push(decodedValue);
      } else {
        params[decodedKey] = decodedValue;
      }

      return params;
    }, {});
};

export const formatApiResponse = (response) => {
  return {
    success: true,
    data: response.data,
    message: response.message || 'Success'
  };
};

export const formatApiError = (error) => {
  return {
    success: false,
    error: handleApiError(error),
    status: error.response?.status
  };
};

export const isUnauthorizedError = (error) => {
  return error.response?.status === 401;
};

export const isForbiddenError = (error) => {
  return error.response?.status === 403;
};

export const isNotFoundError = (error) => {
  return error.response?.status === 404;
};

export const isValidationError = (error) => {
  return error.response?.status === 422 || error.response?.status === 400;
};

export default {
  handleApiError,
  buildQueryString,
  parseQueryString,
  formatApiResponse,
  formatApiError,
  isUnauthorizedError,
  isForbiddenError,
  isNotFoundError,
  isValidationError
};