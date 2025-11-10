import { MapPin, X } from "lucide-react";
import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { setLocation } from "../store/slices/locationSlice";
import { updateSelectedFilter } from "../store/slices/carSlice";
// import { useNavigate } from "react-router-dom";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationChange?: (loc: string) => void;
  citySearch: string;
  setCitySearch: (val: string) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onLocationChange,
  citySearch,
  setCitySearch,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  // const Navigate = useNavigate();

  const locationOptions = useSelector(
    (state: RootState) => state.location.locations
  );

  // Search filter
  const filteredLocations = useMemo(() => {
    if (!citySearch.trim()) return locationOptions;
    const q = citySearch.toLowerCase();
    return locationOptions.filter((l) => l.toLowerCase().includes(q));
  }, [locationOptions, citySearch]);

  // City images
  const cityImage = (loc: string) => {
    const cityName = loc.split(",")[0].trim().toLowerCase();
    const map: Record<string, string> = {
      delhi: "/Cities/dehli-img.png",
      chandigarh: "/Cities/chandigarh-img.png",
      kanpur: "/Cities/kanpur-img.png",
      pune: "/Cities/pune-img.png",
      ahmedabad: "/Cities/ahmedabad-img.png",
      lucknow: "/Cities/lucknow-img.png",
      hyderabad: "/Cities/hyderabad-img.png",
      jaipur: "/Cities/jaipur-img.png",
      surat: "/Cities/surat.jpg",
      mumbai: "/Cities/mumbai.webp",
    };
    return map[cityName] || "/Cities/delhi-img.png";
  };

  if (!isOpen) return null;

  const handleSelectCity = (city: string) => {
    dispatch(setLocation(city));
    dispatch(updateSelectedFilter({ key: "location", value: [city] }));
    // Navigate('/buy-car');
    if (onLocationChange) {
      onLocationChange(city);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative overflow-hidden mx-auto h-[82%] sm:h-[50%] lg:h-[82%] mt-14 w-[95%] sm:w-[75%] lg:w-[50%] max-w-5xl bg-white rounded-md md:rounded-xl shadow-xl z-0">
        {/* header */}
        <div className="flex items-center justify-between p-2 md:p-3 px-2 md:px-8 border-b border-gray-100">
          <h3 className="text-sm sm:text-lg font-semibold">Select your City</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-black/5">
            <X className="w-5 md:w-5 h-5 md:h-5" />
          </button>
        </div>

        {/* search bar */}
        <div className="flex gap-2 md:gap-5 pt-3 md:pt-4 px-2 md:px-8">
          <div className="w-full flex items-center border border-gray-300 rounded-sm md:pl-4">
            <MapPin
              className="w-[18px] h-[18px] text-gray-500 mx-2"
              strokeWidth={1.3}
            />
            <input
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder="Enter your City"
              className="w-full py-2 text-xs md:text-sm outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* cities grid */}
        <div className="w-full overflow-y-auto p-2 md:p-4 md:px-5 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 z-[10]">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((loc) => (
              <button
                key={loc}
                onClick={() => handleSelectCity(loc)}
                className="h-fit w-fit md:mx-2 hover:bg-gray-400/30 cursor-pointer p-1 rounded-xs md:rounded-md"
              >
                <img
                  src={cityImage(loc)}
                  alt={loc}
                  className="w-24 h-20 lg:w-22 lg:h-18 lg:object-cover object-cover rounded-sm md:rounded-lg mx-auto"
                />
                <div className="mt-1 md:mt-2 text-[11px] md:text-xs font-semibold text-center">
                  {loc.split(",")[0]}
                </div>
              </button>
            ))
          ) : (
            <div className="col-span-full text-center text-sm md:text-base text-gray-500 mt-4">
              Coming Soon in your City!
            </div>
          )}
        </div>

        {/* footer background image */}
        <div className="absolute inset-[65%] left-0 translate-x-[0%] w-full h-1/2 opacity-20 z-[-1]">
          <img
            src="/Cities/cities-bg.png"
            alt="cities-bg"
            className="w-full h-[80%] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
