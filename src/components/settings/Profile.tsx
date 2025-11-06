import {
  Building,
  Edit,
  Mail,
  MapPin,
  MapPinHouse,
  Phone,
  PinIcon,
  User,
  CheckCircle2,
  CircleAlert,
  CameraIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  type UserProfile,
  setUser,
  resetOtpState,
  updateUserProfile,
} from "../../store/slices/profileSlice";
import toast from "react-hot-toast";

interface profileProps {
  user: UserProfile;
  imageUrl: string;
  onUploadImage: (file: File) => void;
  loading: boolean;
}

const SkeletonField = ({ full = false }: { full?: boolean }) => (
  <div className={`flex flex-col ${full ? "md:col-span-2" : ""}`}>
    <span className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
    <span className="h-7 bg-gray-200 rounded w-full animate-pulse mb-2" /> {" "}
  </div>
);

const SkeletonProfile = () => (
  <main className="w-full flex-1 mx-auto relative mb-8 lg:mb-0">
    {/* Header */}{" "}
    <div className="flex items-center gap-3 md:mb-6 py-1.5 px-4 md:px-0">
      <span className="h-8 bg-gray-200 rounded w-32 animate-pulse" />{" "}
    </div>
    {/* Profile Image */}{" "}
    <div className="md:hidden flex justify-center mb-4 md:mb-6 relative">
      <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />{" "}
    </div>
    {/* Skeleton Fields */}{" "}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 px-4 md:px-0">
      <SkeletonField />
      <SkeletonField />
      <SkeletonField />
      <SkeletonField full />
      <SkeletonField full />
      <SkeletonField />
      <SkeletonField />{" "}
    </div>
    {/* Skeleton Buttons */}{" "}
    <div className="mt-4 md:mt-8 px-4 md:px-0">
      {" "}
      <span className="h-10 bg-gray-200 rounded w-full animate-pulse block" />{" "}
    </div>{" "}
  </main>
);

export default function Profile({
  user,
  imageUrl,
  onUploadImage,
  loading,
}: profileProps) {
  const dispatch = useAppDispatch();
  const { success, error } = useAppSelector((state) => state.profile);
  useEffect(() => {
    setLocalUser(user);
  }, [user]);
  const [localUser, setLocalUser] = useState(user);

  const [editMode, setEditMode] = useState(false);

  if (loading) {
    return <SkeletonProfile />;
  }
  if(success === true){
    toast.success("Profile fetched successfully!", { id: "profile-fetch" });
    console.log("Profile fetched successfully!")
  }

  // if (!user) {
  //   return (
  //     <main className="flex-1 p-4">
  //       <p className="text-gray-500">No profile data available.</p>
  //     </main>
  //   );
  // }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUser({
      ...localUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    dispatch(setUser(user));
    dispatch(resetOtpState());
    setEditMode(false);
  };

  const handleEmailVerification = () => {
    toast.error("Verify link send on your email.", { id: "verify email" });
    if (!user.email) {
      toast.error("Please enter a valid email before verifying.", { id: "error on verifying" });
      return;
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...localUser,
      };
      await dispatch(updateUserProfile(payload)).unwrap();
    } catch (err) {
      toast.error(`Failed to update profile : ${err}`, { id: "error in update" });
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      onUploadImage(file);
    }
  };

  return (
    <main className="w-full flex-1 mx-auto relative mb-8 lg:mb-0">
      {/* Header */}
      <div className="flex items-center gap-3 md:mb-6 bg-white text-black py-1.5 px-4 md:px-0 z-10">
        <h1 className="text-md md:text-2xl font-semibold">My Profile</h1>
      </div>

      {/* Profile Image */}
      <div className="md:hidden flex justify-center mb-4 md:mb-6 relative">
        <div className="relative pt-6">
          <div className="block md:hidden w-full">
            <div className="flex flex-col items-center gap-2">
              {/* Just show the image — no label needed */}
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <img
                  src={imageUrl || "/default-men-logo.jpg"}
                  alt={"profile Avatar"}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
              </div>

              {/* Camera icon button triggers hidden input */}
              <button
                type="button"
                onClick={() => document.getElementById("profileImage")?.click()}
                className="absolute bottom-0 right-0 bg-[#cb202d] p-1 rounded-full hover:bg-[#cb202e] cursor-pointer"
              >
                <CameraIcon className="w-4 h-4 text-white" />
              </button>

              {/* Hidden file input */}
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Fields */}
      {!user ? (
        <div className="flex justify-center items-center h-[450px]">
          <p className="text-gray-500 text-center">
            No profile data available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 px-4 md:px-0">
          <Field
            icon={<User size={12} />}
            label="Full Name"
            name="fullName"
            value={localUser?.fullName}
            editable={editMode}
            onChange={handleChange}
          />
          <Field
            icon={<CgProfile size={12} />}
            label="User Type"
            name="userType"
            value={localUser?.userType}
            editable={false}
            onChange={handleChange}
          />
          <Field
            icon={<Phone size={12} />}
            label="Phone Number"
            name="mobileNumber"
            value={localUser?.mobileNumber}
            editable={false}
            onChange={handleChange}
          />

          {/* ✅ Email Field with Verify Button */}
          <div className="flex flex-col">
            <span className="text-gray-700 text-[10px] md:text-xs font-semibold flex items-center gap-2 md:gap-1">
              <Mail size={12} />
              Email
            </span>
            <div className="flex items-center gap-2 my-2">
              {localUser?.emailVerified ? (
                <span className="flex items-center text-green-600 text-[11px] font-semibold">
                  <CheckCircle2 size={14} className="mr-1" />
                  Verified
                </span>
              ) : (
                <div className="relative flex items-center">
                  {/* Alert Icon with hover trigger */}
                  <div
                    className="group relative flex items-center"
                    onClick={handleEmailVerification}
                  >
                    <CircleAlert
                      size={16}
                      className="text-red-600 cursor-pointer transition-transform duration-200 group-hover:scale-110"
                    />

                    {/* Tooltip Badge */}
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 
      bg-white text-black text-[10px] rounded-md shadow-md border border-gray-200 
      px-2 py-1.5 w-max max-w-[150px] 
      opacity-0 pointer-events-none scale-90 
      group-hover:opacity-100 group-hover:scale-100 
      transition-all duration-200 z-20"
                    >
                      <p className="text-[8px] text-center">
                        Your email is not verified. <br /> For verify click on
                        above icon
                      </p>
                    </div>
                  </div>
                </div>

                // <button
                //   onClick={handleEmailVerification}
                //   // disabled={emailVerificationLoading}
                //   className="text-[11px] bg-red-500 text-white px-2 md:px-3 py-1 rounded hover:bg-red-600 transition-all"
                // >
                //   {/* {emailVerificationLoading ? "Sending..." : "Verify Now"} */}
                //   {"Verify Now"}
                // </button>
              )}
              {editMode ? (
                <input
                  type="text"
                  name="email"
                  value={localUser?.email}
                  onChange={handleChange}
                  className="flex-1 border rounded-xs md:rounded px-3 py-2 text-xs md:text-sm bg-gray-100"
                />
              ) : (
                <span className="flex-1 text-gray-700 text-xs md:text-sm bg-gray-100 rounded px-3 py-2 capitalize">
                  {localUser?.email}
                </span>
              )}
            </div>
          </div>

          <Field
            icon={<MapPinHouse size={12} />}
            label="Address"
            name="address"
            value={localUser?.address}
            editable={editMode}
            onChange={handleChange}
            full
          />
          <Field
            icon={<MapPin size={12} />}
            label="Landmark"
            name="landmark"
            value={localUser?.landmark}
            editable={editMode}
            onChange={handleChange}
            full
          />
          <Field
            icon={<Building size={12} />}
            label="City"
            name="city"
            value={localUser?.city}
            editable={editMode}
            onChange={handleChange}
          />
          <Field
            icon={<PinIcon size={12} />}
            label="Pin Code"
            name="pin"
            value={localUser?.pin}
            editable={editMode}
            onChange={handleChange}
          />
        </div>
      )}

      {/* Error */}
      <span>
        <p className="text-red-500 text-xs md:text-sm">{error}</p>
      </span>

      {/* Save / Cancel Buttons */}
      <div className="mt-4 md:mt-8 px-4 md:px-0">
        {editMode ? (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
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
