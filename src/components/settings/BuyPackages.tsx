// pages/settings/BuyPackages.tsx
import { X } from "lucide-react";
import React, { useState } from "react";

interface Plan {
  ads: string;
  price: number;
}

interface PackageSection {
  months: string;
  plans: Plan[];
}

const BuyPackages: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const packages: PackageSection[] = [
    {
      months: "3 Months",
      plans: [
        { ads: "1 Ad", price: 399 },
        { ads: "5 Ads", price: 1750 },
        { ads: "10 Ads", price: 2999 },
      ],
    },
    {
      months: "4 Months",
      plans: [{ ads: "50 Ads with 30 Days Featured", price: 12499 }],
    },
    {
      months: "6 Months",
      plans: [
        { ads: "125 Ads", price: 24999 },
        { ads: "250 Ads", price: 37499 },
        { ads: "500 Ads", price: 49999 },
      ],
    },
  ];

  // Find selected plan from id
  const getSelectedPlan = (): Plan | null => {
    if (!selected) return null;
    const [i, j] = selected.split("-").map(Number);
    return packages[i]?.plans[j] || null;
  };

  const selectedPlan = getSelectedPlan();
  const gst = selectedPlan ? Math.round(selectedPlan.price * 0.18) : 0;
  const total = selectedPlan ? selectedPlan.price * quantity + gst : 0;

  return (
    <>
      <div className="max-w-xl sm:max-w-full px-4 md:px-0 sm:mb-10 lg:">
        {/* Title */}
        <h2 className=" text-md md:text-2xl font-bold text-black py-2 lg:py-0">
          Buy Packages
        </h2>
        <p className=" hidden md:block text-gray-500 text-xs mt-2">
          Lorem Ipsum Dolor Sit Amet Consectetur. Adipisicing Morbi Tellu
        </p>

        {/* Sections */}
        <div className=" space-y-4 md:space-y-8 mt-2 md:mt-6">
          {packages.map((section, i) => (
            <div key={i}>
              <h3 className="text-[10px] md:text-base font-semibold">
                Post Ads & Features For{" "}
                <span className="text-red-500 text-[11px] md:text-base">
                  {section.months}
                </span>
              </h3>

              <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6 mt-2 md:mt-4">
                {section.plans.map((plan, j) => {
                  const id = `${i}-${j}`;
                  const isSelected = selected === id;
                  return (
                    <label
                      key={id}
                      className={`flex flex-col items-center rounded-xs md:rounded-sm p-2 md:p-4 packages-cards cursor-pointer transition bg-white ${
                        isSelected ? "border-gray-800 ring-2 ring-gray-800" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 w-full md:w-full md:px-2">
                        <span className="h-auto mt-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => setSelected(id)}
                            className="w-3 md:w-4 h-3 md:h-4 cursor-pointer accent-gray-800"
                          />
                        </span>
                        <p className="text-xs md:text-md md:text-center font-medium truncate whitespace-break-spaces">
                          {plan.ads}
                        </p>
                        <div className="h-1 w-1">&nbsp;</div>
                      </div>
                      <div className="w-full custom-dash my-2 "></div>
                      <p className="text-xs md:text-lg font-semibold">
                        ₹ {plan.price}/-
                      </p>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Pay button */}
        <button
          disabled={!selected}
          onClick={() => setShowModal(true)}
          className={`w-full mt-5 md:mt-10 py-3 rounded-xs md:rounded-sm font-semibold transition ${
            selected
              ? "bg-black hover:bg-black/90 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue to Pay
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-4 rounded-t-lg">
              <h2 className="text-sm md:text-lg font-semibold">
                Order Summary
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer hover:text-[#cb202d] active:scale-95 active:text-[#cb202d] transition-all duration-300 mr-2"
              >
                <X className="w-5 md:w-6 h-5 md:h-6" />
              </button>
            </div>

            <div className="pt-0 md:pt-4 p-4 space-y-2 md:space-y-4">
              {/* Package Row */}
              <div className="flex justify-between items-center border border-gray-400 rounded-xs md:rounded-sm p-3">
                <p className="text-xs md:text-sm font-medium">
                  {selectedPlan.ads}
                </p>
                <div className="flex items-center text-xs md:text-base space-x-2 border rounded-xs md:rounded-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="border-r px-2 cursor-pointer"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="border-l px-2 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs md:text-base font-semibold">
                  ₹ {selectedPlan.price}/-
                </p>
              </div>

              {/* Price Details */}
              <div className="border border-gray-400 rounded-xs md:rounded-sm p-3">
                <h3 className="text-sm md:text-base font-semibold mb-2">
                  Price Details
                </h3>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Price</span>
                  <span>₹ {selectedPlan.price * quantity}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>GST (18%)</span>
                  <span>₹ {gst}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-sm md:text-base font-semibold text-[#cb202d]">
                  <span>Total Amount</span>
                  <span>₹ {total}</span>
                </div>
              </div>

              {/* Final Pay Button */}
              <button className="w-full bg-[#cb202d] hover:bg-[#cb202d]/90 active:bg-[#cb202d]/90 active:scale-95 cursor-pointer text-white text-sm md:text-base font-semibold py-2 md:py-3 rounded-xs md:rounded-sm transition-all duration-300">
                Continue to Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BuyPackages;
