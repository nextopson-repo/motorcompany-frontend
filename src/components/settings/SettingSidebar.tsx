import { CameraIcon, X } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

interface SettingSidebarProps {
  name: string;
  role: string;
  imageUrl: string;
  onUploadImage: () => void;
}

export default function SettingSidebar({
  name,
  role,
  imageUrl,
  onUploadImage,
}: SettingSidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    navigate("/");
    setShowDialog(false);
  };

  const links = [
    { name: "Profile", path: "/settings/profile" },
    { name: "My Listing", path: "/settings/listings" },
    { name: "Add Car", path: "/sell" },
    { name: "My Enqueries", path: "/settings/enquiries" },
    { name: "Interested Buyers List", path: "/settings/interested-buyers" },
    { name: "Saved", path: "/settings/saved" },
    { name: "Buy Packages", path: "/settings/buy-packages" },
    { name: "Bought Packages & Billing", path: "/settings/bought-packages" },
  ];

  return (
    <>
      <aside className="hidden w-60 h-fit bg-white rounded-sm shadow py-4 mb-4 md:flex flex-col items-center z-5">
        <div className="pb-4 px-4 w-full flex flex-col items-center relative">
          <div className="relative">
            <img
              src={imageUrl}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <button
              onClick={onUploadImage}
              className="absolute bottom-0 right-0 bg-[#cb202d] p-1 rounded-full"
            >
              <CameraIcon className="w-4 h-4 text-white" />
            </button>
          </div>

          <h2 className="mt-3 font-semibold capitalize">{name}</h2>
          <p className="text-gray-500 text-sm">{role}</p>

          <div className="flex justify-center w-full mt-2">
            <div className="border-b border-dashed border-gray-800 w-full custom-dash"></div>
          </div>
        </div>

        <ul className="mt-6 flex flex-col items-center w-full space-y-[2px]">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.path} className="relative group w-full">
                <NavLink
                  to={link.path}
                  className={`relative block px-6 py-2 cursor-pointer text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#0099FF]/10 text-[#0099FF] font-semibold"
                      : "hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {link.name}
                </NavLink>
                {isActive && (
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-9 bg-[#0099FF] rounded-full"></div>
                )}
              </li>
            );
          })}

          <button
            onClick={() => setShowDialog(true)}
            className="w-[80%] py-2 mt-2 cursor-pointer text-sm transition text-red-500 border border-red-400 rounded-sm hover:bg-gray-200"
          >
            Logout
          </button>
        </ul>
      </aside>

      {/* Logout Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-4 right-4 text-gray-800 hover:text-red-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Illustration (optional) */}
            <div className="flex justify-center mb-4">
              <img
                src="/logout.png"
                alt="logout illustration"
                className="w-32 h-24"
              />
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-center tracking-tight mb-3">
              Are you sure you want to log out?
            </h2>

            {/* Description */}
            <p className="text-[10px] font-semibold text-black text-center leading-tight">
              You can log back in anytime using your credentials. If you’re
              trying to access a different account, there’s no need to log out.
              Simply{" "}
              <span className="text-green-600 underline cursor-pointer">
                add another account
              </span>{" "}
              and switch between profiles without leaving your current session.
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <button
                onClick={() => setShowDialog(false)}
                className="px-14 py-2 text-md border rounded-sm cursor-pointer hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-14 py-2 text-md bg-black text-white rounded-sm cursor-pointer hover:bg-gray-800"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}