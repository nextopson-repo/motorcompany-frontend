import { Download, ChevronDown } from "lucide-react";
import React from "react";

interface PackageData {
  ads: string;
  date: string;
  validity: string;
  price: string;
  status: "Active" | "Expired";
}

const BoughtPackages: React.FC = () => {
  const data: PackageData[] = [
    {
      ads: "20 Ads",
      date: "17/09/2024",
      validity: "21/10/2025",
      price: "2,999/-",
      status: "Active",
    },
    {
      ads: "20 Ads",
      date: "17/09/2024",
      validity: "21/9/2025",
      price: "2,999/-",
      status: "Expired",
    },
    {
      ads: "20 Ads",
      date: "17/09/2024",
      validity: "21/9/2025",
      price: "2,999/-",
      status: "Expired",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Bought Packages</h2>
        </div>
        <div className="mt-3 sm:mt-0">
          <button className="flex items-center bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition">
            Sort By: Current Year <ChevronDown className="ml-2" size={16} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-md shadow-sm">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-black text-white text-sm text-center">
              <th className="p-4 whitespace-nowrap">Ad Quantity</th>
              <th className="p-4 whitespace-nowrap">Purchase Date</th>
              <th className="p-4 whitespace-nowrap">Validity</th>
              <th className="p-4 whitespace-nowrap">Price</th>
              <th className="p-4 whitespace-nowrap">Status</th>
              <th className="p-4 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
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
                  <button className="bg-black text-white px-6 py-1 text-xs rounded-sm cursor-pointer hover:bg-black/70 transition">
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
    </div>
  );
};

export default BoughtPackages;
