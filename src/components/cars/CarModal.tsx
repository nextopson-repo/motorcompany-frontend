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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
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

const CarDetailsForm: React.FC<CarDetailsFormProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicle,
  mode,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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

      const defaultCity = Object.keys(locationData[state] || {})[0] || "";
      const city = vehicle.address?.city || defaultCity;

      const defaultLocality = (locationData[state]?.[city] || [])[0] || "";
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

      if (vehicle.carImages?.length > 0) {
        const urls = vehicle.carImages.map((img) => img.presignedUrl);
        setPreviewUrls(urls);
      }
    }
  }, [mode, vehicle]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "addressState") {
        const firstCity = Object.keys(locationData[value] || {})[0] || "";
        const firstLocality = (locationData[value]?.[firstCity] || [])[0] || "";
        updated.addressCity = firstCity;
        updated.addressLocality = firstLocality;
      }

      if (name === "addressCity") {
        const firstLocality =
          (locationData[prev.addressState]?.[value] || [])[0] || "";
        updated.addressLocality = firstLocality;
      }

      return updated;
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("User not logged in");
      return;
    }

    let parsedUser: { id: string } | null = null;
    try {
      parsedUser = JSON.parse(userData);
    } catch (err) {
      console.error("Failed to parse user data from localStorage", err);
      alert("Invalid user data");
      return;
    }

    if (!parsedUser?.id) {
      alert("User ID missing");
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("userId", parsedUser.id);

    formDataToSend.append(
      "title",
      `${formData.brand} ${formData.model}`.trim()
    );
    formDataToSend.append(
      "carName",
      formData.carName || `${formData.brand} ${formData.model}`.trim()
    );

    formDataToSend.append("brand", formData.brand || "");
    formDataToSend.append("model", formData.model || "");
    formDataToSend.append("variant", formData.variant || "");
    formDataToSend.append("fuelType", formData.fuelType || "");
    formDataToSend.append("transmission", formData.transmission || "");
    formDataToSend.append("bodyType", formData.bodyType || "");
    formDataToSend.append("ownership", formData.ownership || "");
    formDataToSend.append(
      "manufacturingYear",
      formData.manufacturingYear?.toString() || ""
    );
    formDataToSend.append(
      "registrationYear",
      formData.registrationYear?.toString() || ""
    );
    formDataToSend.append("kmDriven", formData.kmDriven?.toString() || "");
    formDataToSend.append("seats", formData.seats?.toString() || "");
    formDataToSend.append(
      "isSale",
      formData.isSale === "Sell" ? "Sell" : "Buy"
    );
    formDataToSend.append("carPrice", formData.carPrice?.toString() || "");
    formDataToSend.append("addressState", formData.addressState || "Unknown");
    formDataToSend.append("addressCity", formData.addressCity || "Unknown");
    formDataToSend.append(
      "addressLocality",
      formData.addressLocality || "Unknown"
    );

    images.forEach((file) => {
      formDataToSend.append("images", file);
    });

    formDataToSend.forEach((value, key) => console.log(key, value));

    onSave(formDataToSend);
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
                    formData.addressState
                      ? Object.keys(locationData[formData.addressState] || {})
                      : []
                  }
                  value={formData.addressCity}
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
                  placeholder="Select you neighbourhood"
                  options={
                    formData.addressState && formData.addressCity
                      ? locationData[formData.addressState][
                          formData.addressCity
                        ] || []
                      : []
                  }
                  value={formData.addressLocality}
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      placeholder="e.g., City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variant
                    </label>
                    <input
                      type="text"
                      name="variant"
                      required
                      value={formData.variant}
                      onChange={handleInputChange}
                      className="w-full rounded mt-1 px-4 py-[6px] md:py-2 text-[10px] md:text-xs border border-gray-200 placeholder:text-[10px] focus:ring-1 focus:ring-gray-800/50 outline-none"
                      placeholder="e.g., VX CVT"
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
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KM Driven
                  </label>
                  <input
                    type="number"
                    name="kmDriven"
                    required
                    value={formData.kmDriven}
                    onChange={handleInputChange}
                    className="w-full rounded mt-1 px-4 py-[6px] md:py-2 text-[10px] md:text-xs border border-gray-200 placeholder:text-[10px] focus:ring-1 focus:ring-gray-800/50 outline-none"
                    placeholder="e.g., 25000"
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

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    const files = Array.from(e.target.files);
                    setImages(files);
                    const previews = files.map((file) =>
                      URL.createObjectURL(file)
                    );
                    setPreviewUrls(previews);
                  }}
                  className="hidden"
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <Upload className="w-9 h-9 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-1">
                    Click to upload car images
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG Maximum 20MB</p>
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
              className="px-8 py-[6px] bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition font-medium shadow-lg shadow-blue-500/30"
            >
              {mode === "edit" ? "Update Car" : "List Car"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsForm;
