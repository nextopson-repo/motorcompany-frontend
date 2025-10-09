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
} from "lucide-react";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  updateField,
  type UserProfile,
  setUser,
  fetchUserProfile,
  resetOtpState,
  updateUserProfile,
  // sendEmailVerification, // ✅ new redux action
} from "../../store/slices/profileSlice";

export default function Profile() {
  const dispatch = useAppDispatch();
  // const { user, loading, error, emailVerificationLoading } = //todo email link verification
  const { user, loading, error } = useAppSelector((state) => state.profile);

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

  const handleEmailVerification = () => {
    alert("Verify link send on your email.");
    if (!user.email) {
      alert("Please enter a valid email before verifying.");
      return;
    }
    // dispatch(sendEmailVerification(user.email))
    //   .unwrap()
    //   .then(() => {
    //     alert("Verification link sent! Please check your email.");
    //   })
    //   .catch((err) => {
    //     console.error("Email verification failed:", err);
    //     alert("Failed to send verification email.");
    //   });
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

        {/* ✅ Email Field with Verify Button */}
        <div className="flex flex-col">
          <span className="text-gray-700 text-[10px] md:text-xs font-semibold flex items-center gap-2 md:gap-1">
            <Mail size={12} />
            Email
          </span>
          <div className="flex items-center gap-2 my-2">
            {user.emailVerified ? (
              <span className="flex items-center text-green-600 text-[11px] font-semibold">
                <CheckCircle2 size={14} className="mr-1" />
                Verified
              </span>
            ) : (
              <div className="relative flex items-center">
                {/* Alert Icon with hover trigger */}
                <div className="group relative flex items-center" onClick={handleEmailVerification}>
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
                value={user.email}
                onChange={handleChange}
                className="flex-1 border rounded-xs md:rounded px-3 py-2 text-xs md:text-sm bg-gray-100"
              />
            ) : (
              <span className="flex-1 text-gray-700 text-xs md:text-sm bg-gray-100 rounded px-3 py-2 capitalize">
                {user.email}
              </span>
            )}
          </div>
        </div>

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
              onClick={() => {
                if (user) {
                  dispatch(updateUserProfile(user))
                    .unwrap()
                    .then(() => {
                      alert("Profile updated successfully!");
                      setEditMode(false);
                    })
                    .catch((err) => {
                      console.error("Update failed:", err);
                      alert("Failed to update profile");
                    });
                }
              }}
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

// import {
//   Building,
//   Edit,
//   Mail,
//   MapPin,
//   MapPinHouse,
//   Phone,
//   PinIcon,
//   User,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { CgProfile } from "react-icons/cg";
// import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
// import {
//   updateField,
//   type UserProfile,
//   setUser,
//   fetchUserProfile,
//   resetOtpState,
//   updateUserProfile,
// } from "../../store/slices/profileSlice";

// export default function Profile() {
//   const dispatch = useAppDispatch();
//   const { user, loading, error } =
//     useAppSelector((state) => state.profile);

//   const [editMode, setEditMode] = useState(false);

//   useEffect(() => {
//     if (!user) {
//       dispatch(fetchUserProfile());
//     }
//   }, [dispatch, user]);

//   if (!user) {
//     return (
//       <main className="flex-1 p-4">
//         <p className="text-gray-500">No profile data available.</p>
//       </main>
//     );
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     dispatch(
//       updateField({
//         field: e.target.name as keyof UserProfile,
//         value: e.target.value,
//       })
//     );
//   };

//   const handleCancel = () => {
//     dispatch(setUser(user));
//     dispatch(resetOtpState());
//     setEditMode(false);
//   };

//   return (
//     <main className="w-full flex-1 mx-auto relative mb-8 lg:mb-0">
//       {/* Header */}
//       <div className="flex items-center gap-3 md:mb-6 bg-white text-black py-[6px] px-4 md:px-0 z-10">
//         <h1 className="text-md md:text-2xl font-semibold">My Profile</h1>
//       </div>

//       {/* Profile Image */}
//       <div className="md:hidden flex justify-center mb-4 md:mb-6 relative">
//         <div className="block md:hidden absolute h-22 -z-0 w-full">
//           <img
//             src="/settings/main-bg.png"
//             alt="header car"
//             className="w-full h-full opacity-[60%] object-cover object-center"
//           />
//         </div>

//         <div className="relative pt-6">
//           <img
//             src={user.avatar || "/user-img.png"}
//             alt="profile"
//             className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
//           />
//           <button className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full shadow">
//             <Edit size={14} />
//           </button>
//         </div>
//       </div>

//       {/* Profile Fields */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 px-4 md:px-0">
//         <Field
//           icon={<User size={12} />}
//           label="Full Name"
//           name="fullName"
//           value={user.fullName}
//           editable={editMode}
//           onChange={handleChange}
//         />
//         <Field
//           icon={<CgProfile size={12} />}
//           label="User Type"
//           name="userType"
//           value={user.userType}
//           editable={false}
//           onChange={handleChange}
//         />
//         <Field
//           icon={<Phone size={12} />}
//           label="Phone Number"
//           name="mobileNumber"
//           value={user.mobileNumber}
//           editable={false}
//           onChange={handleChange}
//         />
//         <Field
//           icon={<Mail size={12} />}
//           label="Email"
//           name="email"
//           value={user.email}
//           editable={editMode}
//           onChange={handleChange}
//         />

//         <Field
//           icon={<MapPinHouse size={12} />}
//           label="Address"
//           name="address"
//           value={user.address}
//           editable={editMode}
//           onChange={handleChange}
//           full
//         />
//         <Field
//           icon={<MapPin size={12} />}
//           label="Landmark"
//           name="landmark"
//           value={user.landmark}
//           editable={editMode}
//           onChange={handleChange}
//           full
//         />
//         <Field
//           icon={<Building size={12} />}
//           label="City"
//           name="city"
//           value={user.city}
//           editable={editMode}
//           onChange={handleChange}
//         />
//         <Field
//           icon={<PinIcon size={12} />}
//           label="Pin Code"
//           name="pin"
//           value={user.pin}
//           editable={editMode}
//           onChange={handleChange}
//         />
//       </div>

//       {/* Error */}
//       <span>
//         <p className="text-red-500 text-xs md:text-sm">{error}</p>
//       </span>

//       {/* Save / Cancel Buttons */}
//       <div className="mt-4 md:mt-8 px-4 md:px-0">
//         {editMode ? (
//           <div className="flex gap-3">
//             {/* <button
//               onClick={() => setEditMode(false)}
//               disabled={loading}
//               className="flex-1 py-2 md:py-3 bg-red-500 text-white text-xs md:text-md rounded-xs md:rounded-sm font-semibold"
//             >
//               {loading ? "Saving..." : "Save Changes"}
//             </button> */}
//             <button
//               onClick={() => {
//                 if (user) {
//                   dispatch(updateUserProfile(user))
//                     .unwrap()
//                     .then(() => {
//                       alert("Profile updated successfully!");
//                       setEditMode(false);
//                     })
//                     .catch((err) => {
//                       console.error("Update failed:", err);
//                       alert("Failed to update profile");
//                     });
//                 }
//               }}
//               disabled={loading}
//               className="flex-1 py-2 md:py-3 bg-red-500 text-white text-xs md:text-md rounded-xs md:rounded-sm font-semibold"
//             >
//               {loading ? "Saving..." : "Save Changes"}
//             </button>

//             <button
//               onClick={handleCancel}
//               className="flex-1 py-2 md:py-3 border text-xs md:text-md rounded-xs md:rounded-sm text-black font-semibold"
//             >
//               Cancel
//             </button>
//           </div>
//         ) : (
//           <button
//             onClick={() => setEditMode(true)}
//             className="w-full py-2 md:py-3 bg-red-500 text-white text-xs md:text-md rounded-xs md:rounded-sm font-semibold flex items-center justify-center gap-2"
//           >
//             <Edit className="h-3 md:h-4 w-3 md:w-4" /> Edit Profile
//           </button>
//         )}
//       </div>
//     </main>
//   );
// }

// // Field Component
// const Field = ({
//   icon,
//   label,
//   name,
//   value,
//   editable,
//   onChange,
//   full,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   name: string;
//   value: string;
//   editable: boolean;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   full?: boolean;
// }) => (
//   <div className={`flex flex-col ${full ? "md:col-span-2" : ""}`}>
//     <span className="text-gray-700 text-[10px] md:text-xs font-semibold flex items-center gap-2 md:gap-1">
//       {icon}
//       {label}
//     </span>
//     {editable ? (
//       <input
//         type="text"
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="border rounded-xs md:rounded px-3 py-2 my-2 text-xs md:text-sm bg-gray-100 capitalize"
//       />
//     ) : (
//       <span className="text-gray-700 text-xs md:text-sm bg-gray-100 rounded px-3 py-2 my-2 capitalize">
//         {value}
//       </span>
//     )}
//   </div>
// );
