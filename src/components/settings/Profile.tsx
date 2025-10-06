import {
  Building,
  Edit,
  Mail,
  MapPin,
  MapPinHouse,
  Phone,
  PinIcon,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  updateField,
  type UserProfile,
  setUser,
  fetchUserProfile,
  sendOtp,
  verifyOtp,
  setOtp,
  resetOtpState,
} from "../../store/slices/profileSlice";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user, loading, error, otp, otpSent, otpVerified, verifyingOtp } =
    useAppSelector((state) => state.profile);

    console.log(user) //debugging

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <main className="flex-1 p-4">
        <p className="text-gray-500">No profile data available.</p>
      </main>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateField({
        field: e.target.name as keyof UserProfile,
        value: e.target.value,
      })
    );
  };

  const handleCancel = () => {
    dispatch(setUser(user));
    dispatch(resetOtpState());
    setEditMode(false);
  };

  return (
    <main className="w-full flex-1 mx-auto relative mb-8 lg:mb-0">
      {/* Header */}
      <div className="flex items-center gap-3 md:mb-6 bg-white text-black py-[6px] px-4 md:px-0 z-10">
        <h1 className="text-md md:text-2xl font-semibold">My Profile</h1>
      </div>

      {/* Profile Image */}
      <div className="md:hidden flex justify-center mb-4 md:mb-6 relative">
        <div className="block md:hidden absolute h-22 -z-0 w-full">
          <img
            src="/settings/main-bg.png"
            alt="header car"
            className="w-full h-full opacity-[60%] object-cover object-center"
          />
        </div>

        <div className="relative pt-6">
          <img
            src={user.avatar || "/user-img.png"}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <button className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full shadow">
            <Edit size={14} />
          </button>
        </div>
      </div>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 px-4 md:px-0">
        <Field
          icon={<User size={12} />}
          label="Full Name"
          name="fullName"
          value={user.fullName}
          editable={editMode}
          onChange={handleChange}
        />
        <Field
          icon={<CgProfile size={12} />}
          label="User Type"
          name="userType"
          value={user.userType}
          editable={false}
          onChange={handleChange}
        />
        <Field
          icon={<Phone size={12} />}
          label="Phone Number"
          name="mobileNumber"
          value={user.mobileNumber}
          editable={false}
          onChange={handleChange}
        />
        <Field
          icon={<Mail size={12} />}
          label="Email"
          name="email"
          value={user.email}
          editable={editMode}
          onChange={handleChange}
        />

        {/* OTP Section */}
        {editMode && (
          <div className="flex flex-col md:col-span-2 gap-2">
            {!otpVerified ? (
              !otpSent ? (
                <button
                  onClick={() => dispatch(sendOtp())}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs md:text-sm"
                >
                  Send OTP
                </button>
              ) : (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => dispatch(setOtp(e.target.value))}
                    className="border px-2 py-1 rounded text-xs md:text-sm"
                  />
                  <button
                    onClick={() => dispatch(verifyOtp({ otp }))}
                    className="px-3 py-1 bg-green-600 text-white rounded text-xs md:text-sm"
                    disabled={verifyingOtp}
                  >
                    {verifyingOtp ? "Verifying..." : "Verify"}
                  </button>
                </div>
              )
            ) : (
              <span className="text-green-600 text-xs md:text-sm font-semibold">
                Email verified ✅
              </span>
            )}
          </div>
        )}

        <Field
          icon={<MapPinHouse size={12} />}
          label="Address"
          name="address"
          value={user.address}
          editable={editMode}
          onChange={handleChange}
          full
        />
        <Field
          icon={<MapPin size={12} />}
          label="Landmark"
          name="landmark"
          value={user.landmark}
          editable={editMode}
          onChange={handleChange}
          full
        />
        <Field
          icon={<Building size={12} />}
          label="City"
          name="city"
          value={user.city}
          editable={editMode}
          onChange={handleChange}
        />
        <Field
          icon={<PinIcon size={12} />}
          label="Pin Code"
          name="pin"
          value={user.pin}
          editable={editMode}
          onChange={handleChange}
        />
      </div>

      {/* Error */}
      <span>
        <p className="text-red-500 text-xs md:text-sm">{error}</p>
      </span>

      {/* Save / Cancel Buttons */}
      <div className="mt-4 md:mt-8 px-4 md:px-0">
        {editMode ? (
          <div className="flex gap-3">
            <button
              onClick={() => setEditMode(false)}
              disabled={loading}
              className="flex-1 py-2 md:py-3 bg-red-500 text-white text-xs md:text-md rounded-xs md:rounded-sm font-semibold"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-2 md:py-3 border text-xs md:text-md rounded-xs md:rounded-sm text-black font-semibold"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="w-full py-2 md:py-3 bg-red-500 text-white text-xs md:text-md rounded-xs md:rounded-sm font-semibold flex items-center justify-center gap-2"
          >
            <Edit className="h-3 md:h-4 w-3 md:w-4" /> Edit Profile
          </button>
        )}
      </div>
    </main>
  );
}

// Field Component
const Field = ({
  icon,
  label,
  name,
  value,
  editable,
  onChange,
  full,
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  editable: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  full?: boolean;
}) => (
  <div className={`flex flex-col ${full ? "md:col-span-2" : ""}`}>
    <span className="text-gray-700 text-[10px] md:text-xs font-semibold flex items-center gap-2 md:gap-1">
      {icon}
      {label}
    </span>
    {editable ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded-xs md:rounded px-3 py-2 my-2 text-xs md:text-sm bg-gray-100 capitalize"
      />
    ) : (
      <span className="text-gray-700 text-xs md:text-sm bg-gray-100 rounded px-3 py-2 my-2 capitalize">
        {value}
      </span>
    )}
  </div>
);