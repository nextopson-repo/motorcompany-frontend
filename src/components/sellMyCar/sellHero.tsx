import { useEffect, useState } from "react";
import SellHeroForm from "./SellHeroForm";
import { useNavigate, useLocation } from "react-router-dom";

interface DropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

function Dropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
}: DropdownProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-1 relative">
      <label className="text-xs">{label}</label>
      <input
        type="text"
        value={search || value}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange(""); 
        }}
        placeholder={placeholder}
        className="w-full rounded mt-1 px-4 py-[6px] md:py-2 text-[10px] md:text-xs border border-gray-200 placeholder:text-[10px] focus:ring-1 focus:ring-gray-800/50 outline-none"
      />

      {/* Dropdown list (always open if focus) */}
      {open && (
        <ul className="absolute w-full border border-gray-200 rounded mt-1 max-h-40 overflow-y-auto text-xs bg-white z-10">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setSearch(""); // reset search after select
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  value === opt ? "bg-gray-200 font-medium" : ""
                }`}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-400">No results</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default function SellHero() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const location = useLocation();

  const [showForm, setShowForm] = useState(false);
  const [userType, setUserType] = useState<"owner" | "dealer">("owner");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [user, setUser] = useState<any>();
  const [editCar, setEditCar] = useState<any>(null);

  const locationData: Record<string, Record<string, string[]>> = {
    "Madhya Pradesh": {
      Indore: ["Vijay Nagar", "Rajwada", "Palasia"],
      Bhopal: ["Arera Colony", "Kolar Road"],
    },
    Rajasthan: {
      Jaipur: ["Malviya Nagar", "Vaishali Nagar"],
    },
    UttarPradesh: {
      Kanpur: ["Swaroop Nagar", "Kakadeo"],
      Lucknow: ["Hazratganj", "Gomti Nagar"],
    },
    Maharashtra: {
      Pune: ["Kothrud", "Hinjewadi"],
    },
    Gujarat: {
      Ahmedabad: ["Navrangpura", "Maninagar"],
    },
    Punjab: {
      Chandigarh: ["Sector 17", "Manimajra"],
    },
    Telangana: {
      Hyderabad: ["Banjara Hills", "Hitech City"],
    },
    Delhi: {
      "New Delhi": ["Connaught Place", "Saket"],
    },
  };

  useEffect(() => {
    // ✅ load logged-in user from localStorage
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // ✅ if navigated with editCar data
    if (location.state?.editCar) {
      const car = location.state.editCar;
      setEditCar(car);
      setState(car?.address?.state || "");
      setCity(car?.address?.city || "");
      setLocality(car?.address?.locality || "");
      setShowForm(true); // directly open form
    }
  }, [location]);

  const handleFinalSubmit = async (carData: any) => {
    const payload = {
      carId: editCar?.id || null, // ✅ Pass carId if editing
      userId: user?.id,
      carName: `${carData.brand || editCar?.brand} ${
        carData.model || editCar?.model
      } ${carData.variant || editCar?.variant}`,
      brand: carData.brand || editCar?.brand,
      model: carData.model || editCar?.model,
      variant: carData.variant || editCar?.variant,
      fuelType: carData.fuelType || editCar?.fuelType,
      transmission: carData.transmission || editCar?.transmission,
      bodyType: carData.bodyType || editCar?.bodyType,
      ownership: carData.ownership || editCar?.ownership,
      manufacturingYear: carData.manufactureYear || editCar?.manufacturingYear,
      registrationYear: carData.registrationYear || editCar?.registrationYear,
      isSale: "Sell",
      carPrice: Number(
        String(carData.price || editCar?.price).replace(/,/g, "")
      ),
      kmDriven: Number(carData.kmDriven || editCar?.kmDriven),
      seats: Number(carData.seats || editCar?.seats),
      isSold: false,
      addressCity: city || editCar?.address?.city || "",
      addressState: state || editCar?.address?.state || "",
      addressLocality: locality || editCar?.address?.locality || "",
      carImages: carData.images?.length
        ? carData.images
        : editCar?.carImages || [], // ✅ use new images if uploaded
    };

    console.log("🚀 Final Payload:", payload);

    try {
      await fetch(`${BACKEND_URL}/api/v1/car/create-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      navigate("/"); // ✅ redirect after save
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <section className="relative w-full max-w-8xl mx-auto h-[235px] lg:h-[88vh] bg-black mb-[300px] lg:mb-0 mt-12 md:mt-10">
      {/* Background Image */}
      <div
        className="h-[35vh] md:h-auto absolute inset-0 bg-cover bg-no-repeat opacity-60 mb-1"
        style={{
          backgroundImage: "url('/sell-my-car-hero-bg.jpg')",
          backgroundPosition: "center calc(100% - 75%)",
        }}
      />

      {/* Overlay Content */}
      <div className="relative max-w-7xl h-auto lg:h-[93vh] mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-9 items-center md:gap-10 backdrop-blur-[3px]">
        {/* Left Content */}
        <div className="h-full w-full text-white col-span-6 mt-0 lg:mt-28 md:px-2 pr-8 md:pr-0 py-8 md:py-0">
          <p className="hidden md:block text-sm mb-14">
            Home <span className="text-gray-300"> &gt; </span>{" "}
            <span className="font-medium underline underline-offset-3">Sell my Car</span>
          </p>
          <h1 className="max-w-full w-full md:max-w-[80%] text-md md:text-3xl font-bold mb-3 md:mb-5 leading-tight">
            Sell your car faster, easier and hassle-free with DhikCar.com
          </h1>
          <p className="text-[10px] md:text-base text-gray-200 md:mb-7">
            India’s trusted platform for quick and profitable car sales. List
            today and watch buyers come to you!
          </p>

          <ul className="hidden md:block space-y-8 text-xl">
            <li className="flex items-center gap-4">
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#EE1422]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M18.7902 1.28906L8.70977 14.5793L3.4375 10.3125L0.6875 13.0625L9.16523 20.5391L22 4.03906L18.7902 1.28906Z"
                    fill="#ED1D2B"
                  />
                </svg>
              </span>
              <span>Post car for Free</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#EE1422]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M18.7902 1.28906L8.70977 14.5793L3.4375 10.3125L0.6875 13.0625L9.16523 20.5391L22 4.03906L18.7902 1.28906Z"
                    fill="#ED1D2B"
                  />
                </svg>
              </span>
              <span>Get Verified Buyers</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#EE1422]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M18.7902 1.28906L8.70977 14.5793L3.4375 10.3125L0.6875 13.0625L9.16523 20.5391L22 4.03906L18.7902 1.28906Z"
                    fill="#ED1D2B"
                  />
                </svg>
              </span>
              <span>Get personalised assistance on selling faster</span>
            </li>
          </ul>
        </div>

        {/* Right Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 md:m-4 col-span-3">
          {showForm && (
            <SellHeroForm
              onBack={() => setShowForm(false)}
              onSubmit={handleFinalSubmit}
              defaultValues={editCar} 
            />
          )}

          {!showForm && !editCar && (
            <div>
              <h2 className="text-sm mb-2 md:mb-3">
                New to <span className="font-semibold">Dhikcar</span>? Let's get
                you started
              </h2>

              {/* User Type */}
              <label htmlFor="userType" className="text-xs">
                User Type
              </label>
              <div className="grid grid-cols-3 gap-3 md:gap-5 mb-2 md:mb-4 text-[10px] md:text-xs mt-1">
                <button
                  onClick={() => setUserType("owner")}
                  className={`flex-1 py-[6px] rounded ${
                    userType === "owner"
                      ? "bg-green-50 text-green-700 font-medium"
                      : "bg-white border border-gray-300 text-gray-600"
                  }`}
                >
                  Owner
                </button>
                <button
                  onClick={() => setUserType("dealer")}
                  className={`flex-1 py-[6px] rounded ${
                    userType === "dealer"
                      ? "bg-green-50 text-green-700 font-medium"
                      : "bg-white border border-gray-300 text-gray-600"
                  }`}
                >
                  Dealer
                </button>
              </div>

              {/* Location Fields */}
              <div className="space-y-0">
                <Dropdown
                  label="State"
                  placeholder="Select State"
                  options={Object.keys(locationData)}
                  value={state}
                  onChange={(val) => {
                    setState(val);
                    setCity("");
                    setLocality("");
                  }}
                />

                <Dropdown
                  label="City"
                  placeholder="Select City"
                  options={state ? Object.keys(locationData[state] || {}) : []}
                  value={city}
                  onChange={(val) => {
                    setCity(val);
                    setLocality("");
                  }}
                />

                <Dropdown
                  label="Locality"
                  placeholder="Select you neighbourhood"
                  options={
                    state && city ? locationData[state]?.[city] || [] : []
                  }
                  value={locality}
                  onChange={(val) => setLocality(val)}
                />
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="w-full text-xs md:text-base mt-4 bg-[#24272C] text-white py-[6px] md:py-2 rounded-xs hover:bg-black transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
