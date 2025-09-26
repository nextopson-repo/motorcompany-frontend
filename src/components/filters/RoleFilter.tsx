import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOwnership } from "../../store/slices/filterSlice";
import { ChevronDown } from "lucide-react";

const RoleFilter = ({ userType }: { userType: string }) => {
  const [openFilter, setOpenFilter] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dispatch = useDispatch();

  // Recalculate dropdown position
  useEffect(() => {
    if (openFilter && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [openFilter]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpenFilter(false);
      }
    }
    if (openFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openFilter]);

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        className="px-3 py-1 bg-black text-white border rounded-sm text-xs flex items-center gap-2"
        onClick={() => setOpenFilter((prev) => !prev)}
      >
        {userType} <ChevronDown className="h-3 w-3" />
      </button>

      {/* Dropdown */}
      {openFilter && (
        <div
          ref={dropdownRef}
          className="fixed z-50 bg-white shadow rounded w-32 border border-gray-200"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          {["All Cars", "Dealer Cars", "Owner Cars"].map((opt) => (
            <button
              key={opt}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              onClick={() => {
                dispatch(setOwnership(opt as "All" | "Dealer" | "Owner"));
                setOpenFilter(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleFilter;
