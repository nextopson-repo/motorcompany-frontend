import React, { useState, useEffect } from "react";
import {
  Camera,
  MapPin,
  Car,
  Settings,
  Calendar,
  DollarSign,
  Upload,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Vehicle } from "../../types";

// Props type definition
interface CarDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  vehicle: Vehicle | null;
  mode: "create" | "edit" | "view";
}

interface DropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

function Dropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
}: DropdownProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      onChange("");
    }
  };

  const handleOptionSelect = (option: string) => {
    onChange(option);
    setSearch("");
    setOpen(false);
  };

  const handleBlur = () => {
    // Delay closing to allow option selection
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="mb-1 relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={search || value}
        onFocus={() => !disabled && setOpen(true)}
        onBlur={handleBlur}
        onChange={handleInputChange}
        placeholder={disabled ? "Please select " + label.toLowerCase() + " first" : placeholder}
        disabled={disabled}
        className={`w-full rounded mt-1 px-4 py-[6px] md:py-2 text-[10px] md:text-xs border placeholder:text-[10px] outline-none transition-colors ${
          disabled 
            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" 
            : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        }`}
      />

      {open && (
        <ul className="absolute w-full border border-gray-200 rounded mt-1 max-h-40 overflow-y-auto text-xs bg-white z-20 shadow-lg">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt}
                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                onClick={() => handleOptionSelect(opt)}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                  value === opt ? "bg-blue-100 font-medium text-blue-800" : ""
                }`}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-400 italic">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}

const CarDetailsForm: React.FC<CarDetailsFormProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicle,
  mode,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    addressState: "",
    addressCity: "",
    addressLocality: "",
    carName: "",
    brand: "",
    model: "",
    variant: "",
    fuelType: "Petrol",
    transmission: "Manual",
    ownership: "1st",
    bodyType: "",
    manufacturingYear: new Date().getFullYear(),
    registrationYear: new Date().getFullYear(),
    isSale: "Sell",
    carPrice: "",
    kmDriven: "",
    seats: "4",
  });

  const locationData: Record<string, Record<string, string[]>> = {
    Karnataka: {
      Bangalore: ["Whitefield", "Koramangala", "Indiranagar", "JP Nagar", "Electronic City"],
      Mysore: ["Vijayanagar", "Kuvempunagar", "Saraswathipuram"],
    },
    MadhyaPradesh: {
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
      Mumbai: ["Bandra", "Andheri", "Powai", "Thane"],
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
      NewDelhi: ["Connaught Place", "Saket"],
    },
  };

  useEffect(() => {
    if (mode === "edit" && vehicle) {
      const defaultState = Object.keys(locationData)[0] || "";
      const state = vehicle.address?.state || defaultState;

      const stateData = locationData[state];
      const defaultCity = stateData ? Object.keys(stateData)[0] || "" : "";
      const city = vehicle.address?.city || defaultCity;

      const cityData = stateData?.[city];
      const defaultLocality = cityData?.[0] || "";
      const locality = vehicle.address?.locality || defaultLocality;

      setFormData({
        addressState: state,
        addressCity: city,
        addressLocality: locality,
        carName: vehicle.carName || "",
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        variant: vehicle.variant || "",
        fuelType: vehicle.fuelType || "Petrol",
        transmission: vehicle.transmission || "Manual",
        ownership: vehicle.ownership || "1st",
        bodyType: vehicle.bodyType || "",
        manufacturingYear:
          vehicle.manufacturingYear || new Date().getFullYear(),
        registrationYear: vehicle.registrationYear || new Date().getFullYear(),
        isSale: vehicle.isSale || "Sell",
        carPrice: vehicle.carPrice || "",
        kmDriven: vehicle.kmDriven || "",
        seats: vehicle.seats || "4",
      });

      if (vehicle.carImages && vehicle.carImages.length > 0) {
        const urls = vehicle.carImages.map((img) => img.presignedUrl).filter((url): url is string => url !== undefined);
        setPreviewUrls(urls);
      }
    }
  }, [mode, vehicle]);

  // Cleanup preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "addressState") {
        const stateData = locationData[value];
        if (stateData) {
          const firstCity = Object.keys(stateData)[0] || "";
          const firstLocality = stateData[firstCity]?.[0] || "";
          updated.addressCity = firstCity;
          updated.addressLocality = firstLocality;
        } else {
          updated.addressCity = "";
          updated.addressLocality = "";
        }
      }

      if (name === "addressCity") {
        const stateData = locationData[prev.addressState];
        if (stateData && stateData[value]) {
          const firstLocality = stateData[value][0] || "";
          updated.addressLocality = firstLocality;
        } else {
          updated.addressLocality = "";
        }
      }

      return updated;
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submission

    // Form validation
    if (!formData.brand.trim()) {
      toast.error("Please select a car brand");
      return;
    }

    if (!formData.model.trim()) {
      toast.error("Please enter the car model");
      return;
    }

    if (!formData.carPrice || parseFloat(formData.carPrice) <= 0) {
      toast.error("Please enter a valid car price");
      return;
    }

    if (!formData.addressState || !formData.addressCity || !formData.addressLocality) {
      toast.error("Please select complete address details (State, City, and Locality)");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one car image");
      return;
    }

    // Check user authentication
    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.error("Please log in to list your car");
      return;
    }

    let parsedUser: { id: string } | null = null;
    try {
      parsedUser = JSON.parse(userData);
    } catch (err) {
      console.error("Failed to parse user data from localStorage", err);
      toast.error("Invalid user data. Please log in again.");
      return;
    }

    if (!parsedUser?.id) {
      toast.error("User ID missing. Please log in again.");
      return;
    }

    // Create FormData for backend
    const formDataToSend = new FormData();

    // Required fields according to backend interface
    formDataToSend.append("userId", parsedUser.id);
    formDataToSend.append("addressState", formData.addressState);
    formDataToSend.append("addressCity", formData.addressCity);
    formDataToSend.append("addressLocality", formData.addressLocality);

    // Car details
    const carTitle = `${formData.brand} ${formData.model}`.trim();
    const carName = formData.carName.trim() || carTitle;
    
    formDataToSend.append("title", carTitle);
    formDataToSend.append("carName", carName);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("model", formData.model);
    formDataToSend.append("variant", formData.variant || "");
    formDataToSend.append("fuelType", formData.fuelType);
    formDataToSend.append("transmission", formData.transmission);
    formDataToSend.append("bodyType", formData.bodyType || "");
    formDataToSend.append("ownership", formData.ownership);
    formDataToSend.append("manufacturingYear", formData.manufacturingYear.toString());
    formDataToSend.append("registrationYear", formData.registrationYear.toString());
    formDataToSend.append("kmDriven", formData.kmDriven || "0");
    formDataToSend.append("seats", formData.seats);
    formDataToSend.append("isSale", formData.isSale);
    formDataToSend.append("carPrice", formData.carPrice);

    // Add description
    const description = `Discover this ${formData.model.toLowerCase()} ${formData.brand} located at ${formData.addressLocality}, ${formData.addressCity}. This ${formData.fuelType.toLowerCase()} ${formData.transmission.toLowerCase()} transmission vehicle has been driven ${formData.kmDriven || '0'} km and is available for ${formData.isSale.toLowerCase()}.`;
    formDataToSend.append("description", description);

    // Add images - backend expects 'images' field with array of files
    images.forEach((file) => {
      formDataToSend.append("images", file);
    });

    // Debug: Log FormData contents
    console.log("FormData being sent to backend:");
    formDataToSend.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    setIsSubmitting(true);
    try {
      await onSave(formDataToSend);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 transition-opacity backdrop-blur-xs"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-2">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Car className="w-6 h-6" />
                  {mode === "edit" ? "Edit Car Details" : "List Your Car"}
                </h1>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/20 hover:bg-opacity-20 rounded-full p-2 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {/* Location Section */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Location Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Location Fields */}
                <Dropdown
                  label="State"
                  placeholder="Select State"
                  options={Object.keys(locationData)}
                  value={formData.addressState}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      addressState: val,
                      addressCity: "",
                      addressLocality: "",
                    }))
                  }
                />

                <Dropdown
                  label="City"
                  placeholder="Select City"
                  options={
                    formData.addressState && locationData[formData.addressState]
                      ? Object.keys(locationData[formData.addressState])
                      : []
                  }
                  value={formData.addressCity}
                  disabled={!formData.addressState}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      addressCity: val,
                      addressLocality: "",
                    }))
                  }
                />

                <Dropdown
                  label="Locality"
                  placeholder="Select your neighbourhood"
                  options={
                    formData.addressState && 
                    formData.addressCity && 
                    locationData[formData.addressState] &&
                    locationData[formData.addressState][formData.addressCity]
                      ? locationData[formData.addressState][formData.addressCity]
                      : []
                  }
                  value={formData.addressLocality}
                  disabled={!formData.addressState || !formData.addressCity}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, addressLocality: val }))
                  }
                />
              </div>
            </div>

            {/* Car Basic Details */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Car className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Car Details
                </h2>
              </div>

              <div className=" space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Car Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="carName"
                      required
                      value={formData.carName}
                      onChange={handleInputChange}
                      className="w-full rounded mt-1 px-4 py-[6px] md:py-2 text-[10px] md:text-xs border border-gray-200 placeholder:text-[10px] focus:ring-1 focus:ring-gray-800/50 outline-none"
                      placeholder="Enter car name (e.g., Honda City VX)"
                    />
                  </div>

                  <Dropdown
                    label="Brand"
                    placeholder="Select Brand"
                    options={[
                      "Maruti Suzuki",
                      "Hyundai",
                      "Tata",
                      "Honda",
                      "Mahindra",
                      "Toyota",
                      "Kia",
                      "Volkswagen",
                      "Skoda",
                      "Renault",
                      "Ford",
                      "Nissan",
                      "MG",
                      "BMW",
                      "Mercedes",
                      "Audi",
                    ]}
                    value={formData.brand}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, brand: val }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="model"
                      required
                      value={formData.model}
                      onChange={handleInputChange}
                      className="w-full rounded mt-1 px-4 py-[6px] md:py-2 text-[10px] md:text-xs border border-gray-200 placeholder:text-[10px] focus:ring-1 focus:ring-gray-800/50 outline-none"
                      placeholder="Enter car model (e.g., City, Swift, i20)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variant
                    </label>
                    <input
                      type="text"
                      name="variant"
                      value={formData.variant}
                      onChange={handleInputChange}
                      className="w-full rounded mt-1 px-4 py-[6px] md:py-2 text-[10px] md:text-xs border border-gray-200 placeholder:text-[10px] focus:ring-1 focus:ring-gray-800/50 outline-none"
                      placeholder="Enter variant (e.g., VX CVT, ZX, LXI)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Dropdown
                    label="Body Type"
                    placeholder="Select Body Type"
                    options={[
                      "Sedan",
                      "SUV",
                      "Hatchback",
                      "MUV",
                      "Coupe",
                      "Convertible",
                      "Wagon",
                    ]}
                    value={formData.bodyType}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, bodyType: val }))
                    }
                  />

                  <Dropdown
                    label="Seats"
                    placeholder="Select Seats"
                    options={["2", "4", "5", "6", "7", "8"]}
                    value={formData.seats}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, seats: val }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Specifications
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Dropdown
                  label="Fuel Type"
                  placeholder="Select Fuel Type"
                  options={["Petrol", "Diesel", "CNG", "Electric"]}
                  value={formData.fuelType}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, fuelType: val }))
                  }
                />

                <Dropdown
                  label="Transmission"
                  placeholder="Select Transmission"
                  options={["Manual", "Automatic"]}
                  value={formData.transmission}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, transmission: val }))
                  }
                />

                <Dropdown
                  label="Ownership"
                  placeholder="Select Ownership"
                  options={["1st", "2nd", "3rd", "3+"]}
                  value={formData.ownership}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, ownership: val }))
                  }
                />
              </div>
            </div>

            {/* Years */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Year Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manufacturing Year
                  </label>
                  <select
                    name="manufacturingYear"
                    required
                    value={formData.manufacturingYear}
                    onChange={handleInputChange}
                    className="w-full rounded mt-1 px-4 py-[6px] md:py-2 text-[10px] md:text-xs border border-gray-200 placeholder:text-[10px] focus:ring-1 focus:ring-gray-800/50 outline-none"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Year
                  </label>
                  <select
                    name="registrationYear"
                    value={formData.registrationYear}
                    onChange={handleInputChange}
                    className="w-full rounded mt-1 px-4 py-[6px] md:py-2 text-[10px] md:text-xs border border-gray-200 placeholder:text-[10px] focus:ring-1 focus:ring-gray-800/50 outline-none"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Pricing & Usage
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="carPrice"
                    required
                    value={formData.carPrice}
                    onChange={handleInputChange}
                    className="w-full rounded mt-1 px-4 py-[6px] md:py-2 text-[10px] md:text-xs border border-gray-200 placeholder:text-[10px] focus:ring-1 focus:ring-gray-800/50 outline-none"
                    placeholder="Enter price in ₹ (e.g., 500000)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KM Driven
                  </label>
                  <input
                    type="number"
                    name="kmDriven"
                    value={formData.kmDriven}
                    onChange={handleInputChange}
                    className="w-full rounded mt-1 px-4 py-[6px] md:py-2 text-[10px] md:text-xs border border-gray-200 placeholder:text-[10px] focus:ring-1 focus:ring-gray-800/50 outline-none"
                    placeholder="Enter kilometers driven (e.g., 25000)"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Camera className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Car Images
                </h2>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*,.webp"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    const files = Array.from(e.target.files);
                    
                    // Validate file sizes (max 10MB per file)
                    const validFiles = files.filter(file => {
                      if (file.size > 10 * 1024 * 1024) {
                        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
                        return false;
                      }
                      return true;
                    });

                    // Limit to 10 images total
                    const totalImages = images.length + validFiles.length;
                    if (totalImages > 10) {
                      toast.error("Maximum 10 images allowed. Please select fewer images.");
                      return;
                    }

                    setImages(prev => [...prev, ...validFiles]);
                    const newPreviews = validFiles.map((file) =>
                      URL.createObjectURL(file)
                    );
                    setPreviewUrls(prev => [...prev, ...newPreviews]);
                  }}
                  className="hidden"
                />
                <label htmlFor="imageUpload" className="cursor-pointer block">
                  <Upload className="w-9 h-9 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-1">
                    Click to upload car images
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WebP • Max 10MB each • Up to 10 images
                  </p>
                  {images.length > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      {images.length} image{images.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </label>
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 justify-center py-2 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-8 py-[6px] border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-[6px] rounded-md transition font-medium shadow-lg ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/30"
              } text-white`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {mode === "edit" ? "Updating..." : "Listing..."}
                </span>
              ) : (
                mode === "edit" ? "Update Car" : "List Car"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsForm;
