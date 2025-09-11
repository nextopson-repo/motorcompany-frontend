import { useState } from "react";
import { Upload, ChevronDown, Search, X } from "lucide-react";

// ---------- Dropdown ----------

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
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full relative">
      <label className="text-sm">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full flex items-center border border-gray-300 rounded px-3 py-2 mt-1 text-xs cursor-pointer bg-white"
      >
        <Search className="w-4 h-4 text-red-500 mr-2" />
        <span className="flex-1 text-gray-600">
          {selected || value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div className="mt-1 border border-gray-400 rounded shadow bg-white absolute z-10 w-full max-h-40 overflow-y-auto text-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full border-b border-gray-400 px-2 py-1 outline-none"
          />
          {filtered.length > 0 ? (
            filtered.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  setSelected(opt);
                  onChange(opt);
                  setIsOpen(false);
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50">
      <div className="bg-white rounded-lg p-7 pt-10 max-w-[350px] relative shadow-lg mr-12">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>

        {!isEdit ? (
          <div className="border-2 border-dashed border-gray-800 rounded-lg px-6 py-4 flex flex-col items-center justify-center">
            <Upload className="w-10 h-10 text-gray-500 mb-2" />
            <p className="text-sm">Choose a file or drag & drop it here</p>
            <p className="text-xs text-gray-700 mb-3">
              jpeg, jpg and png formats, up to 20 MB
            </p>
            <button className="border px-6 py-1 text-xs rounded cursor-pointer text-black hover:scale-[1.1]">
              Upload
            </button>
          </div>
        ) : (
          <div className="rounded-lg py-4 flex flex-col items-center justify-center">
            <p className="text-sm">
              Click on "Update Car Details" to save the changes
            </p>
          </div>
        )}

        <button
          onClick={onSubmit}
          className="w-full bg-black text-white text-sm py-2 rounded mt-4"
        >
          {defaultValues ? "Update Car Details" : "Post Car"}
        </button>
      </div>
    </div>
  );
}

// ---------- Success Overlay ----------

function SuccessOverlay() {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
        <img
          src="/sellPage/success.gif"
          alt="success"
          className="w-24 h-24 mb-3"
        />
        <p className="text-lg font-medium">Car submitted successfully!</p>
      </div>
    </div>
  );
}

// ---------- Realistic Dropdown Data ----------

const brandOptions = [
  "Hyundai",
  "Maruti Suzuki",
  "Honda",
  "Toyota",
  "Mahindra",
  "Kia",
  "Tata Motors",
  "MG Motors",
  "Renault",
  "Skoda",
];

const modelOptions = [
  "i20",
  "Creta",
  "Venue",
  "Baleno",
  "Swift",
  "Dzire",
  "City",
  "Amaze",
  "Innova Crysta",
  "Fortuner",
];

const variantOptions = [
  "V",
  "VX",
  "ZX",
  "SX",
  "SX(O)",
  "VXI",
  "ZXI",
  "VX Plus",
  "G",
  "GT Line",
];

const fuelTypeOptions = ["Petrol", "Diesel", "CNG", "Electric"];

const transmissionOptions = ["Manual", "Automatic"];

const bodyTypeOptions = [
  "SUV",
  "Sedan",
  "Hatchback",
  "MUV",
  "Coupe",
  "Convertible",
  "Crossover",
];

const ownershipOptions = ["1st", "2nd", "3rd", "3+"];

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
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
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
      <div className="w-full flex items-center justify-between mb-4">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex-1 flex items-center">
            <div
              className={`w-5 h-5 shadow-2xl rounded-full flex items-center justify-center text-sm font-medium ${
                step === num
                  ? "bg-black text-white"
                  : "bg-white border border-gray-100 text-gray-500"
              }`}
            >
              {num}
            </div>
            {num !== 3 && (
              <div className="w-full flex-1 border-t-2 border-dashed border-gray-300 mx-1" />
            )}
          </div>
        ))}
      </div>

      <h2 className="text-md font-semibold mb-4">Enter Car Details</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-2 relative">
          <Dropdown
            label="Brand"
            placeholder="Search car brand"
            options={brandOptions}
            value={brand}
            onChange={setBrand}
          />
          <Dropdown
            label="Model"
            placeholder="Search car model"
            options={modelOptions}
            value={model}
            onChange={setModel}
          />
          <Dropdown
            label="Variant"
            placeholder="Search car variant"
            options={variantOptions}
            value={variant}
            onChange={setVariant}
          />
          <div>
            <label className="text-sm">Manufacturing Year</label>
            <input
              type="text"
              value={manufactureYear}
              onChange={(e) => setManufactureYear(e.target.value)}
              placeholder="2000"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-xs"
            />
          </div>
          <div className="flex justify-between pt-2">
            <button
              onClick={onBack}
              className="bg-gray-200 text-black text-xs px-6 py-2 rounded"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="bg-black text-white text-xs px-6 py-2 rounded"
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
            <label htmlFor="fuelType" className="text-sm">
              Fuel Type
            </label>
            <div className="grid grid-cols-4 gap-2 mb-4 text-xs mt-1">
              {fuelTypeOptions.map((fuel) => (
                <button
                  key={fuel}
                  onClick={() => setFuelType(fuel)}
                  className={`flex-1 py-[6px] rounded ${
                    fuelType === fuel
                      ? "bg-gray-800 text-white font-medium"
                      : "bg-white border border-gray-300 text-gray-600"
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="transmission" className="text-sm">
              Transmission
            </label>
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs mt-1">
              {transmissionOptions.map((trans) => (
                <button
                  key={trans}
                  onClick={() => setTransmission(trans)}
                  className={`flex-1 py-[6px] rounded ${
                    transmission === trans
                      ? "bg-gray-800 text-white font-medium"
                      : "bg-white border border-gray-300 text-gray-600"
                  }`}
                >
                  {trans}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm">KM Driven</label>
            <input
              type="text"
              placeholder="50000km"
              value={kmDriven}
              onChange={(e) => setKmDriven(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-xs"
            />
          </div>

          <div>
            <label className="text-sm">Registration Year</label>
            <input
              type="text"
              placeholder="Enter Registration Year"
              value={registrationYear}
              onChange={(e) => setRegistrationYear(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-xs"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={prevStep}
              className="bg-gray-200 text-black text-xs px-6 py-2 rounded"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="bg-black text-white text-xs px-6 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-3">
          <div>
            <label className="text-sm">No. of Seats</label>
            <input
              type="number"
              placeholder="5"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-xs"
            />
          </div>

          <div>
            <label className="text-sm">Ownership</label>
            <div className="grid grid-cols-4 gap-2 mb-2 text-xs mt-1">
              {ownershipOptions.map((own) => (
                <button
                  key={own}
                  onClick={() => setOwnership(own)}
                  className={`py-[6px] rounded ${
                    ownership === own
                      ? "bg-gray-800 text-white font-medium"
                      : "bg-white border border-gray-300 text-gray-600"
                  }`}
                >
                  {own}
                </button>
              ))}
            </div>
          </div>

          <Dropdown
            label="Body Type"
            placeholder="Select body type"
            options={bodyTypeOptions}
            value={bodyType}
            onChange={setBodyType}
          />

          <div>
            <label className="text-sm">Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(formatPrice(e.target.value))}
              placeholder="10,00,000"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-xs"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={prevStep}
              className="bg-gray-200 text-black text-xs px-6 py-2 rounded"
            >
              Back
            </button>
            <button
              onClick={() => setShowOverlay(true)}
              className="bg-black text-white text-xs px-6 py-2 rounded "
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

      {success && <SuccessOverlay />}
    </div>
  );
}