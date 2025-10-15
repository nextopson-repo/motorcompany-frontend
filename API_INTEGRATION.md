# API Integration Guide

This document provides a comprehensive guide for integrating the Dhikcar Admin Panel with the backend API endpoints.

## Backend API Endpoints

The application is configured to work with the following backend endpoints:

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### 1. Signup OTP
- **Endpoint**: `POST /temp/signup/send-otp`
- **Purpose**: Send OTP for user registration
- **Request Body**:
  ```json
  {
    "fullName": "string",
    "mobileNumber": "string",
    "userType": "Owner" | "Dealer" | "EndUser"
  }
  ```
- **Response**:
  ```json
  {
    "message": "OTP sent successfully",
    "mobileNumber": "string"
  }
  ```

#### 2. Verify Signup OTP
- **Endpoint**: `POST /temp/signup/verify-otp`
- **Purpose**: Verify OTP and create user account
- **Request Body**:
  ```json
  {
    "fullName": "string",
    "mobileNumber": "string",
    "otp": "string",
    "userType": "Owner" | "Dealer" | "EndUser"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": "string",
      "fullName": "string",
      "mobileNumber": "string",
      "userType": "string",
      "accountType": "temporary",
      "isMobileVerified": true
    }
  }
  ```

#### 3. Login OTP
- **Endpoint**: `POST /temp/login/send-otp`
- **Purpose**: Send OTP for user login
- **Request Body**:
  ```json
  {
    "mobileNumber": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "OTP sent successfully",
    "mobileNumber": "string"
  }
  ```

#### 4. Verify Login OTP
- **Endpoint**: `POST /temp/login/verify-otp`
- **Purpose**: Verify OTP and authenticate user
- **Request Body**:
  ```json
  {
    "mobileNumber": "string",
    "otp": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "string",
      "fullName": "string",
      "mobileNumber": "string",
      "userType": "string",
      "accountType": "temporary",
      "isMobileVerified": true
    }
  }
  ```

### Car Management Endpoints

#### 5. Upload Car
- **Endpoint**: `POST /temp/cars`
- **Purpose**: Create a new car listing
- **Content-Type**: `multipart/form-data`
- **Request Body** (FormData):
  ```
  userId: string
  title: string
  description?: string
  category: string
  subCategory: string
  carPrice: number
  addressState: string
  addressCity: string
  addressLocality: string
  carName: string
  isSale: boolean
  width?: number
  height?: number
  length?: number
  groundHeight?: number
  unit?: string
  imageKeys?: string[]
  images?: File[] (up to 10 files)
  ```
- **Response**:
  ```json
  {
    "message": "Car created successfully",
    "car": {
      "id": "string",
      "title": "string",
      // ... other car properties
    }
  }
  ```

#### 6. Upload Car Images
- **Endpoint**: `POST /temp/upload-car-images-with-rekognition`
- **Purpose**: Upload car images with AWS Rekognition analysis
- **Content-Type**: `multipart/form-data`
- **Request Body** (FormData):
  ```
  file: File
  ```
- **Response**:
  ```json
  {
    "message": "Image uploaded successfully",
    "data": {
      "url": "string",
      "key": "string",
      "imgClassifications": "string",
      "accurencyPercent": number
    }
  }
  ```

## Frontend Implementation

### Configuration

The API configuration is managed in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const API_ENDPOINTS = {
  SIGNUP_SEND_OTP: '/temp/signup/send-otp',
  SIGNUP_VERIFY_OTP: '/temp/signup/verify-otp',
  LOGIN_SEND_OTP: '/temp/login/send-otp',
  LOGIN_VERIFY_OTP: '/temp/login/verify-otp',
  UPLOAD_CAR: '/temp/cars',
  UPLOAD_IMAGE: '/temp/upload-car-images-with-rekognition',
  // ... other endpoints
};
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### API Service Layer

The API service layer is implemented in `src/services/api.ts` with the following key classes:

- `ApiClient`: Base HTTP client with error handling
- `AuthApiService`: Authentication operations
- `VehicleApiService`: Car management operations
- `UserApiService`: User management operations

### Custom Hooks

Custom hooks are available in `src/hooks/useApi.ts`:

- `useAuth()`: Authentication operations with OTP flow
- `useVehicles()`: Vehicle management operations
- `useUsers()`: User management operations

### Usage Examples

#### Authentication Flow

```typescript
import { useAuth } from '../hooks/useApi';

function LoginComponent() {
  const { sendLoginOTP, verifyLoginOTP, loading, error } = useAuth();

  const handleSendOTP = async () => {
    const result = await sendLoginOTP('9876543210');
    if (result) {
      // OTP sent successfully
    }
  };

  const handleVerifyOTP = async () => {
    const result = await verifyLoginOTP({
      mobileNumber: '9876543210',
      otp: '1234'
    });
    if (result) {
      // User logged in successfully
    }
  };
}
```

#### Car Upload

```typescript
import { useVehicles } from '../hooks/useApi';

function CarUploadComponent() {
  const { uploadCar, loading, error } = useVehicles();

  const handleUploadCar = async () => {
    const carData = {
      userId: 'user123',
      title: 'Maruti Swift VXI',
      category: 'Hatchback',
      subCategory: 'Swift VXI',
      carPrice: 550000,
      addressState: 'Uttar Pradesh',
      addressCity: 'Lucknow',
      addressLocality: 'Arjunganj',
      carName: 'Maruti Swift VXI',
      isSale: true
    };

    const images = [file1, file2, file3]; // File objects
    const result = await uploadCar(carData, images);
    if (result) {
      // Car uploaded successfully
    }
  };
}
```

## Error Handling

The API service includes comprehensive error handling:

1. **Network Errors**: Connection timeouts, server unavailable
2. **HTTP Errors**: 4xx, 5xx status codes
3. **Validation Errors**: Invalid request data
4. **Business Logic Errors**: User not found, OTP expired

Error messages are user-friendly and displayed in the UI.

## Authentication State Management

User authentication state is managed using React Context API:

- User data is stored in localStorage
- Authentication status is tracked globally
- Protected routes automatically redirect to login
- User can logout and clear all data

## File Upload Handling

Car image uploads support:

- Multiple file selection
- Image preview before upload
- File type validation (JPEG, PNG, WebP)
- File size limits (10MB per file)
- Progress indicators
- Error handling for failed uploads

## Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Start Backend Server**:
   ```bash
   cd ../Dhikcar-backend
   npm start
   ```

## Testing

The application includes comprehensive error handling and user feedback:

- Loading states for all async operations
- Error messages for failed requests
- Success notifications for completed operations
- Form validation for user inputs

## Production Deployment

For production deployment:

1. Update `VITE_API_URL` to your production API endpoint
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting service
4. Ensure CORS is configured on your backend API

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from your frontend domain
2. **API Connection**: Verify the backend server is running and accessible
3. **OTP Not Received**: Check mobile number format and SMS service configuration
4. **File Upload Fails**: Verify file size limits and supported formats

### Debug Mode

Enable debug mode by adding to your `.env`:

```env
VITE_DEBUG=true
```

This will log all API requests and responses to the browser console.
