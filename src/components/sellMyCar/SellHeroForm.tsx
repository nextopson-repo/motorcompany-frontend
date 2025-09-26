import { useState } from "react";
import { Upload, ChevronDown, Search, X } from "lucide-react";

// ---------- Dropdown ----------

interface DropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (v: string) => void;
}

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
      <label className="text-xs lg:text-sm">{label}</label>
      <div
        onClick={onToggle}
        className="relative w-full flex items-center border border-gray-200 rounded-sm px-3 py-[6px] lg:py-2 mt-[2px] lg:mt-1 text-[10px] lg:text-xs cursor-pointer bg-white"
      >
        <Search className="w-3 lg:w-[14px] h-3 lg:h-[14px] text-red-500 mr-2" strokeWidth={1.2}/>
        <span className="text-[10px] flex-1 text-gray-600">{value || placeholder}</span>
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

// ---------- Brand → Model → Variant Data ----------
const carData: Record<string, { model: string; variants: string[] }[]> = {
  Hyundai: [
    { model: "i20", variants: ["Magna", "Sportz", "Asta", "Asta (O)"] },
    { model: "Creta", variants: ["E", "S", "SX", "SX(O)"] },
    { model: "Venue", variants: ["S", "SX", "SX(O)"] },
  ],
  "Maruti Suzuki": [
    { model: "Swift", variants: ["LXI", "VXI", "ZXI", "ZXI+"] },
    { model: "Baleno", variants: ["Sigma", "Delta", "Zeta", "Alpha"] },
    { model: "Dzire", variants: ["LXI", "VXI", "ZXI"] },
  ],
  Honda: [
    { model: "City", variants: ["V", "VX", "ZX"] },
    { model: "Amaze", variants: ["E", "S", "VX"] },
  ],
  Toyota: [
    { model: "Innova Crysta", variants: ["GX", "VX", "ZX"] },
    { model: "Fortuner", variants: ["2.7 Petrol", "2.8 Diesel"] },
  ],
  Mahindra: [
    { model: "XUV700", variants: ["MX", "AX3", "AX5", "AX7"] },
    { model: "Thar", variants: ["AX", "LX Diesel", "LX Petrol"] },
  ],
  Kia: [
    { model: "Seltos", variants: ["HTE", "HTK", "HTX", "GTX+"] },
    { model: "Sonet", variants: ["HTE", "HTK+", "GTX+"] },
  ],
  "Tata Motors": [
    { model: "Nexon", variants: ["XE", "XM", "XZ", "XZ+"] },
    { model: "Harrier", variants: ["XE", "XM", "XZ"] },
  ],
  "MG Motors": [
    { model: "Hector", variants: ["Style", "Smart", "Sharp"] },
    { model: "ZS EV", variants: ["Excite", "Exclusive"] },
  ],
  Renault: [
    { model: "Kwid", variants: ["RXE", "RXL", "RXT"] },
    { model: "Triber", variants: ["RXE", "RXL", "RXT"] },
  ],
  Skoda: [
    { model: "Kushaq", variants: ["Active", "Ambition", "Style"] },
    { model: "Slavia", variants: ["Active", "Ambition", "Style"] },
  ],
};

// ---------- Upload Overlay ----------
function UploadOverlay({
  onClose,
  onSubmit,
  defaultValues,
}: {
  onClose: () => void;
  onSubmit: () => void;
  defaultValues: {
    brand?: string;
    model?: string;
    variant?: string;
    manufacturingYear?: string | number;
    fuelType?: string;
    transmission?: string;
    bodyType?: string;
    ownership?: string;
    price?: number | string;
    kmDriven?: number | string;
    seats?: number | string;
  } | null;
}) {
  const isEdit = !!defaultValues;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center lg:justify-end z-50 overflow-hidden">
      <div className="bg-white rounded-sm p-7 pt-10 max-w-[350px] relative shadow-lg lg:mr-12">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>

        {!isEdit ? (
          <div className="border-2 rounded-sm border-dashed border-gray-800 rounded-sm-lg px-6 py-4 flex flex-col items-center justify-center">
            <Upload className="w-7 lg:w-10 h-7 lg:h-10 text-gray-500 mb-2" />
            <p className=" text-xs lg:text-sm">Choose a file or drag & drop it here</p>
            <p className="text-[10px] lg:text-xs text-gray-700 mb-3">
              jpeg, jpg and png formats, up to 20 MB
            </p>
            <button className="border px-6 py-1 text-[10px] lg:text-xs rounded-xs cursor-pointer text-black hover:bg-gray-200 hover:scale-[1.1] active:scale-95 active:bg-gray-200">
              Upload
            </button>
          </div>
        ) : (
          <div className="rounded-sm-lg py-4 flex flex-col items-center justify-center">
            <p className=" text-xs lg:text-sm">Choose a file or drag & drop it here</p>
            <p className="text-[10px] lg:text-sm">
              Click on "Update Car Details" to save the changes
            </p>
          </div>
        )}

        <button
          onClick={onSubmit}
          className="w-full bg-black text-white text-xs lg:text-sm py-2 rounded-xs mt-4 hover:bg-black/80 active:bg-black/80 active:scale-95"
        >
          {defaultValues ? "Update Car Details" : "Post Car"}
        </button>
      </div>
    </div>
  );
}

// ---------- Realistic Dropdown Data ----------
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

// ---------- Main Form ----------
export default function SellHeroForm({
  onBack,
  onSubmit,
  defaultValues,
}: {
  onBack: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
  defaultValues: {
    brand?: string;
    model?: string;
    variant?: string;
    manufacturingYear?: string | number;
    fuelType?: string;
    transmission?: string;
    bodyType?: string;
    ownership?: string;
    price?: number | string;
    kmDriven?: number | string;
    seats?: number | string;
    registrationYear?: string | number;
  } | null;
}) {
  // const isEdit = !!defaultValues;
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState(defaultValues?.brand || "");
  const [model, setModel] = useState(defaultValues?.model || "");
  const [variant, setVariant] = useState(defaultValues?.variant || "");
  const [manufactureYear, setManufactureYear] = useState(
    defaultValues?.manufacturingYear || ""
  );

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const modelOptions =
    brand && carData[brand] ? carData[brand].map((m) => m.model) : [];
  const variantOptions =
    brand && model
      ? carData[brand].find((m) => m.model === model)?.variants || []
      : [];

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
  // const [success, setSuccess] = useState(false);

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

  const handleSubmit = async () => {
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
    };
    onSubmit(payload);

    try {
      setShowOverlay(false);
    } catch (error) {
      console.error("❌ Error submitting car:", error);
      alert("Failed to create car");
    }
  };

  return (
    <div
      className="bg-white overflow-y-auto
        [&::-webkit-scrollbar]:w-[0px]
      [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:bg-gray-300"
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
        <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2"></div>

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
        <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2"></div>

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

      <h2 className="text-xs lg:text-md font-semibold mb-1 lg:mb-4">Enter Car Details</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-2 relative">
          <Dropdown
            label="Brand"
            placeholder="Search car brand"
            // options={brandOptions}
            options={Object.keys(carData)}
            isOpen={openDropdown === "brand"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "brand" ? null : "brand")
            }
            onChange={(val) => {
              setBrand(val);
              setModel("");
              setVariant("");
            }}
            value={brand}
            // onChange={setBrand}
          />
          <Dropdown
            label="Model"
            placeholder="Search car model"
            options={modelOptions}
            value={model}
            isOpen={openDropdown === "model"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "model" ? null : "model")
            }
            onChange={(val) => {
              setModel(val);
              setVariant("");
            }}
            // onChange={setModel}
          />
          <Dropdown
            label="Variant"
            placeholder="Search car variant"
            options={variantOptions}
            value={variant}
            isOpen={openDropdown === "variant"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "variant" ? null : "variant")
            }
            onChange={setVariant}

            // onChange={setVariant}
          />
          <div>
            <label className="text-xs lg:text-sm">Manufacturing Year</label>
            <input
              type="text"
              value={manufactureYear}
              onChange={(e) => setManufactureYear(e.target.value)}
              placeholder="2000"
              className="w-full border border-gray-200 rounded-sm px-3 py-[6px] lg:py-2 mt-[2px] lg:mt-1 text-[10px] lg:text-[10px]"
            />
          </div>
          <div className="flex justify-between pt-1 lg:pt-2 gap-3">
            {defaultValues? "" : 
            <button
              onClick={onBack}
              className="bg-gray-50 text-gray-400 border border-gray-200 text-xs lg:text-sm  px-6 py-[6px] lg:py-2 rounded-xs cursor-pointer active:scale-90"
            >
              Back
            </button>}
            <button
              onClick={nextStep}
              className="bg-[#24272C] text-white text-xs lg:text-sm font-semibold w-full py-[6px] lg:py-2 rounded-xs cursor-pointer active:scale-90"
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
            <label htmlFor="fuelType" className="text-xs lg:text-sm">
              Fuel Type
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2 lg:mb-4 text-[10px] lg:text-xs mt-1">
              {fuelTypeOptions.map((fuel) => (
                <button
                  key={fuel}
                  onClick={() => setFuelType(fuel)}
                  className={`flex-1 py-[6px] rounded-xs ${
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
            <label htmlFor="transmission" className="text-xs lg:text-sm">
              Transmission
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2 lg:mb-4 text-[10px] lg:text-xs mt-[2px] lg:mt-1">
              {transmissionOptions.map((trans) => (
                <button
                  key={trans}
                  onClick={() => setTransmission(trans)}
                  className={`flex-1 py-[6px] rounded-xs ${
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
            <label className="text-xs lg:text-sm">KM Driven</label>
            <input
              type="text"
              placeholder="50000km"
              value={kmDriven}
              onChange={(e) => setKmDriven(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-[6px] lg:py-2 mt-[2px] lg:mt-1 text-[10px] lg:text-[10px]"
            />
          </div>

          <div>
            <label className="text-xs lg:text-sm">Registration Year</label>
            <input
              type="text"
              placeholder="Enter Registration Year"
              value={registrationYear}
              onChange={(e) => setRegistrationYear(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-[6px] lg:py-2 mt-[2px] lg:mt-1 text-[10px] lg:text-[10px]"
            />
          </div>

          <div className="flex justify-between pt-1 lg:pt-2 gap-3">
            <button
              onClick={prevStep}
              className="bg-gray-50 text-gray-400 border border-gray-200 text-xs lg:text-sm  px-6 py-[6px] lg:py-2 rounded-xs cursor-pointer active:scale-90"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="bg-[#24272C] text-white text-xs lg:text-sm font-semibold w-full py-[6px] lg:py-2 rounded-xs cursor-pointer active:scale-90"
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
            <label className="text-xs lg:text-sm">No. of Seats</label>
            <input
              type="number"
              placeholder="5"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-[6px] lg:py-2 mt-[2px] lg:mt-1 text-[10px] lg:text-[10px]"
            />
          </div>

          <div>
            <label className="text-xs lg:text-sm">Ownership</label>
            <div className="grid grid-cols-4 gap-2 mb-1 lg:mb-2 text-[10px] lg:text-xs mt-[2px] lg:mt-1">
              {ownershipOptions.map((own) => (
                <button
                  key={own}
                  onClick={() => setOwnership(own)}
                  className={`py-[6px] rounded-xs ${
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
            <label className="text-xs lg:text-sm">Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(formatPrice(e.target.value))}
              placeholder="10,00,000"
              className="w-full border border-gray-300 rounded-sm px-3 py-[6px] lg:py-2 mt-[2px] lg:mt-1 text-[10px] lg:text-[10px]"
            />
          </div>

          <div className="flex justify-between pt-1 lg:pt-2 gap-3">
            <button
              onClick={prevStep}
              className="bg-gray-50 text-gray-400 border border-gray-200 text-xs lg:text-sm  px-6 py-[6px] lg:py-2 rounded-xs cursor-pointer active:scale-90"
            >
              Back
            </button>
            <button
              onClick={() => setShowOverlay(true)}
              className="bg-[#24272C] text-white text-xs lg:text-sm font-semibold w-full py-[6px] lg:py-2 rounded-xs cursor-pointer active:scale-90"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showOverlay && (
        <UploadOverlay
          onClose={() => setShowOverlay(false)}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
        />
      )}
    </div>
  );
}
