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
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import { updateField, type UserProfile, setUser } from "../../store/slices/profileSlice";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.profile);

  const [editMode, setEditMode] = useState(false);

  if (!user) {
    return (
      <main className="flex-1 p-4">
        <p className="text-gray-500">No profile data available.</p>
      </main>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateField({ field: e.target.name as keyof UserProfile, value: e.target.value }));
  };

  const handleCancel = () => {
    // Reset to initial user (in real app you’d fetch from API again)
    dispatch(setUser(user));
    setEditMode(false);
  };

  return (
    <main className="flex-1 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {editMode ? (
          <div className="flex gap-3">
            <button
              onClick={() => setEditMode(false)} // for now just close edit
              disabled={loading}
              className="px-4 py-1 bg-black text-white rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-1 border rounded text-black"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-1 bg-black text-white rounded flex items-center gap-2"
          >
            <Edit className="h-4 w-4" /> Edit
          </button>
        )}
      </div>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          icon={<User size={16} />}
          label="Full Name"
          name="fullName"
          value={user.fullName}
          editable={editMode}
          onChange={handleChange}
        />
        <Field
          icon={<CgProfile size={16} />}
          label="User Type"
          name="userType"
          value={user.userType}
          editable={false}
          onChange={handleChange}
        />
        <Field
          icon={<Phone size={16} />}
          label="Phone Number"
          name="mobileNumber"
          value={user.mobileNumber}
          editable={false}
          onChange={handleChange}
        />
        <Field
          icon={<Mail size={16} />}
          label="Email"
          name="email"
          value={user.email}
          editable={editMode}
          onChange={handleChange}
        />
        <Field
          icon={<MapPinHouse size={16} />}
          label="Address"
          name="address"
          value={user.address}
          editable={editMode}
          onChange={handleChange}
          full
        />
        <Field
          icon={<MapPin size={16} />}
          label="Landmark"
          name="landmark"
          value={user.landmark}
          editable={editMode}
          onChange={handleChange}
          full
        />
        <Field
          icon={<Building size={16} />}
          label="City"
          name="city"
          value={user.city}
          editable={editMode}
          onChange={handleChange}
        />
        <Field
          icon={<PinIcon size={16} />}
          label="Pin Code"
          name="pin"
          value={user.pin}
          editable={editMode}
          onChange={handleChange}
        />
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
  <div className={`flex flex-col ${full ? "col-span-2" : ""}`}>
    <span className="text-gray-700 text-xs font-[600] flex gap-1">
      {icon}
      {label}
    </span>
    {editable ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded px-3 py-2 my-2 text-sm bg-gray-100 capitalize"
      />
    ) : (
      <span className="text-gray-700 text-sm bg-gray-100 rounded px-3 py-2 my-2 capitalize">
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
  // import { useState, useEffect } from "react";
  // import { CgProfile } from "react-icons/cg";
  // import { useAuth } from "../../context/AuthContext";

  // export default function Profile() {
  //   const { user, setUser } = useAuth();
  //   const [editMode, setEditMode] = useState(false);
  //   const [loading] = useState(false);
  //   const [error] = useState<string | null>(null);

  //   useEffect(() => {
  //     if (user) setUser(user);
  //   }, [user, setUser]);

  //   if (!user) {
  //     return (
  //       <main className="flex-1 p-4">
  //         <p className="text-gray-500">No profile data available.</p>
  //       </main>
  //     );
  //   }

  //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (!user) return;
  //     setUser({ ...user, [e.target.name]: e.target.value });
  //   };

  //   const handleCancel = () => {
  //     setUser(user);
  //     setEditMode(false);
  //   };

  //   return (
  //     <main className="flex-1 p-4">
  //       <div className="flex justify-between items-center mb-6">
  //         <h1 className="text-2xl font-semibold">My Profile</h1>
  //         {error && <p className="text-red-500 text-sm">{error}</p>}
  //         {editMode ? (
  //           <div className="flex gap-3">
  //             <button
  //               onClick={() => {/* handled via form submission below */}}
  //               disabled={loading}
  //               className="px-4 py-1 bg-black text-white rounded"
  //             >
  //               {loading ? "Saving..." : "Save"}
  //             </button>
  //             <button
  //               onClick={handleCancel}
  //               className="px-4 py-1 border rounded text-black"
  //             >
  //               Cancel
  //             </button>
  //           </div>
  //         ) : (
  //           <button
  //             onClick={() => setEditMode(true)}
  //             className="px-4 py-1 bg-black text-white rounded flex items-center gap-2"
  //           >
  //             <Edit className="h-4 w-4" /> Edit
  //           </button>
  //         )}
  //       </div>

  //       {/* Profile Fields */}
  //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //         <Field
  //           icon={<User size={16} />}
  //           label="Full Name"
  //           name="fullName"
  //           value={user?.fullName || ""}
  //           editable={editMode}
  //           onChange={handleChange}
  //         />
  //         <Field
  //           icon={<CgProfile size={16} />}
  //           label="User Type"
  //           name="userType"
  //           value={user?.userType || ""}
  //           editable={false}
  //           onChange={handleChange}
  //         />
  //         <Field
  //           icon={<Phone size={16} />}
  //           label="Phone Number"
  //           name="mobileNumber"
  //           value={user?.mobileNumber || ""}
  //           editable={false}
  //           onChange={handleChange}
  //         />
  //         <Field
  //           icon={<Mail size={16} />}
  //           label="Email"
  //           name="email"
  //           value={user?.email || ""}
  //           editable={editMode}
  //           onChange={handleChange}
  //         />
  //         <Field
  //           icon={<MapPinHouse size={16} />}
  //           label="Address"
  //           name="address"
  //           value={user?.address || ""}
  //           editable={editMode}
  //           onChange={handleChange}
  //           full
  //         />
  //         <Field
  //           icon={<MapPin size={16} />}
  //           label="Landmark"
  //           name="landmark"
  //           value={user?.landmark || ""}
  //           editable={editMode}
  //           onChange={handleChange}
  //           full
  //         />
  //         <Field
  //           icon={<Building size={16} />}
  //           label="City"
  //           name="city"
  //           value={user?.city || ""}
  //           editable={editMode}
  //           onChange={handleChange}
  //         />
  //         <Field
  //           icon={<PinIcon size={16} />}
  //           label="Pin Code"
  //           name="pin"
  //           value={user?.pin || ""}
  //           editable={editMode}
  //           onChange={handleChange}
  //         />
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
  //   <div className={`flex flex-col ${full ? "col-span-2" : ""}`}>
  //     <span className="text-gray-700 text-xs font-[600] flex gap-1">
  //       {icon}
  //       {label}
  //     </span>
  //     {editable ? (
  //       <input
  //         type="text"
  //         name={name}
  //         value={value}
  //         onChange={onChange}
  //         className="border rounded px-3 py-2 my-2 text-sm bg-gray-100 capitalize"
  //       />
  //     ) : (
  //       <span className="text-gray-700 text-sm bg-gray-100 rounded px-3 py-2 my-2 capitalize">
  //         {value}
  //       </span>
  //     )}
  //   </div>
  // );
