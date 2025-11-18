import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";
import { createOrUpdateRequirement } from "../store/slices/requirementsSlice";
import { selectAuth } from "../store/slices/authSlices/authSlice";
import { openLogin } from "../store/slices/authSlices/loginModelSlice";
import { ArrowLeft, Loader2 } from "lucide-react";
import { cityData } from "../data/cityData";
import useGCarSheetData from "../hooks/useGCarSheetData";
import { Dropdown } from "../components/sellMyCar/SellHeroForm";
import toast from "react-hot-toast";

const CreateRequirement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, token } = useSelector(selectAuth);
  const { loading, error, selectedRequirement } = useSelector(
    (state: RootState) => state.requirements
  );

  const requirementId =
    selectedRequirement?.requirementId || selectedRequirement?.id;

  // ✅ Form State
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      dispatch(openLogin());
      return;
    }
  }, [user, token, dispatch]);

  // ✅ Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "city") {
        return { ...prev, city: value, locality: "c" };
      } else if (name === "brand") {
        return { ...prev, brand: value, model: "", variant: "" };
      } else if (name === "model") {
        return { ...prev, model: value, variant: "" };
      }
      return { ...prev, [name]: value };
    });
    setLocalError(null);
  };

  // ✅ Google Sheet car data
  const sheetId = import.meta.env.VITE_SHEET_ID;
  const carRange = "sheet2!A:Z";
  const apiKey = import.meta.env.VITE_API_KEY;
  const {
    data: carSheetData,
    // loading: carSheetLoading,
    // error: carSheetError,
  } = useGCarSheetData(sheetId, carRange, apiKey);

  // ✅ Convert sheet data into nested brand->model->variant structure
  const carDataObj = carSheetData.reduce((acc, item) => {
    const normalizedItem = Object.fromEntries(
      Object.entries(item).map(([k, v]) => [k.trim().toLowerCase(), v])
    );
    const brand = normalizedItem["brand"];
    const model = normalizedItem["model"];
    const variant = normalizedItem["variant"];
    if (!brand || !model) return acc;
    if (!acc[brand]) acc[brand] = {};
    if (!acc[brand][model]) acc[brand][model] = new Set<string>();
    if (variant) acc[brand][model].add(variant);
    return acc;
  }, {} as Record<string, Record<string, Set<string>>>);

  const carDataNested = Object.fromEntries(
    Object.entries(carDataObj).map(([brand, models]) => [
      brand,
      Object.fromEntries(
        Object.entries(models).map(([model, variants]) => [
          model,
          Array.from(variants),
        ])
      ),
    ])
  );

  // ✅ Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(false);

    if (!user?.id) {
      dispatch(openLogin());
      return;
    }

    if (!formData.city) {
      setLocalError("City is required");
      return;
    }

    try {
      const carName = `${formData.brand} ${formData.model}`.trim();

      const payload: any = {
        userId: user.id,
        ...formData,
        carName,
        manufacturingYear: parseInt(formData.manufacturingYear),
        registrationYear: parseInt(formData.registrationYear),
        minPrice: formData.minPrice ? parseInt(formData.minPrice) : undefined,
        maxPrice: formData.maxPrice ? parseInt(formData.maxPrice) : undefined,
        maxKmDriven: parseInt(formData.maxKmDriven),
        seats: parseInt(formData.seats),
      };

      if (requirementId) payload.requirementId = requirementId;

      await dispatch(createOrUpdateRequirement(payload)).unwrap();
      setSuccess(true);
      setTimeout(() => navigate("/requirements"), 2000);
    } catch (err: any) {
      setLocalError(err.message || "Failed to create requirement");
    }
  };

  // ✅ Render UI
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-10 my-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          {requirementId ? "Edit Requirement" : "Post Car Requirement"}
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Requirement {requirementId ? "updated" : "created"} successfully!
          Redirecting...
        </div>
      )}

      {(error || localError) &&
        // <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        //   {localError || error}
        // </div>
        toast.error(localError || error)}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Car Details Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-2.5">Car Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {/* ✅ Brand Dropdown */}
            <Dropdown
              label="Brand"
              placeholder="Search car brand"
              options={Object.keys(carDataNested).sort((a, b) =>
                a.localeCompare(b)
              )}
              isOpen={openDropdown === "brand"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "brand" ? null : "brand")
              }
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  brand: val,
                  model: "",
                  variant: "",
                }))
              }
              value={formData.brand}
            />

            {/* ✅ Model Dropdown */}
            <Dropdown
              label="Model"
              placeholder="Search car model"
              options={
                formData.brand && carDataNested[formData.brand]
                  ? Object.keys(carDataNested[formData.brand]).sort((a, b) =>
                      a.localeCompare(b)
                    )
                  : []
              }
              value={formData.model}
              isOpen={openDropdown === "model"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "model" ? null : "model")
              }
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, model: val, variant: "" }))
              }
            />

            {/* ✅ Variant Dropdown */}
            <Dropdown
              label="Variant"
              placeholder="Search car variant"
              options={
                formData.brand &&
                formData.model &&
                carDataNested[formData.brand]?.[formData.model]
                  ? [...carDataNested[formData.brand][formData.model]]
                  : []
              }
              value={formData.variant}
              isOpen={openDropdown === "variant"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "variant" ? null : "variant")
              }
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, variant: val }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Location Section */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-2.5">Location</h2>
            <div className="gap-4 lg:max-w-[70%]">
              <Dropdown
                label="City"
                placeholder="Search City"
                options={cityData}
                isOpen={openDropdown === "city"}
                onToggle={() =>
                  setOpenDropdown(openDropdown === "city" ? null : "city")
                }
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    city: val,
                  }))
                }
                value={formData.city}
              />
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-2.5">Price</h2>
            <div className="gap-4 lg:max-w-[70%]">
              <div>
                <label className="block text-sm mb-2">Max Price (₹)</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleChange}
                  placeholder="e.g., 700000"
                  className="w-full p-2 border border-gray-200 rounded-sm text-xs focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description Box Section */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-2.5">Description</h2>
            <div className="gap-4 lg:max-w-[70%]">
              <div>
                <label className="block text-sm mb-2">About Car</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g., Brand New Condition Car Without Scratch. Include key features, history, and condition here for a more detailed listing."
                  className="w-full h-24 p-2 border border-gray-200 rounded-sm text-xs focus:ring-0 focus:outline-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white px-6 py-3 rounded-md cursor-pointer hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            className="px-6 py-3 border rounded-md hover:bg-gray-100 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequirement;

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import type { AppDispatch, RootState } from "../store/store";
// import { createOrUpdateRequirement } from "../store/slices/requirementsSlice";
// import { selectAuth } from "../store/slices/authSlices/authSlice";
// import { openLogin } from "../store/slices/authSlices/loginModelSlice";
// import { ArrowLeft, Loader2 } from "lucide-react";
// // import { getModels, getVariants, getBrands } from "../utils/carData";
// import { cityData } from "../data/cityData";
// import useGCarSheetData from "../hooks/useGCarSheetData";
// import { Dropdown } from "../components/sellMyCar/SellHeroForm";

// const CreateRequirement: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { user, token } = useSelector(selectAuth);
//   const { loading, error, selectedRequirement } = useSelector(
//     (state: RootState) => state.requirements
//   );

//   const requirementId =
//     selectedRequirement?.requirementId || selectedRequirement?.id;

//   // Form state
//   const [formData, setFormData] = useState({
//     city: "",
//     locality: "c",
//     state: "c",
//     carName: "",
//     brand: "",
//     model: "",
//     variant: "",
//     fuelType: "" as "" | "Petrol" | "Diesel" | "CNG" | "Electric",
//     transmission: "" as "" | "Manual" | "Automatic",
//     bodyType: "sedan",
//     ownership: "" as "" | "1st" | "2nd" | "3rd" | "3+",
//     manufacturingYear: "2025",
//     registrationYear: "2025",
//     minPrice: "",
//     maxPrice: "",
//     maxKmDriven: "1000",
//     seats: "4",
//     description: "",
//   });

//   const [localError, setLocalError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//   useEffect(() => {
//     if (!user || !token) {
//       dispatch(openLogin());
//       return;
//     }
//   }, [user, token, dispatch]);

//   // Helper function to format state name for display (add spaces before capital letters)
//   // const formatStateName = (state: string): string => {
//   //   return state.replace(/([A-Z])/g, " $1").trim();
//   // };

//   // Helper function to get state key from formatted name
//   // const getStateKey = (formattedState: string): string => {
//   //   return formattedState.replace(/\s+/g, "");
//   // };

//   // Get available states from locationData
//   // const availableStates = Object.keys(locationData);

//   // Get available cities based on selected state
//   // const getAvailableCities = (): string[] => {
//   //   // if (!formData.state) return [];
//   //   // const stateKey = getStateKey(formData.state);
//   //   // return Object.keys(locationData[stateKey] || {});
//   // };

//   // Get available localities based on selected state and city
//   // const getAvailableLocalities = (): string[] => {
//   //   if (!formData.state || !formData.city) return [];
//   //   const stateKey = getStateKey(formData.state);
//   //   return locationData[stateKey]?.[formData.city] || [];
//   // };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;

//     // Reset dependent fields when parent changes
//     // if (name === "state") {
//     //   setFormData((prev) => ({
//     //     ...prev,
//     //     state: value,
//     //     city: "",
//     //     locality: "",
//     //   }));
//     // } else
//     if (name === "city") {
//       setFormData((prev) => ({
//         ...prev,
//         city: value,
//         locality: "",
//       }));
//     } else if (name === "brand") {
//       setFormData((prev) => ({
//         ...prev,
//         brand: value,
//         model: "",
//         variant: "",
//       }));
//     } else if (name === "model") {
//       setFormData((prev) => ({
//         ...prev,
//         model: value,
//         variant: "",
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//     setLocalError(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLocalError(null);
//     setSuccess(false);

//     if (!user?.id) {
//       dispatch(openLogin());
//       return;
//     }

//     // Validate required fields
//     if (!formData.city) {
//       setLocalError("City are required");
//       return;
//     }

//     try {
//       const carName = `${(formData.brand, formData.model)}`;

//       const payload: any = {
//         userId: user.id,
//         city: formData.city,
//         locality: formData.locality || "c",
//         state: formData.state || "c",
//         carName: carName || undefined,
//         brand: formData.brand || undefined,
//         model: formData.model || undefined,
//         variant: formData.variant || undefined,
//         fuelType: formData.fuelType || undefined,
//         transmission: formData.transmission || undefined,
//         bodyType: formData.bodyType || undefined,
//         ownership: formData.ownership || "1st",
//         manufacturingYear: formData.manufacturingYear
//           ? parseInt(formData.manufacturingYear)
//           : undefined,
//         registrationYear: formData.registrationYear
//           ? parseInt(formData.registrationYear)
//           : undefined,
//         minPrice: formData.minPrice ? parseInt(formData.minPrice) : undefined,
//         maxPrice: formData.maxPrice ? parseInt(formData.maxPrice) : undefined,
//         maxKmDriven: formData.maxKmDriven
//           ? parseInt(formData.maxKmDriven)
//           : "1000",
//         seats: formData.seats ? parseInt(formData.seats) : "4",
//         description: formData.description || undefined,
//       };

//       // If editing, include requirementId
//       if (requirementId) {
//         payload.requirementId = requirementId;
//       }

//       await dispatch(createOrUpdateRequirement(payload)).unwrap();
//       setSuccess(true);
//       setTimeout(() => {
//         navigate("/requirements");
//       }, 2000);
//     } catch (err: any) {
//       setLocalError(err.message || "Failed to create requirement");
//     }
//   };

//   // google car(brand, model, variant)
//   const sheetId = import.meta.env.VITE_SHEET_ID;
//   const carRange = "sheet2!A:Z";
//   const apiKey = import.meta.env.VITE_API_KEY;
//   const {
//     data: carSheetData,
//     loading: carSheetLoading,
//     error: carSheetError,
//   } = useGCarSheetData(sheetId, carRange, apiKey);

//   const carDataObj = carSheetData.reduce((acc, item) => {
//     const normalizedItem = Object.fromEntries(
//       Object.entries(item).map(([k, v]) => [k.trim().toLowerCase(), v])
//     );

//     const brand = normalizedItem["brand"];
//     const model = normalizedItem["model"];
//     const variant = normalizedItem["variant"];

//     if (!brand || !model) return acc;
//     if (!acc[brand]) acc[brand] = {};
//     if (!acc[brand][model]) acc[brand][model] = new Set();
//     if (variant) acc[brand][model].add(variant);
//     return acc;
//   }, {} as { [brand: string]: { [model: string]: Set<string> } });

//   const carDataNested = Object.fromEntries(
//     Object.entries(carDataObj).map(([brand, models]) => [
//       brand,
//       Object.fromEntries(
//         Object.entries(models).map(([model, variants]) => [
//           model,
//           Array.from(variants),
//         ])
//       ),
//     ])
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-10 my-12">
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition"
//       >
//         <ArrowLeft className="w-5 h-5" />
//         <span>Back</span>
//       </button>

//       <h1 className="text-2xl sm:text-3xl font-bold mb-6">
//         {requirementId ? "Edit Requirement" : "Post Car Requirement"}
//       </h1>

//       {success && (
//         <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
//           Requirement {requirementId ? "updated" : "created"} successfully!
//           Redirecting...
//         </div>
//       )}

//       {(error || localError) && (
//         <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//           {localError || error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Location Section */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//           <h2 className="text-xl font-semibold mb-4">Location</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 City <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 required
//                 // disabled={!formData.state}
//                 className="w-full p-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
//               >
//                 <option value="">Select City</option>
//                 {cityData.map((city) => (
//                   <option key={city} value={city}>
//                     {city}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Car Details Section */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//           <h2 className="text-xl font-semibold mb-4">Car Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4">
//             <Dropdown
//               label="Brand"
//               placeholder="Search car brand"
//               options={Object.keys(carDataNested).sort((a, b) =>
//                 a.localeCompare(b)
//               )}
//               isOpen={openDropdown === "brand"}
//               onToggle={() =>
//                 setOpenDropdown(openDropdown === "brand" ? null : "brand")
//               }
//               onChange={(val) => {
//                 setBrand(val);
//                 setModel("");
//                 setVariant("");
//               }}
//               value={formData.brand || carSheetLoading || carSheetError}
//             />
//             <Dropdown
//               label="Model"
//               placeholder="Search car model"
//               options={
//                 brand && carDataNested[brand]
//                   ? Object.keys(carDataNested[brand]).sort((a, b) =>
//                       a.localeCompare(b)
//                     )
//                   : []
//               }
//               value={formData.model || carSheetLoading || carSheetError}
//               isOpen={openDropdown === "model"}
//               onToggle={() =>
//                 setOpenDropdown(openDropdown === "model" ? null : "model")
//               }
//               onChange={(val) => {
//                 setModel(val);
//                 setVariant("");
//               }}
//             />
//             <Dropdown
//               label="Variant"
//               placeholder="Search car variant"
//               options={
//                 brand && model && carDataNested[brand]?.[model]
//                   ? [...carDataNested[brand][model]]
//                   : []
//               }
//               value={formData.variant || carSheetLoading || carSheetError}
//               isOpen={openDropdown === "variant"}
//               onToggle={() =>
//                 setOpenDropdown(openDropdown === "variant" ? null : "variant")
//               }
//               onChange={setVariant}
//             />
//           </div>
//         </div>

//         {/* Price Section */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//           <h2 className="text-xl font-semibold mb-4">Price</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* <div>
//               <label className="block text-sm font-medium mb-2">
//                 Min Price (₹)
//               </label>
//               <input
//                 type="number"
//                 name="minPrice"
//                 value={formData.minPrice}
//                 onChange={handleChange}
//                 placeholder="e.g., 500000"
//                 className="w-full p-2 border rounded-md"
//               />
//             </div> */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Max Price (₹)
//               </label>
//               <input
//                 type="number"
//                 name="maxPrice"
//                 value={formData.maxPrice}
//                 onChange={handleChange}
//                 placeholder="e.g., 700000"
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="flex gap-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="flex-1 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 {requirementId ? "Updating..." : "Creating..."}
//               </>
//             ) : requirementId ? (
//               "Update Requirement"
//             ) : (
//               "Post Requirement"
//             )}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate("/requirements")}
//             className="px-6 py-3 border rounded-md hover:bg-gray-100 transition"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
// export default CreateRequirement;
