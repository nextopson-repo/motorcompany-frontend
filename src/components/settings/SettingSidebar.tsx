import { CameraIcon } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
  const location = useLocation(); // get current route
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    { name: "Profile", path: "/settings/profile" },
    { name: "My Listing", path: "/settings/listings" },
    { name: "Add Car", path: "/sell" },
    { name: "My Enqueries", path: "/settings/enquiries" },
    { name: "Saved", path: "/settings/saved" },
    { name: "Buy Packages", path: "/settings/buy-packages" },
    { name: "Bought Packages & Billing", path: "/settings/bought-packages" },
  ];

  return (
    <aside className="w-64 bg-white rounded-sm shadow py-6 flex flex-col items-center z-5">
      <div className="pb-4 px-6 w-full flex flex-col items-center relative">
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

        {/* Dashed line */}
        <div className="flex justify-center w-full mt-2">
          <div className="border-b border-dashed border-gray-800 w-full"></div>
        </div>
      </div>

      <ul className="mt-6 flex flex-col items-center w-full space-y-[2px]">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <li key={link.path} className="relative group w-full">
              <NavLink
                to={link.path}
                className={`relative block px-6 py-2 cursor-pointer text-sm transition ${
                  isActive
                    ? "bg-[#0099FF]/10 text-[#0099FF] font-semibold"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                {link.name}
              </NavLink>
              {/* Active Right Side Line */}
              {isActive && (
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-9 bg-[#0099FF] rounded-full"></div>
              )}
            </li>
          );
        })}
        <button onClick={handleLogout}
        className="w-[80%] py-2 mt-2 cursor-pointer text-sm transition text-red-500 border border-red-400 rounded-sm hover:bg-gray-200 ">Logout</button>
      </ul>
    </aside>
  );
}