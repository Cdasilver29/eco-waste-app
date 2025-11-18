// src/utils/validators.js

export const validators = {
  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return '';
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Invalid email format';
    return '';
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain a number';
    return '';
  },

  minLength: (value, min, fieldName = 'This field') => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return '';
  },

  maxLength: (value, max, fieldName = 'This field') => {
    if (value && value.length > max) {
      return `${fieldName} must not exceed ${max} characters`;
    }
    return '';
  },

  phone: (value) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!value) return 'Phone number is required';
    if (!phoneRegex.test(value)) return 'Invalid phone number format';
    return '';
  },

  url: (value) => {
    if (!value) return 'URL is required';
    try {
      new URL(value);
      return '';
    } catch {
      return 'Invalid URL format';
    }
  },

  number: (value, min, max) => {
    const num = Number(value);
    if (isNaN(num)) return 'Must be a number';
    if (min !== undefined && num < min) return `Must be at least ${min}`;
    if (max !== undefined && num > max) return `Must not exceed ${max}`;
    return '';
  },

  integer: (value) => {
    const num = Number(value);
    if (isNaN(num)) return 'Must be a number';
    if (!Number.isInteger(num)) return 'Must be a whole number';
    return '';
  },

  positiveNumber: (value) => {
    const num = Number(value);
    if (isNaN(num)) return 'Must be a number';
    if (num <= 0) return 'Must be greater than 0';
    return '';
  },

  match: (value, matchValue, fieldName = 'Passwords') => {
    if (value !== matchValue) return `${fieldName} do not match`;
    return '';
  },

  date: (value) => {
    if (!value) return 'Date is required';
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date';
    return '';
  },

  futureDate: (value) => {
    if (!value) return 'Date is required';
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date';
    if (date <= new Date()) return 'Date must be in the future';
    return '';
  },

  pastDate: (value) => {
    if (!value) return 'Date is required';
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date';
    if (date >= new Date()) return 'Date must be in the past';
    return '';
  },

  fileSize: (file, maxSizeInMB = 5) => {
    if (!file) return 'File is required';
    const maxSize = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSize) return `File size must not exceed ${maxSizeInMB}MB`;
    return '';
  },

  fileType: (file, allowedTypes = []) => {
    if (!file) return 'File is required';
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
    }
    return '';
  },

  imageFile: (file) => {
    if (!file) return 'Image is required';
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid image type. Please upload JPG, PNG, or WebP';
    }
    return '';
  },

  weight: (value) => {
    const num = Number(value);
    if (isNaN(num)) return 'Must be a number';
    if (num <= 0) return 'Weight must be greater than 0';
    if (num > 1000) return 'Weight seems unrealistic. Please check';
    return '';
  },

  coordinates: (lat, lng) => {
    const latitude = Number(lat);
    const longitude = Number(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) return 'Invalid coordinates';
    if (latitude < -90 || latitude > 90) return 'Invalid latitude';
    if (longitude < -180 || longitude > 180) return 'Invalid longitude';
    return '';
  }
};

export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    const value = values[field];
    
    for (const rule of fieldRules) {
      const error = typeof rule === 'function' ? rule(value) : '';
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return errors;
};

export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

export default validators;