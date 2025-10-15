import { useState } from 'react';
import { Car, Smartphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthApiService } from '../../services/api';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { login } from '../../store/slices/appSlice';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [mobile, setMobile] = useState('');

  const handleLogin = async () => {
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await AuthApiService.login(mobile);

      if (response.success && response.data) {
        // Convert API user format to local format
        const user = {
          id: response.data.user.id,
          name: response.data.user.fullName || 'User',
          email: '',
          mobile: response.data.user.mobileNumber || '',
          type: response.data.user.userType || 'Owner',
          created: new Date().toLocaleDateString()
        };

        // Save session token and user data to localStorage
        localStorage.setItem('sessionToken', response.data.sessionToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');

        dispatch(login(user));
        navigate('/admin');
      } else {
        setError(response.error || 'Login failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full">
            <Car size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-8">Login to access your car dealership</p>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Smartphone className="w-4 h-4 inline mr-1" />
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              maxLength={10}
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading || mobile.length !== 10}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            New user? <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
