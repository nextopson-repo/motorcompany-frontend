import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";
import { createOrUpdateRequirement } from "../store/slices/requirementsSlice";
import { selectAuth } from "../store/slices/authSlices/authSlice";
import { openLogin } from "../store/slices/authSlices/loginModelSlice";
// import {
//   fuelOptions,
//   transmissionOptions,
//   // bodyTypeOptions,
// } from "../data/filterOptions";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getModels, getVariants, getBrands } from "../utils/carData";
// import { locationData } from "./Requirements";

const CreateRequirement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, token } = useSelector(selectAuth);
  const { loading, error, selectedRequirement } = useSelector(
    (state: RootState) => state.requirements
  );
  const requirementId =
    selectedRequirement?.requirementId || selectedRequirement?.id;
  // const buyers = useSelector((state: RootState) => state.buyers.buyers);

  // console.log("buyers :", buyers)

  // Extract unique brands from buyers' preferences
  // const getBrandsFromBuyers = (): string[] => {
  //   const brandSet = new Set<string>();
  //   buyers.forEach((buyer) => {
  //     buyer.preferences.forEach((pref) => {
  //       // Normalize preferences - some might be brands, some might be models
  //       // Common brands in preferences: Maruti Suzuki, Ford, Mahindra, Hyundai
  //       // Nexon is a model, so we'll map it to Tata Motors
  //       if (pref === "Nexon") {
  //         brandSet.add("Tata Motors");
  //       } else {
  //         brandSet.add(pref);
  //       }
  //     });
  //   });
  //   return Array.from(brandSet).sort();
  // };

  // const availableBrands = getBrandsFromBuyers();

  // Form state
  const [formData, setFormData] = useState({
    city: "",
    locality: "c",
    state: "c",
    carName: "",
    brand: "",
    model: "",
    variant: "",
    fuelType: "" as "" | "Petrol" | "Diesel" | "CNG" | "Electric",
    transmission: "" as "" | "Manual" | "Automatic",
    bodyType: "sedan",
    ownership: "" as "" | "1st" | "2nd" | "3rd" | "3+",
    manufacturingYear: "2025",
    registrationYear: "2025",
    minPrice: "",
    maxPrice: "",
    maxKmDriven: "1000",
    seats: "4",
    description: "",
  });

  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      dispatch(openLogin());
      return;
    }
  }, [user, token, dispatch]);

  // Helper function to format state name for display (add spaces before capital letters)
  // const formatStateName = (state: string): string => {
  //   return state.replace(/([A-Z])/g, " $1").trim();
  // };

  // Helper function to get state key from formatted name
  // const getStateKey = (formattedState: string): string => {
  //   return formattedState.replace(/\s+/g, "");
  // };

  // Get available states from locationData
  // const availableStates = Object.keys(locationData);

  // Get available cities based on selected state
  // const getAvailableCities = (): string[] => {
  //   // if (!formData.state) return [];
  //   // const stateKey = getStateKey(formData.state);
  //   // return Object.keys(locationData[stateKey] || {});
  // };

  const getAvailableCities = [
    "Ahmedabad",
    "Chandigarh",
    "Delhi",
    "Hyderabad",
    "Jaipur",
    "Kanpur",
    "Lucknow",
    "Mumbai",
    "Pune",
    "Surat",
  ];

  // Get available localities based on selected state and city
  // const getAvailableLocalities = (): string[] => {
  //   if (!formData.state || !formData.city) return [];
  //   const stateKey = getStateKey(formData.state);
  //   return locationData[stateKey]?.[formData.city] || [];
  // };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Reset dependent fields when parent changes
    // if (name === "state") {
    //   setFormData((prev) => ({
    //     ...prev,
    //     state: value,
    //     city: "",
    //     locality: "",
    //   }));
    // } else
    if (name === "city") {
      setFormData((prev) => ({
        ...prev,
        city: value,
        locality: "",
      }));
    } else if (name === "brand") {
      setFormData((prev) => ({
        ...prev,
        brand: value,
        model: "",
        variant: "",
      }));
    } else if (name === "model") {
      setFormData((prev) => ({
        ...prev,
        model: value,
        variant: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(false);

    if (!user?.id) {
      dispatch(openLogin());
      return;
    }

    // Validate required fields
    if (!formData.city) {
      setLocalError("City are required");
      return;
    }

    try {
      const carName = `${(formData.brand, formData.model)}`;

      const payload: any = {
        userId: user.id,
        city: formData.city,
        locality: formData.locality || "c",
        state: formData.state || "c",
        carName: carName || undefined,
        brand: formData.brand || undefined,
        model: formData.model || undefined,
        variant: formData.variant || undefined,
        fuelType: formData.fuelType || undefined,
        transmission: formData.transmission || undefined,
        bodyType: formData.bodyType || undefined,
        ownership: formData.ownership || "1st",
        manufacturingYear: formData.manufacturingYear
          ? parseInt(formData.manufacturingYear)
          : undefined,
        registrationYear: formData.registrationYear
          ? parseInt(formData.registrationYear)
          : undefined,
        minPrice: formData.minPrice ? parseInt(formData.minPrice) : undefined,
        maxPrice: formData.maxPrice ? parseInt(formData.maxPrice) : undefined,
        maxKmDriven: formData.maxKmDriven
          ? parseInt(formData.maxKmDriven)
          : "1000",
        seats: formData.seats ? parseInt(formData.seats) : "4",
        description: formData.description || undefined,
      };

      // If editing, include requirementId
      if (requirementId) {
        payload.requirementId = requirementId;
      }

      await dispatch(createOrUpdateRequirement(payload)).unwrap();
      setSuccess(true);
      setTimeout(() => {
        navigate("/requirements");
      }, 2000);
    } catch (err: any) {
      setLocalError(err.message || "Failed to create requirement");
    }
  };

  // const currentYear = new Date().getFullYear();
  // const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-10 my-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        {requirementId ? "Edit Requirement" : "Post Car Requirement"}
      </h1>

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Requirement {requirementId ? "updated" : "created"} successfully!
          Redirecting...
        </div>
      )}

      {(error || localError) && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {localError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* <div>
              <label className="block text-sm font-medium mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select State</option>
                {availableStates.map((state) => (
                  <option key={state} value={formatStateName(state)}>
                    {formatStateName(state)}
                  </option>
                ))}
              </select>
            </div> */}
            <div>
              <label className="block text-sm font-medium mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                // disabled={!formData.state}
                className="w-full p-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select City</option>
                {getAvailableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <label className="block text-sm font-medium mb-2">
                Locality <span className="text-red-500">*</span>
              </label>
              <select
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                required
                disabled={!formData.city}
                className="w-full p-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Locality</option>
                {getAvailableLocalities().map((locality) => (
                  <option key={locality} value={locality}>
                    {locality}
                  </option>
                ))}
              </select>
            </div> */}
          </div>
        </div>

        {/* Car Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Car Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {/* <div>
              <label className="block text-sm font-medium mb-2">Car Name</label>
              <input
                type="text"
                name="carName"
                value={formData.carName}
                onChange={handleChange}
                placeholder="e.g., Swift Dzire"
                className="w-full p-2 border rounded-md"
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Brand</option>
                {getBrands().map((brand) => (
                  <option key={brand} value={brand} >
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <select
                name="model"
                value={formData.model}
                onChange={handleChange}
                disabled={!formData.brand}
                className="w-full p-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Model</option>
                {formData.brand &&
                  getModels(formData.brand).map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Variant</label>
              <select
                name="variant"
                value={formData.variant}
                onChange={handleChange}
                disabled={!formData.model}
                className="w-full p-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Variant</option>
                {formData.brand &&
                  formData.model &&
                  getVariants(formData.brand, formData.model).map((variant) => (
                    <option key={variant} value={variant}>
                      {variant}
                    </option>
                  ))}
              </select>
            </div>
            {/* <div>
              <label className="block text-sm font-medium mb-2">
                Fuel Type
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Fuel Type</option>
                {fuelOptions.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">
                Transmission
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Transmission</option>
                {transmissionOptions.map((trans) => (
                  <option key={trans} value={trans}>
                    {trans}
                  </option>
                ))}
              </select>
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">Body Type</label>
              <select
                name="bodyType"
                value={formData.bodyType}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Body Type</option>
                {bodyTypeOptions.map((body) => (
                  <option key={body} value={body}>
                    {body}
                  </option>
                ))}
              </select>
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">Ownership</label>
              <select
                name="ownership"
                value={formData.ownership}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Ownership</option>
                <option value="1st">1st Owner</option>
                <option value="2nd">2nd Owner</option>
                <option value="3rd">3rd Owner</option>
                <option value="3+">3+ Owner</option>
              </select>
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">
                Manufacturing Year
              </label>
              <select
                name="manufacturingYear"
                value={formData.manufacturingYear}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">
                Registration Year
              </label>
              <select
                name="registrationYear"
                value={formData.registrationYear}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">Seats</label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                placeholder="e.g., 5"
                min="2"
                max="10"
                className="w-full p-2 border rounded-md"
              />
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">Max KM Driven</label>
              <input
                type="number"
                name="maxKmDriven"
                value={formData.maxKmDriven}
                onChange={handleChange}
                placeholder="e.g., 50000"
                className="w-full p-2 border rounded-md"
              />
            </div> */}
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Price</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div>
              <label className="block text-sm font-medium mb-2">
                Min Price (₹)
              </label>
              <input
                type="number"
                name="minPrice"
                value={formData.minPrice}
                onChange={handleChange}
                placeholder="e.g., 500000"
                className="w-full p-2 border rounded-md"
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Price (₹)
              </label>
              <input
                type="number"
                name="maxPrice"
                value={formData.maxPrice}
                onChange={handleChange}
                placeholder="e.g., 700000"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Add any additional details or requirements..."
            className="w-full p-2 border rounded-md"
          />
        </div> */}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {requirementId ? "Updating..." : "Creating..."}
              </>
            ) : requirementId ? (
              "Update Requirement"
            ) : (
              "Post Requirement"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/requirements")}
            className="px-6 py-3 border rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequirement;
