# Dhikcar Admin Panel
 
A modern, responsive admin panel for managing car dealership operations built with React, TypeScript, and Tailwind CSS.
 
## Features

### 🚗 Vehicle Management
- **Comprehensive CRUD Operations**: Create, read, update, and delete vehicles
- **Advanced Filtering**: Filter by brand, fuel type, transmission, condition, price range, and year
- **Search Functionality**: Search across vehicle titles, brands, models, locations, and owners
- **Sorting Options**: Sort by price, year, kilometers driven, or name
- **Responsive Grid/List Views**: Switch between grid and list layouts
- **Image Management**: Upload and manage vehicle images with fallback support
- **Detailed Vehicle Information**: Track all essential vehicle details

### 👥 User Management
- **User Registration & Authentication**: Secure login/signup system
- **User Types**: Support for Owner, Dealer, and EndUser types
- **Profile Management**: User profile display and management

### 📊 Dashboard
- **Real-time Statistics**: View total vehicles, users, revenue, and average prices
- **Visual Analytics**: Clean dashboard with key metrics
- **Quick Access**: Easy navigation between different sections

### 🎨 UI/UX Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern Interface**: Clean, professional design with smooth animations
- **Accessibility**: Proper focus management and keyboard navigation
- **Loading States**: Smooth loading animations and feedback
- **Error Handling**: Comprehensive error handling with user-friendly messages

### 🔧 Technical Features
- **API Integration**: Complete integration with Dhikcar backend API
- **OTP Authentication**: Mobile-based OTP authentication system
- **File Upload**: Car image upload with AWS Rekognition integration
- **Type Safety**: Full TypeScript implementation
- **State Management**: Context-based state management with reducers
- **Custom Hooks**: Reusable hooks for API operations
- **Component Architecture**: Modular, reusable component structure

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Context + useReducer

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── admin/          # Admin panel components
│   ├── cars/           # Vehicle management components
│   └── layout/         # Layout components (Navbar, etc.)
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── types/              # TypeScript type definitions
└── reducers/           # State management reducers
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Admin-temp-cars/temp-cars
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file
   echo "VITE_API_URL=http://localhost:3000/api/v1" > .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Backend Integration

This application integrates with the Dhikcar backend API. Make sure your backend server is running on `http://localhost:3000` before starting the frontend.

For detailed API integration information, see [API_INTEGRATION.md](./API_INTEGRATION.md)

For demo instructions and testing guide, see [DEMO_INSTRUCTIONS.md](./DEMO_INSTRUCTIONS.md)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The application includes complete integration with the live Dhikcar backend API:

### Integrated Endpoints

- **Authentication**: Direct signup and login
  - `/temp/signup` - Create user account directly
  - `/temp/login` - Login with mobile number

- **Car Management**: Complete CRUD operations
  - `/temp/cars` - Upload car with images
  - `/temp/upload-car-images-with-rekognition` - Upload images

### Authentication Flow

1. **Signup**: User enters details → Account created → Auto login
2. **Login**: User enters mobile → Direct login with session token

### Session Management

- Session tokens stored in localStorage
- Automatic authentication on app initialization
- Persistent login across browser sessions
- Secure API calls with Bearer token authentication

### API Services
- **AuthApiService**: Direct signup and login operations
- **VehicleApiService**: Car upload and management operations
- **UserApiService**: User management operations

### Custom Hooks
- `useAuth()` - Authentication operations
- `useVehicles()` - Car management operations
- `useUsers()` - User management operations

For complete API documentation, see [API_INTEGRATION.md](./API_INTEGRATION.md)

For live backend testing guide, see [LIVE_BACKEND_TEST.md](./LIVE_BACKEND_TEST.md)

## Component Documentation

### CarListing
Main component for vehicle management with filtering, sorting, and CRUD operations.

**Props**: None (uses context)

**Features**:
- Advanced filtering system
- Search functionality
- Sort by multiple criteria
- Grid/List view toggle
- Add/Edit/Delete vehicles

### CarCard
Individual vehicle display component with hover effects and action buttons.

**Props**:
- `vehicle`: Vehicle object
- `onEdit`: Edit callback
- `onDelete`: Delete callback
- `onView`: View callback

### CarModal
Modal component for creating, editing, and viewing vehicle details.

**Props**:
- `isOpen`: Modal visibility
- `onClose`: Close callback
- `onSave`: Save callback
- `vehicle`: Vehicle object (for edit/view)
- `mode`: 'create' | 'edit' | 'view'

### Navbar
Responsive navigation bar with authentication state.

**Features**:
- Logo and branding
- Authentication buttons
- User profile dropdown
- Mobile responsive menu

## Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Collapsible sidebar
- Touch-friendly interface
- Optimized form layouts
- Mobile navigation menu

## State Management

The application uses React Context with useReducer for state management:

### State Structure
```typescript
interface AppState {
  users: User[];
  vehicles: Vehicle[];
  currentUser: User | null;
  isAuthenticated: boolean;
}
```

### Actions
- `LOGIN` / `LOGOUT`
- `ADD_USER` / `DELETE_USER`
- `ADD_VEHICLE` / `UPDATE_VEHICLE` / `DELETE_VEHICLE`

## Future Enhancements

### Planned Features
- [ ] Image upload functionality
- [ ] Advanced analytics and reporting
- [ ] Bulk operations
- [ ] Export functionality
- [ ] Real-time notifications
- [ ] Multi-language support
- [ ] Dark mode theme

### API Integration
- [x] Backend API connection
- [x] OTP-based authentication system
- [x] File upload handling with AWS Rekognition
- [x] Car upload API integration
- [ ] Real-time data synchronization
- [ ] Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Dhikcar**
