import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/useAppDispatch';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AdminPanel from './components/admin/AdminPanel';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector(s => s.app.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Public Route component (redirects authenticated users to dashboard)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector(s => s.app.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/admin" replace />;
}

// Layout component for pages with navbar
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Layout>
              <Login />
            </Layout>
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Layout>
              <Signup />
            </Layout>
          </PublicRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AppRoutes />
  );
}