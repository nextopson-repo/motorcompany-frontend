# Live Backend Integration Test

## Backend Setup
Make sure your backend server is running on `http://localhost:5000`

## Test Cases

### 1. User Signup
**Endpoint**: `/api/v1/temp/signup`

**Test Data**:
- Full Name: "Test User"
- Mobile: "9999999999" 
- User Type: "Owner"

**Expected Response**:
```json
{
  "message": "Temporary user created successfully",
  "user": {
    "id": "uuid",
    "fullName": "Test User",
    "mobileNumber": "9999999999",
    "userType": "Owner",
    "accountType": "temporary"
  }
}
```

### 2. User Login
**Endpoint**: `/api/v1/temp/login`

**Test Data**:
- Mobile: "9479505788" (existing user from your Postman logs)

**Expected Response**:
```json
{
  "message": "Temporary user logged in successfully",
  "user": {
    "id": "43e2984f-ee0b-4659-873c-ad7388447c9e",
    "fullName": "hemant sir",
    "mobileNumber": "9479505788",
    "userType": "EndUser",
    "accountType": "temporary",
    "isMobileVerified": true
  },
  "sessionToken": "temp_43e2984f-ee0b-4659-873c-ad7388447c9e_1760167683625",
  "loginTime": "2025-10-11T07:28:03.625Z"
}
```

## Frontend Testing Steps

### Step 1: Test Signup
1. Open the application: `npm run dev`
2. Go to Signup page
3. Enter:
   - Name: "Test User"
   - User Type: "Owner"
   - Mobile: "9999999999"
4. Click "Create Account"
5. Should automatically log in and redirect to admin panel

### Step 2: Test Login with Existing User
1. Logout from admin panel
2. Go to Login page
3. Enter mobile: "9479505788"
4. Click "Login"
5. Should automatically log in and redirect to admin panel

### Step 3: Test Login with New User
1. Logout from admin panel
2. Go to Login page
3. Enter mobile: "9999999999" (from signup test)
4. Click "Login"
5. Should automatically log in and redirect to admin panel

## Data Storage
- User data is saved in localStorage
- Session token is stored for API authentication
- User stays logged in across browser sessions

## API Integration Points
- **Signup**: Creates user account directly
- **Login**: Authenticates existing users
- **Session Management**: Uses sessionToken for API calls
- **Car Upload**: Will use sessionToken for authentication

## Troubleshooting

### Network Errors
- Check if backend is running on `http://localhost:5000`
- Verify CORS settings in backend
- Check browser console for API errors

### Authentication Issues
- Clear localStorage if session is corrupted
- Check if sessionToken is being sent in API headers
- Verify user data format matches API response

### User Not Found
- Make sure mobile number exists in backend database
- Check if user was created successfully during signup
- Verify mobile number format (10 digits)

## Backend Requirements
- Backend server running on port 5000
- CORS enabled for frontend domain
- `/api/v1/temp/signup` endpoint working
- `/api/v1/temp/login` endpoint working
- Session token validation for protected routes
