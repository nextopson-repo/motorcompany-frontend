import { Download, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/redux/hooks";
import {
  renewPackage,
  setSortBy,
  selectSortedPackages,
  parseDate,
} from "../../store/slices/boughtPackagesSlice";
import { differenceInDays, format } from "date-fns";

function getDaysLeft(validity: string) {
  const [day, month, year] = validity.split("/").map(Number);
  const expiryDate = new Date(year, month - 1, day);
  const today = new Date();
  return differenceInDays(expiryDate, today);
}

const sortOptions = [
  { value: "currentYear", label: "Current Year" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
] as const;

const BoughtPackages: React.FC = () => {
  const dispatch = useAppDispatch();
  const packages = useAppSelector(selectSortedPackages);
  const sortBy = useAppSelector((state) => state.boughtPackages.sortBy);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value as any));
    setDropdownOpen(false);
  };

  return (
    <div className="w-full lg:w-3xl mx-auto bg-white rounded-lg shadow-none md:shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center my-2 md:my-0 md:mb-4 px-4 md:px-0">
        <h2 className="text-md md:text-2xl font-bold text-black">
          Bought Packages
        </h2>

        {/* Desktop Sort Dropdown */}
        <div className="hidden md:block relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Sort By: {sortOptions.find((s) => s.value === sortBy)?.label}
            <ChevronDown className="ml-2" size={16} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40 z-10">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSortChange(opt.value)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    sortBy === opt.value
                      ? "font-medium text-black"
                      : "text-gray-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Sort Select */}
        {/* <div className="md:hidden mt-2">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-md shadow-sm">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-black text-white text-sm text-center">
              <th className="p-4">Ad Quantity</th>
              <th className="p-4">Purchase Date</th>
              <th className="p-4">Validity</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((row) => (
              <tr
                key={row.id}
                className="text-xs text-gray-700 border-b border-gray-300 last:border-0"
              >
                <td className="p-3 text-center">{row.ads}</td>
                <td className="p-3 text-center">{row.date}</td>
                <td className="p-3 text-center">{row.validity}</td>
                <td className="p-3 text-center">{row.price}</td>
                <td className="p-3 text-center">
                  {row.status === "Active" ? (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full inline-flex items-center">
                      ● Active
                    </span>
                  ) : (
                    <span className="text-red-500 text-xs font-medium px-2 py-1 inline-flex items-center">
                      ● Expired
                    </span>
                  )}
                </td>
                <td className="p-4 space-x-2 flex flex-wrap justify-center items-center">
                  <button
                    onClick={() => dispatch(renewPackage(row.id))}
                    className="bg-black text-white px-6 py-1 text-xs rounded-sm cursor-pointer hover:bg-black/70 transition"
                  >
                    Renew
                  </button>
                  <button className="bg-white text-black border border-black px-4 py-1 text-xs rounded-sm cursor-pointer hover:bg-black/70 hover:text-white transition flex items-center gap-2">
                    <Download size={16} /> Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      {/* <div className="md:hidden space-y-4 p-3">
        {packages.map((row) => (
          <div key={row.id} className="border border-gray-300 rounded-md p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-sm">{row.ads}</h3>
              {row.status === "Active" ? (
                <span className="text-green-600 text-xs font-medium">● Active</span>
              ) : (
                <span className="text-red-500 text-xs font-medium">● Expired</span>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-1">
              <strong>Purchase Date:</strong> {row.date}
            </p>
            <p className="text-xs text-gray-600 mb-1">
              <strong>Validity:</strong> {row.validity}
            </p>
            <p className="text-xs text-gray-600 mb-3">
              <strong>Price:</strong> ₹ {row.price}
            </p>
            <div className="flex justify-between gap-2">
              <button
                onClick={() => dispatch(renewPackage(row.id))}
                className="bg-black text-white px-3 py-1 text-xs rounded-sm hover:bg-black/70 transition"
              >
                Renew
              </button>
              <button className="flex items-center gap-1 border border-black px-3 py-1 text-xs rounded-sm hover:bg-black/70 hover:text-white transition">
                <Download size={14} /> Invoice
              </button>
            </div>
          </div>
        ))}
      </div> */}

      {/* Mobile Cards - Match Given UI */}
      <div className="md:hidden space-y-4 px-4">
        {/* {packages.map((row, index) => ( */}
        {packages.map((row) => (
          <div key={row.id}>
            {/* Title */}
            <h3 className="text-[10px] font-semibold mb-1 px-2">
              {/* {index === 0 ? "This Month" : "July"} */}
               {format(parseDate(row.date), "MMMM yyyy")}
            </h3>

            <div className="border border-gray-200 rounded-md p-2 shadow-sm">
              <div className="grid grid-cols-2 items-start mb-3">
                {/* Left Section */}
                <div>
                  <p className="text-xs text-black py-1">Ads</p>
                  <p className="text-sm font-semibold text-black">{row.ads}</p>
                  <p className="text-[10px] text-gray-600 mt-2">
                    left of 500 ads
                  </p>
                </div>

                {/* Right Section */}
                <div className="">
                  <div>
                    <span className="flex items-center justify-between py-1">
                      <p className="text-xs text-black h-full">Plan</p>
                      {row.status === "Active" ? (
                        <span className="bg-green-100 text-green-700 text-[10px] font-medium px-[5px] py-auto rounded-xs inline-flex items-center">
                          ● Active
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-600 text-[10px] font-medium px-[5px] py-auto rounded-xs inline-flex items-center">
                          ● Expired
                        </span>
                      )}
                    </span>
                    <p className="text-sm font-semibold text-black">
                      ₹ {row.price}
                    </p>

                    <p className="text-[10px] text-gray-500 mt-2">
                    {getDaysLeft(row.validity) > 0
                      ? `${getDaysLeft(row.validity)} days left`
                      : "Expired"}
                  </p>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <span className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-blue-500 font-medium">
                  Purchase Date{" "}
                  <span className="font-medium text-black">{row.date}</span>
                </p>

                {row.status === "Active" ? (
                  <p className="text-[10px] text-green-600 font-semibold">
                    Validity up to{" "}
                    <span className="font-medium text-black">
                      {row.validity}
                    </span>
                  </p>
                  
                ) : (
                  <p className="text-[10px] text-gray-600 font-semibold">
                    Expired on{" "}
                    <span className="font-medium text-black">
                      {row.validity}
                    </span>
                  </p>
                )}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => dispatch(renewPackage(row.id))}
                  className="flex-1 bg-black text-white py-[6px] text-xs rounded-sm hover:bg-black/80 transition"
                >
                  Renew
                </button>
                <button className="flex-1 border border-black py-[6px] text-xs rounded-sm flex items-center justify-center gap-1 hover:bg-black hover:text-white transition">
                  <Download size={14} /> Invoice
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoughtPackages;

// import { Download, ChevronDown } from "lucide-react";
// import React from "react";

// interface PackageData {
//   ads: string;
//   date: string;
//   validity: string;
//   price: string;
//   status: "Active" | "Expired";
// }

// const BoughtPackages: React.FC = () => {
//   const data: PackageData[] = [
//     {
//       ads: "20 Ads",
//       date: "17/09/2024",
//       validity: "21/10/2025",
//       price: "2,999/-",
//       status: "Active",
//     },
//     {
//       ads: "20 Ads",
//       date: "17/09/2024",
//       validity: "21/9/2025",
//       price: "2,999/-",
//       status: "Expired",
//     },
//     {
//       ads: "20 Ads",
//       date: "17/09/2024",
//       validity: "21/9/2025",
//       price: "2,999/-",
//       status: "Expired",
//     },
//   ];

//   return (
//     <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-none md:shadow-md">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center my-2 md:my-0 md:mb-4 px-4 md:px-0">
//         <div>
//           <h2 className="text-md md:text-2xl font-bold text-black">Bought Packages</h2>
//         </div>
//         <div className="hidden md:block mt-3 sm:mt-0">
//           <button className="flex items-center bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition">
//             Sort By: Current Year <ChevronDown className="ml-2" size={16} />
//           </button>
//         </div>
//       </div>

//       {/*Desktop Table Container */}
//       <div className="hidden md:block overflow-x-auto rounded-md shadow-sm">
//         <table className="min-w-full table-auto border-collapse">
//           <thead>
//             <tr className="bg-black text-white text-sm text-center">
//               <th className="p-4 whitespace-nowrap">Ad Quantity</th>
//               <th className="p-4 whitespace-nowrap">Purchase Date</th>
//               <th className="p-4 whitespace-nowrap">Validity</th>
//               <th className="p-4 whitespace-nowrap">Price</th>
//               <th className="p-4 whitespace-nowrap">Status</th>
//               <th className="p-4 whitespace-nowrap">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, idx) => (
//               <tr
//                 key={idx}
//                 className="text-xs text-gray-700 border-b border-gray-300 last:border-0"
//               >
//                 <td className="p-3 text-center">{row.ads}</td>
//                 <td className="p-3 text-center">{row.date}</td>
//                 <td className="p-3 text-center">{row.validity}</td>
//                 <td className="p-3 text-center">{row.price}</td>
//                 <td className="p-3 text-center">
//                   {row.status === "Active" ? (
//                     <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full inline-flex items-center">
//                       ● Active
//                     </span>
//                   ) : (
//                     <span className="text-red-500 text-xs font-medium px-2 py-1 inline-flex items-center">
//                       ● Expired
//                     </span>
//                   )}
//                 </td>
//                 <td className="p-4 space-x-2 flex flex-wrap justify-center items-center">
//                   <button className="bg-black text-white px-6 py-1 text-xs rounded-sm cursor-pointer hover:bg-black/70 transition">
//                     Renew
//                   </button>
//                   <button className="bg-white text-black border border-black px-4 py-1 text-xs rounded-sm cursor-pointer hover:bg-black/70 hover:text-white transition flex items-center gap-2">
//                     <Download size={16} /> Invoice
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Table Container */}
//     </div>
//   );
// };

// export default BoughtPackages;
