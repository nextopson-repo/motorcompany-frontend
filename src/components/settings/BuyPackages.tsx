// pages/settings/BuyPackages.tsx
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
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl font-bold text-black">Buy Packages</h2>
        <p className="text-gray-500 text-sm mt-1">
          Lorem Ipsum Dolor Sit Amet Consectetur. Adipisicing Morbi Tellu
        </p>

        {/* Sections */}
        <div className="space-y-8 mt-6">
          {packages.map((section, i) => (
            <div key={i}>
              <h3 className="text-base font-semibold">
                Post Ads & Features For{" "}
                <span className="text-red-500">{section.months}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {section.plans.map((plan, j) => {
                  const id = `${i}-${j}`;
                  const isSelected = selected === id;
                  return (
                    <label
                      key={id}
                      className={`flex flex-col items-center rounded-lg p-4 shadow-sm cursor-pointer transition bg-white ${
                        isSelected ? "border-gray-800 ring-2 ring-gray-800" : ""
                      }`}
                    >
                      <div className="flex items-center w-full px-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => setSelected(id)}
                          className="w-5 h-5 cursor-pointer accent-gray-800"
                        />
                        <p className="w-full font-medium text-center">{plan.ads}</p>
                      </div>
                      <div className="w-full custom-dash my-2 "></div>
                      <p className="text-lg font-semibold">₹ {plan.price}/-</p>
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
          className={`w-full mt-10 py-3 rounded-lg font-semibold transition ${
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
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <button onClick={() => setShowModal(false)} className="text-2xl cursor-pointer hover:text-[#cb202d] transition-all duration-300 mr-2">
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Package Row */}
              <div className="flex justify-between items-center border border-gray-400 rounded p-3">
                <p className="text-sm font-medium">{selectedPlan.ads}</p>
                <div className="flex items-center space-x-2 border rounded">
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
                <p className="font-semibold">₹ {selectedPlan.price}/-</p>
              </div>

              {/* Price Details */}
              <div className="border border-gray-400 rounded p-3">
                <h3 className="font-semibold mb-2">Price Details</h3>
                <div className="flex justify-between text-sm">
                  <span>Price</span>
                  <span>₹ {selectedPlan.price * quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST (18%)</span>
                  <span>₹ {gst}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-[#cb202d]">
                  <span>Total Amount</span>
                  <span>₹ {total}</span>
                </div>
              </div>

              {/* Final Pay Button */}
              <button className="w-full bg-[#cb202d] hover:bg-[#cb202d]/90 cursor-pointer text-white font-semibold py-3 rounded-lg transition">
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
