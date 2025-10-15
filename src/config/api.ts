// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP_SEND_OTP: '/temp/signup',
  SIGNUP_VERIFY_OTP: '/temp/signup/verify-otp',
  LOGIN_SEND_OTP: '/temp/login',
  LOGIN_VERIFY_OTP: '/temp/login/verify-otp',
  
  // Car endpoints
  UPLOAD_CAR: '/temp/cars',
  UPLOAD_IMAGE: '/temp/upload-car-images-with-rekognition',
  GET_CARS: '/temp/cars',
  DELETE_CAR: '/temp/cars',
  
  // User endpoints
  GET_USERS: '/temp/users',
  DELETE_USER: '/temp/users',
};

// Request Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  MAX_IMAGES_PER_CAR: 10,
};

// OTP Configuration
export const OTP_CONFIG = {
  LENGTH: 4,
  EXPIRY_TIME: 10 * 60 * 1000, // 10 minutes
  RETRY_DELAY: 60 * 1000, // 1 minute
};