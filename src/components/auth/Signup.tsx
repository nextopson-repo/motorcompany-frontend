import { useState, useEffect } from "react";
import { Car, MapPin, Smartphone, User, UserCheck } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthApiService } from "../../services/api";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addUser, login } from "../../store/slices/appSlice";

const cities = [
  "Chandigarh",
  "Delhi",
  "Mumbai",
  "Pune",
  "Hyderabad",
  "Ahmedabad",
  "Surat",
  "Jaipur",
  "Kanpur",
  "Lucknow",
];

export default function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [userType, setUserType] = useState<"Owner" | "Dealer" | "EndUser">(
    "Owner"
  );
  const [mobile, setMobile] = useState("");
  // const [addressState, setAddressState] = useState("");
  const [addressCity, setAddressCity] = useState("");
  // const [addressLocality, setAddressLocality] = useState("");
  const [message, setMessage] = useState("");

  // Get mobile number from login page if redirected
  useEffect(() => {
    if (location.state?.mobile) {
      setMobile(location.state.mobile);
    }
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleSignup = async () => {
    if (!name.trim() || mobile.length !== 10) {
      setError("Please enter valid name and 10-digit mobile number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await AuthApiService.signup({
        fullName: name,
        mobileNumber: mobile,
        userType: userType,
        addressCity: addressCity,
      });

      if (response.success && response.data) {
        // Convert API user format to local format
        const user = {
          id: response.data.user.id,
          name: response.data.user.fullName || "User",
          email: "",
          mobile: response.data.user.mobileNumber || "",
          type: response.data.user.userType || "Owner",
          createdAt: new Date().toLocaleDateString(),
        };

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");

        dispatch(addUser(user));
        dispatch(login(user));
        navigate("/admin");
      } else {
        setError(response.error || "Signup failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-3">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-center mb-2">
          <div className="bg-blue-600 p-4 rounded-full">
            <Car size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Create Account
        </h1>
        {/* <p className="text-gray-600 text-center mb-8">
          Sign up to start selling cars
        </p> */}

        {/* Message Display */}
        {message && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">{message}</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* name, mobile, userType fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserCheck className="w-4 h-4 inline mr-1" />
                  User Type *
                </label>
                <select
                  value={userType}
                  onChange={(e) =>
                    setUserType(
                      e.target.value as "Owner" | "Dealer" | "EndUser"
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Owner">Owner</option>
                  <option value="Dealer">Dealer</option>
                  <option value="EndUser">EndUser</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Smartphone className="w-4 h-4 inline mr-1" />
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setError("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  maxLength={10}
                />
              </div>

              {/* city field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1 text-blue-600" />
                  City <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <select
                    value={addressCity}
                    onChange={(e) => {
                      setAddressCity(e.target.value);
                      setError("");
                    }}
                    className={`
            w-full px-4 py-3 pr-10 rounded-xl
            bg-white text-gray-800
            border border-gray-300 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            hover:border-blue-400 transition-all duration-200
            appearance-none cursor-pointer
          `}
                  >
                    <option value="" disabled className="text-gray-400">
                      Select your city
                    </option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>

                  {/* Custom dropdown arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-500 transition-transform duration-200 group-focus-within:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
          </div>

          {/* {error && <p className="text-sm text-red-500 mt-1">{error}</p>} */}

          <button
            onClick={handleSignup}
            disabled={loading || !name.trim() || mobile.length !== 10}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        <div className="text-center mt-3">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
