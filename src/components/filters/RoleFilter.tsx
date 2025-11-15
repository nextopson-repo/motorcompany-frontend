import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { type SelectedFilters } from "../../store/slices/carSlice";

interface RoleFilterProps {
  userType: "EndUser" | "Dealer" | "Owner";
  onSelectedFiltersChange: (filters: SelectedFilters) => void;
  selectedFilters: SelectedFilters;
  buttonRef: any;
}

const RoleFilter = ({ userType,  selectedFilters, onSelectedFiltersChange, buttonRef }: RoleFilterProps) => {
  const [openFilter, setOpenFilter] = useState(false);
  // const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (openFilter && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [openFilter]);

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
      <button
        ref={buttonRef}
        className="px-3 py-2 bg-black text-white border rounded-sm text-xs flex items-center gap-2"
        onClick={() => setOpenFilter((prev) => !prev)}
      >
        {userType === "EndUser"
          ? "All Cars"
          : userType === "Dealer"
          ? "Dealer Cars"
          : "Owner Cars"}
        <ChevronDown className="h-4 w-4" />
      </button>

      {openFilter && (
        <div
          ref={dropdownRef}
          className="fixed z-50 bg-white shadow rounded w-32 border border-gray-200"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          {[
            { label: "All Cars", value: "EndUser" },
            { label: "Dealer Cars", value: "Dealer" },
            { label: "Owner Cars", value: "Owner" },
          ].map((opt) => (
            <button
              key={opt.value}
              className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${
                userType === opt.value ? "bg-gray-100 font-semibold" : ""
              }`}
              onClick={() => {
                onSelectedFiltersChange({
                  ...selectedFilters,
                  userType: opt.value as "EndUser" | "Dealer" | "Owner",
                })
                setOpenFilter(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleFilter;
