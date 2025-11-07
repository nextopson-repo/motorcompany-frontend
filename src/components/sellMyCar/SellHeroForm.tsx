import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import ImageUploadOverlay from "../ImageUploadOverlay";
import useGCarSheetData from "../../hooks/useGCarSheetData";
import toast from "react-hot-toast";

interface DropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (v: string) => void;
}

// Dropdown component remains unchanged, keeping it concise here
function Dropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
  isOpen,
  onToggle,
}: DropdownProps) {
  const [search, setSearch] = useState("");

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full relative">
      <label className="text-[10px] md:text-xs lg:text-sm">{label}</label>
      <div
        onClick={onToggle}
        className="relative w-full flex items-center border border-gray-200 rounded-sm px-3 py-1.5 lg:py-2 mt-0.5 lg:mt-1 text-[10px] lg:text-xs cursor-pointer bg-white"
      >
        <Search
          className="w-3 lg:w-3.5 h-3 lg:h-3.5 text-red-500 mr-2"
          strokeWidth={1.2}
        />
        <span className="text-[10px] flex-1 text-gray-600">
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div className="mt-1 border border-gray-200 rounded-sm shadow bg-white absolute z-10 w-full max-h-40 overflow-y-auto text-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full border-b border-gray-200 px-2 py-1 outline-none"
          />
          {filtered.length > 0 ? (
            filtered.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  onToggle();
                  setSearch("");
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400">No results</div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Realistic Dropdown Data ----------  // Fuel type, transmission, ownership, body type options remain unchanged
const fuelTypeOptions = ["Petrol", "Diesel", "CNG", "Electric"];
const transmissionOptions = ["Manual", "Automatic"];
const ownershipOptions = ["1st", "2nd", "3rd", "3+"];
const bodyTypeOptions = [
  "SUV",
  "Sedan",
  "Hatchback",
  "MUV",
  "Coupe",
  "Convertible",
  "Crossover",
];

export default function SellHeroForm({
  onBack,
  onSubmit,
  defaultValues,
  uploadedImages,
}: {
  onBack: () => void;
  onSubmit: (carData: any) => void;
  defaultValues: any | null;
  uploadedImages: File[];
}) {
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState(defaultValues?.brand || "");
  const [model, setModel] = useState(defaultValues?.model || "");
  const [variant, setVariant] = useState(defaultValues?.variant || "");
  const [manufactureYear, setManufactureYear] = useState(
    defaultValues?.manufacturingYear || ""
  );

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [fuelType, setFuelType] = useState(defaultValues?.fuelType || "Petrol");
  const [transmission, setTransmission] = useState(
    defaultValues?.transmission || "Manual"
  );
  const [kmDriven, setKmDriven] = useState(
    defaultValues?.kmDriven?.toString() || ""
  );
  const [registrationYear, setRegistrationYear] = useState(
    defaultValues?.registrationYear || ""
  );

  const [ownership, setOwnership] = useState(defaultValues?.ownership || "1st");
  const [bodyType, setBodyType] = useState(defaultValues?.bodyType || "");
  const [price, setPrice] = useState(defaultValues?.price?.toString() || "");
  const [seats, setSeats] = useState(defaultValues?.seats?.toString() || "");

  const [showOverlay, setShowOverlay] = useState(false);

  // google car(brand, model, variant)
  const sheetId = import.meta.env.VITE_SHEET_ID;
  const carRange = "sheet2!A:Z";
  const apiKey = import.meta.env.VITE_API_KEY;
  const {
    data: carSheetData,
    loading: carSheetLoading,
    // error: carSheetError,
  } = useGCarSheetData(sheetId, carRange, apiKey);

  // Build nested locationData object from Google Sheet
  const carDataObj = carSheetData.reduce((acc, item) => {
    // Clean up all keys: remove spaces + lowercase
    const normalizedItem = Object.fromEntries(
      Object.entries(item).map(([k, v]) => [k.trim().toLowerCase(), v])
    );

    const brand = normalizedItem["brand"];
    const model = normalizedItem["model"];
    const variant = normalizedItem["variant"];

    if (!brand || !model) return acc;
    if (!acc[brand]) acc[brand] = {};
    if (!acc[brand][model]) acc[brand][model] = new Set();
    if (variant) acc[brand][model].add(variant);
    return acc;
  }, {} as { [brand: string]: { [model: string]: Set<string> } });

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

  const formatPrice = (val: string) => {
    const num = val.replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const nextStep = () => {
    if (step === 3) {
      setShowOverlay(true);
    } else {
      setStep((s) => s + 1);
    }
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // This payload will be passed to parent submit handler including images from overlay
  const handleSubmit = () => {
    const payload = {
      brand,
      model,
      variant,
      manufactureYear,
      fuelType,
      transmission,
      ownership,
      bodyType,
      price,
      seats,
      registrationYear,
      kmDriven,
      images: uploadedImages,
    };
    // console.log("Payload ready for submit:", payload);
    onSubmit(payload);
    setShowOverlay(false);
  };

  return (
    <div className="bg-white overflow-y-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
      <div
        className={`${
          showOverlay ? "pointer-events-none" : ""
        }`}
      >
      {/* Stepper */}
      <div className="w-full flex items-center justify-between mb-3 md:mb-4">
        {/* Step 1 */}
        <div className="flex items-center">
          <div
            className={`w-4 lg:w-6 h-4 lg:h-6 text-[10px] lg:text-sm rounded-full flex items-center justify-center  font-medium shadow-md ${
              step === 1
                ? "bg-black text-white"
                : "bg-white border border-gray-100 text-gray-500"
            }`}
          >
            1
          </div>
        </div>

        {/* Connector 1 */}
        <div className="flex-1 border-t-[1.5px] lg:border-t-0.5 border-dashed border-gray-300 mx-2"></div>

        {/* Step 2 */}
        <div className="flex items-center">
          <div
            className={`w-4 lg:w-6 h-4 lg:h-6 text-[10px] lg:text-sm rounded-full flex items-center justify-center font-medium shadow-md ${
              step === 2
                ? "bg-black text-white"
                : "bg-white border border-gray-100 text-gray-500"
            }`}
          >
            2
          </div>
        </div>

        {/* Connector 2 */}
        <div className="flex-1 border-t-[1.5px] lg:border-t-0.5 border-dashed border-gray-300 mx-2"></div>

        {/* Step 3 */}
        <div className="flex items-center">
          <div
            className={`w-4 lg:w-6 h-4 lg:h-6 text-[10px] lg:text-sm rounded-full flex items-center justify-center font-medium shadow-md ${
              step === 3
                ? "bg-black text-white"
                : "bg-white border border-gray-100 text-gray-500"
            }`}
          >
            3
          </div>
        </div>
      </div>

      <h2 className="text-xs lg:text-md font-semibold mb-1 lg:mb-4">
        Enter Car Details
      </h2>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-2 relative">
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
            onChange={(val) => {
              setBrand(val);
              setModel("");
              setVariant("");
            }}
            value={brand || carSheetLoading}
          />
          <Dropdown
            label="Model"
            placeholder="Search car model"
            options={
              brand && carDataNested[brand]
                ? Object.keys(carDataNested[brand]).sort((a, b) =>
                    a.localeCompare(b)
                  )
                : []
            }
            value={model || carSheetLoading}
            isOpen={openDropdown === "model"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "model" ? null : "model")
            }
            onChange={(val) => {
              setModel(val);
              setVariant("");
            }}
          />
          <Dropdown
            label="Variant"
            placeholder="Search car variant"
            options={
              brand && model && carDataNested[brand]?.[model]
                ? [...carDataNested[brand][model]]
                : []
            }
            value={variant || carSheetLoading}
            isOpen={openDropdown === "variant"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "variant" ? null : "variant")
            }
            onChange={setVariant}
          />

          <div>
            <label className="text-[10px] md:text-xs lg:text-sm">
              Manufacturing Year
            </label>
            <input
              type="text"
              value={manufactureYear}
              onChange={(e) => setManufactureYear(e.target.value)}
              placeholder="2000"
              className="w-full border border-gray-200 rounded-sm px-3 py-1.5 lg:py-2 mt-0.5 lg:mt-1 text-[10px] lg:text-xs"
            />
          </div>
          <div className="flex justify-between pt-1 lg:pt-2 gap-3">
            {defaultValues ? (
              ""
            ) : (
              <button
                onClick={onBack}
                className="bg-gray-50 text-gray-400 border border-gray-200 text-xs lg:text-sm  px-6 py-1.5 lg:py-2 rounded-xs cursor-pointer active:scale-90"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (!brand || !model || !variant || !manufactureYear) {
                  toast.error("Please fill all Details!");
                  return;
                }
                nextStep();
              }}
              className="bg-[#24272C] text-white text-xs lg:text-sm font-semibold w-full py-1.5 lg:py-2 rounded-xs cursor-pointer active:scale-90"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-1">
          <div>
            <label
              htmlFor="fuelType"
              className="text-[10px] md:text-xs lg:text-sm"
            >
              Fuel Type
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2 lg:mb-4 text-[10px] lg:text-xs mt-1">
              {fuelTypeOptions.map((fuel) => (
                <button
                  key={fuel}
                  onClick={() => setFuelType(fuel)}
                  className={`flex-1 py-1.5 rounded-xs ${
                    fuelType === fuel
                      ? "bg-[#24272C] text-white font-medium"
                      : "bg-white border border-gray-300 text-gray-600"
                  }`}
                >
                  <span className="text-[10px]">{fuel}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="transmission"
              className="text-[10px] md:text-xs lg:text-sm"
            >
              Transmission
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2 lg:mb-4 text-[10px] lg:text-xs mt-0.5 lg:mt-1">
              {transmissionOptions.map((trans) => (
                <button
                  key={trans}
                  onClick={() => setTransmission(trans)}
                  className={`flex-1 py-1.5 rounded-xs ${
                    transmission === trans
                      ? "bg-[#24272C] text-white font-medium"
                      : "bg-white border border-gray-300 text-gray-600"
                  }`}
                >
                  <span className="text-[10px]">{trans}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] md:text-xs lg:text-sm">
              KM Driven
            </label>
            <input
              type="text"
              placeholder="50000km"
              value={kmDriven}
              onChange={(e) => setKmDriven(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-1.5 lg:py-2 mt-0.5 lg:mt-1 text-[10px] lg:text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] md:text-xs lg:text-sm">
              Registration Year
            </label>
            <input
              type="text"
              placeholder="Enter Registration Year"
              value={registrationYear}
              onChange={(e) => setRegistrationYear(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-1.5 lg:py-2 mt-0.5 lg:mt-1 text-[10px] lg:text-xs"
            />
          </div>

          <div className="flex justify-between pt-1 lg:pt-2 gap-3">
            <button
              onClick={prevStep}
              className="bg-gray-50 text-gray-400 border border-gray-200 text-xs lg:text-sm  px-6 py-1.5 lg:py-2 rounded-xs cursor-pointer active:scale-90"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (!kmDriven || !registrationYear) {
                  toast.error("Please fill all Details!");
                  return;
                }
                nextStep();
              }}
              className="bg-[#24272C] text-white text-xs lg:text-sm font-semibold w-full py-1.5 lg:py-2 rounded-xs cursor-pointer active:scale-90"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-2 lg:space-y-3">
          <div>
            <label className="text-[10px] md:text-xs lg:text-sm">
              No. of Seats
            </label>
            <input
              type="number"
              placeholder="5"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-1.5 lg:py-2 mt-0.5 lg:mt-1 text-[10px] lg:text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] md:text-xs lg:text-sm">
              Ownership
            </label>
            <div className="grid grid-cols-4 gap-2 mb-1 lg:mb-2 text-[10px] lg:text-xs mt-0.5 lg:mt-1">
              {ownershipOptions.map((own) => (
                <button
                  key={own}
                  onClick={() => setOwnership(own)}
                  className={`py-1.5 rounded-xs ${
                    ownership === own
                      ? "bg-[#24272C] text-white font-medium"
                      : "bg-white border border-gray-300 text-gray-600"
                  }`}
                >
                  <span className="text-[10px]">{own}</span>
                </button>
              ))}
            </div>
          </div>
          <Dropdown
            label="Body Type"
            placeholder="Select body type"
            options={bodyTypeOptions}
            value={bodyType}
            isOpen={openDropdown === "bodyType"}
            onToggle={() => {
              setOpenDropdown(openDropdown === "bodyType" ? null : "bodyType");
            }}
            onChange={setBodyType}
          />

          <div>
            <label className="text-[10px] md:text-xs lg:text-sm">Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(formatPrice(e.target.value))}
              placeholder="10,00,000"
              min={50000}
              required
              className="w-full border border-gray-300 rounded-sm px-3 py-1.5 lg:py-2 mt-0.5 lg:mt-1 text-[10px] lg:text-xs"
            />
          </div>
          <div className="flex justify-between pt-1 lg:pt-2 gap-3">
            <button
              onClick={prevStep}
              className="bg-gray-50 text-gray-400 border border-gray-200 text-xs lg:text-sm  px-6 py-1.5 lg:py-2 rounded-xs cursor-pointer active:scale-90"
            >
              Back
            </button>
            <button
              onClick={() => {
                const numericValue = parseInt(price.replace(/,/g, "")) || 0;

                if (!price || !bodyType || !seats) {
                  toast.error("Please fill all Details!");
                  return;
                }

                if (!price || numericValue < 50000) {
                  toast.error("Price must be at least ₹50,000");
                  return;
                }

                setShowOverlay(true);
              }}
              className="bg-[#24272C] text-white text-xs lg:text-sm font-semibold w-full py-1.5 lg:py-2 rounded-xs cursor-pointer active:scale-90"
            >
              Next
            </button>
          </div>
        </div>
      )}
      </div>

      {/* Overlay for Image Upload */}
      {showOverlay && (
        <ImageUploadOverlay
          onClose={() => setShowOverlay(false)}
          carDetailsSubmit={handleSubmit}
          defaultValues={defaultValues}
        />
      )}
    </div>
  );
}
