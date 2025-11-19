import { useEffect, useState } from "react";
import SellHeroForm from "./SellHeroForm";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import { resetUploadState, uploadCar } from "../../store/slices/carUploadSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuth,
  updateUserType,
} from "../../store/slices/authSlices/authSlice";
import { openLogin } from "../../store/slices/authSlices/loginModelSlice";
import toast from "react-hot-toast";
import { cityData } from "../../data/cityData";
import imageCompression from "browser-image-compression";

interface DropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

export function Dropdown({
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
      <label className="text-xs md:text-xs">{label}</label>
      <input
        type="text"
        value={search || value}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange("");
        }}
        placeholder={placeholder}
        className="w-full rounded mt-1 px-4 py-1.5 md:py-2 text-xs md:text-xs border border-gray-200 placeholder:text-xs focus:ring-1 focus:ring-gray-800/50 outline-none"
      />

      {open && (
        <ul className="absolute w-full border border-gray-200 rounded mt-1 max-h-40 overflow-y-auto text-xs bg-white z-10">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setSearch("");
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
  const dispatch = useAppDispatch();
  const loginDispatch = useDispatch();
  const { user, token } = useSelector(selectAuth);
  // console.log("userType :", user?.userType);
  const navigate = useNavigate();

  const handleAccess = () => {
    if (!user || !token) {
      loginDispatch(openLogin());
      return;
    }
    console.log("User logged in, allow car upload");
  };

  const location = useLocation();
  const { loading, success } = useAppSelector((state) => state.carUpload);
  const uploadedImages = useAppSelector((state) => state.carImage.files);

  const [showForm, setShowForm] = useState(false);
  const [userRole] = useState<"owner" | "dealer">("owner");
  const [state] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [editCar, setEditCar] = useState<any>(null);

  useEffect(() => {
    if (location.state?.editCar) {
      const car = location.state.editCar;
      setEditCar(car);
      // setState(car?.address?.state || "");
      setCity(car?.address?.city || "");
      // setLocality(car?.address?.locality || "");
      setShowForm(true);
    }
  }, [location]);

  // This function receives carData with images array directly from SellHeroForm and dispatches upload
  // const handleFinalSubmit = async (carData: any) => {
  //   if (!uploadedImages.length) {
  //     toast.error("Please upload at least one image");
  //     return;
  //   }

  //   const formData = new FormData();

  //   formData.append("userId", user?.id || "");
  //   formData.append("isSale", "Sell");
  //   formData.append("isSold", "false");

  //   Object.entries({
  //     carId: editCar?.id || "",
  //     carName:
  //       carData.brand && carData.model
  //         ? `${carData.brand} ${carData.model}`
  //         : editCar?.carName || "",
  //     brand: carData.brand || editCar?.brand || "",
  //     model: carData.model || editCar?.model || "",
  //     variant: carData.variant || editCar?.variant || "",
  //     fuelType: carData.fuelType || editCar?.fuelType || "",
  //     transmission: carData.transmission || editCar?.transmission || "",
  //     bodyType: carData.bodyType || editCar?.bodyType || "",
  //     ownership: carData.ownership || editCar?.ownership || "",
  //     manufacturingYear:
  //       carData.manufactureYear || editCar?.manufacturingYear || "",
  //     registrationYear:
  //       carData.registrationYear || editCar?.registrationYear || "",
  //     carPrice: String(carData.price || editCar?.price || "").replace(/,/g, ""),
  //     kmDriven: String(carData.kmDriven || editCar?.kmDriven || ""),
  //     seats: String(carData.seats || editCar?.seats || ""),
  //     addressCity: city || editCar?.address?.city || "",
  //     addressState: state || editCar?.address?.state || "c",
  //     addressLocality: locality || editCar?.address?.locality || "c",
  //   }).forEach(([key, value]) => formData.append(key, value || ""));

  //   uploadedImages.forEach((file) => {
  //     console.log("Uploading file:", file.name);
  //     formData.append("carImages", file);
  //   });

  //   toast(`Files Uploading...`);
  //   dispatch(uploadCar(formData));
  // };


const handleFinalSubmit = async (carData: any) => {
  if (!uploadedImages.length) {
    toast.error("Please upload at least one image");
    return;
  }

  // 🧠 Compression options
  const compressionOptions = {
    maxSizeMB: 1, // under 1MB
    maxWidthOrHeight: 1080, // resize to 1080p max
    useWebWorker: true,
  };

  const formData = new FormData();

  formData.append("userId", user?.id || "");
  formData.append("isSale", "Sell");
  formData.append("isSold", "false");

  Object.entries({
    carId: editCar?.id || "",
    carName:
      carData.brand && carData.model
        ? `${carData.brand} ${carData.model}`
        : editCar?.carName || "",
    brand: carData.brand || editCar?.brand || "",
    model: carData.model || editCar?.model || "",
    variant: carData.variant || editCar?.variant || "",
    fuelType: carData.fuelType || editCar?.fuelType || "",
    transmission: carData.transmission || editCar?.transmission || "",
    bodyType: carData.bodyType || editCar?.bodyType || "",
    ownership: carData.ownership || editCar?.ownership || "",
    manufacturingYear:
      carData.manufactureYear || editCar?.manufacturingYear || "",
    registrationYear:
      carData.registrationYear || editCar?.registrationYear || "",
    carPrice: String(carData.price || editCar?.price || "").replace(/,/g, ""),
    kmDriven: String(carData.kmDriven || editCar?.kmDriven || ""),
    seats: String(carData.seats || editCar?.seats || ""),
    addressCity: city || editCar?.address?.city || "",
    addressState: state || editCar?.address?.state || "c",
    addressLocality: locality || editCar?.address?.locality || "c",
    isActive: true,
  }).forEach(([key, value]) => formData.append(key, value || ""));

  try {
    toast("Compressing images... ⏳");

    // 🧩 Compress each image one by one
    for (const file of uploadedImages) {
      console.log("Original:", file.name, file.size / 1024, "KB");
      const compressedFile = await imageCompression(file, compressionOptions);
      console.log("Compressed:", compressedFile.name, compressedFile.size / 1024, "KB");

      // Append compressed image
      formData.append("carImages", compressedFile);
    }

    toast.success("Images compressed successfully! 🚗");

    // Now send to backend
    toast("Uploading car data...");
    dispatch(uploadCar(formData));
  } catch (err) {
    console.error("Image compression failed:", err);
    toast.error("Image compression failed. Try again with smaller files.");
  }
};


  useEffect(() => {
    if (success) {
      dispatch(resetUploadState());
      navigate("/");
    }
  }, [success, dispatch, navigate]);

  return (
    <section className="relative w-full max-w-7xl mx-auto h-fit lg:h-screen sm:bg-black/50 mb-10 sm:mb-0 mt-12 lg:mt-0 lg:pt-10 ">
      {/* Background Image */}
      <div
        className="h-[326px] sm:h-[326px] lg:h-[88vh] absolute inset-0 bg-no-repeat bg-cover mb-1 lg:mt-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/sell-my-car-hero-bg1.jpg')",
          backgroundPosition: "center calc(100% - 75%)",
        }}
      />

      {/* Overlay Content */}
      <div className="relative max-w-7xl h-full  mx-auto px-4 lg:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-9 items-center md:gap-10 backdrop-blur-[3px] z-45">
        {/* Left Content */}
        <div className="h-full w-full text-white lg:col-span-6 mt-0 sm:mt-14 lg:mt-28 md:px-2 pr-8 lg:pr-0 py-8 lg:py-0 z-1">
          <p className="hidden lg:block text-sm mb-14">
            Home <span className="text-gray-300"> &gt; </span>{" "}
            <span className="font-medium underline underline-offset-3">
              Sell my Car
            </span>
          </p>
          <h1 className="max-w-full w-full lg:max-w-[80%] text-md lg:text-3xl font-semibold lg:font-bold mb-3 lg:mb-5 leading-tight">
            Sell your car faster, easier and hassle-free with DhikCar.com
          </h1>
          <p className="font-light lg:font-semibold text-xs lg:text-base text-gray-200 lg:mb-7">
            India's trusted platform for quick and profitable car sales. List
            today and watch buyers come to you!
          </p>

          <ul className="hidden sm:block space-y-4 lg:space-y-8 text-sm lg:text-xl sm:mt-8 lg:mt-0">
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
              <span>Get Personalis assistance on selling faster</span>
            </li>
          </ul>
        </div>

        <div className="sm:w-78 bg-white rounded-lg shadow-md lg:shadow-lg border border-gray-200 p-4 lg:p-6 sm:mt-6 sm:my-2 lg:col-span-3">
          {showForm && (
            <SellHeroForm
              onBack={() => setShowForm(false)}
              onSubmit={handleFinalSubmit}
              defaultValues={editCar}
              uploadedImages={uploadedImages}
            />
          )}

          {!showForm && !editCar && (
            <div>
              <h2 className="text-sm lg:text-sm mb-2 lg:mb-3">
                New to <span className="font-semibold">Dhikcar</span>? Let's get
                you started
              </h2>

              {/* User Type conditional*/}
              {user?.userType === "EndUser" && (
                <div className="mb-3">
                  <label htmlFor="userType" className="text-xs md:text-xs">
                    User Type
                  </label>
                  <div className="grid grid-cols-3 gap-3 md:gap-5 mb-2 md:mb-4 text-xs md:text-xs mt-1">
                    <button
                      onClick={() =>
                        dispatch(
                          updateUserType({ userId: user.id, userType: "Owner" })
                        )
                      }
                      className={`flex-1 py-1.5 rounded ${
                        userRole === "owner"
                          ? "bg-green-50 text-green-700 font-medium"
                          : "bg-white border border-gray-300 text-gray-600"
                      }`}
                    >
                      Owner
                    </button>

                    <button
                      onClick={() =>
                        dispatch(
                          updateUserType({
                            userId: user.id,
                            userType: "Dealer",
                          })
                        )
                      }
                      className={`flex-1 py-1.5 rounded ${
                        userRole === "dealer"
                          ? "bg-green-50 text-green-700 font-medium"
                          : "bg-white border border-gray-300 text-gray-600"
                      }`}
                    >
                      Dealer
                    </button>
                  </div>
                </div>
              )}

              {/* Location Fields */}
              <div className="space-y-0">
                <Dropdown
                  label="City"
                  placeholder="Select City"
                  options={cityData}
                  value={city}
                  onChange={(val) => {
                    setCity(val);
                    setLocality("");
                  }}
                />
              </div>

              <button
                disabled={loading}
                onClick={() => {
                  if (!city) {
                    toast.error("Please select a city!");
                    return;
                  }
                  if (user?.userType === "EndUser") {
                    toast.error("Please select a your User Type!");
                    return;
                  }
                  if (user) {
                    setShowForm(true);
                  } else {
                    handleAccess();
                  }
                }}
                className={`w-full mt-4 py-2 rounded bg-[#24272C] text-white ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-black"
                }`}
              >
                {loading ? "Uploading..." : "Next"}
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="absolute top-[35%] left-[45.5%] translate-1/2 z-50 bg-red-600 rounded-full">
          <svg
            className="animate-spin h-16 w-16 text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-100 text-white"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}
    </section>
  );
}
