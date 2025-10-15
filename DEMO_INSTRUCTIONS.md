# Demo Instructions

## Authentication Flow (Demo Mode)

### Signup Process
1. **Enter Details**: Fill in name, user type, and mobile number
2. **Send OTP**: Click "Send OTP" - this will show the OTP field (no actual OTP sent)
3. **Enter Any OTP**: Enter any 4-digit number (e.g., 1234) for demo purposes
4. **Account Created**: User account is created and saved to localStorage
5. **Auto Login**: User is automatically logged in and redirected to admin panel

### Login Process
1. **Enter Mobile**: Enter the mobile number used during signup
2. **Auto Login**: If mobile number exists in localStorage, user is automatically logged in
3. **Demo Login**: If mobile number doesn't exist, enter any 4-digit OTP for demo purposes

### Demo Data
The application comes with pre-loaded demo data:

#### Sample Users:
- **MOID** (Mobile: 6392807997) - Owner
- **Aditya Yadav** (Mobile: 9876543210) - Owner  
- **Priya Sharma** (Mobile: 9876543211) - Dealer
- **Rajesh Kumar** (Mobile: 9876543212) - EndUser

#### Sample Cars:
- **Maruti Suzuki Swift VXI** - ₹5.5L
- **Honda City  ZX VTEC** - ₹7.5L

## Testing the Flow

### Test Case 1: Existing User Login
1. Go to Login page
2. Enter mobile: `6392807997` (MOID's number)
3. Click "Send OTP"
4. User should be automatically logged in (no OTP needed)

### Test Case 2: New User Signup
1. Go to Signup page
2. Enter: Name: "Test User", Type: "Owner", Mobile: "9999999999"
3. Click "Send OTP"
4. Enter any 4-digit OTP (e.g., 1234)
5. Click "Verify & Create Account"
6. User should be logged in and redirected to admin panel

### Test Case 3: Non-existent User Login
1. Go to Login page
2. Enter mobile: "8888888888" (non-existent number)
3. Click "Send OTP"
4. Enter any 4-digit OTP (e.g., 5678)
5. Click "Verify & Login"
6. User should be logged in as "Demo User"

## Features Available

### Admin Panel
- **Dashboard**: View statistics and metrics
- **Vehicle Management**: View, add, edit, delete cars
- **User Management**: View user list
- **Responsive Design**: Works on mobile and desktop

### Car Management
- **Add New Car**: Upload car details with images
- **Filter & Search**: Filter by brand, fuel type, price range, etc.
- **Sort Options**: Sort by price, year, kilometers, name
- **View Modes**: Grid and list view options

### Authentication
- **Persistent Login**: User stays logged in across browser sessions
- **Logout**: Clears localStorage and redirects to login
- **User Profile**: Shows current user info in navbar

## Technical Notes

- **localStorage**: User data is saved in browser's localStorage
- **No API Calls**: All authentication is handled locally for demo
- **OTP Fields**: Show for UI demonstration only
- **Auto Login**: Existing users are logged in automatically
- **Demo Mode**: Any 4-digit OTP works for new users

## Troubleshooting

### User Not Logging In
- Check if mobile number exists in demo data
- Clear localStorage and try again
- Use one of the sample mobile numbers

### OTP Not Working
- Enter exactly 4 digits
- Any 4-digit number works (e.g., 1234, 5678, 9999)

### Data Not Persisting
- Check browser's localStorage settings
- Ensure cookies/localStorage is enabled
- Try in incognito/private mode if needed
