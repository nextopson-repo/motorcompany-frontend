import { Download } from "lucide-react";
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
      validity: "21/10/2025",
      price: "2,999/-",
      status: "Expired",
    },
    {
      ads: "20 Ads",
      date: "17/09/2024",
      validity: "21/10/2025",
      price: "2,999/-",
      status: "Expired",
    },
  ];

  return (
    <div className="p-2">
      {/* Title */}
      <h2 className="text-2xl font-bold text-black">Bought Packages</h2>
      <p className="text-gray-500 text-sm mt-1">
        Lorem Ipsum Dolor Sit Amet Consectetur. Adipiscing Morbi Tellu
      </p>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-md shadow-sm pb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#cb202d] text-white text-sm">
              <th className="p-3 text-left">Ad Quantity</th>
              <th className="p-3 text-left">Purchase Date</th>
              <th className="p-3 text-left">Validity</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="relative text-sm text-gray-700 last:after:hidden
             after:content-[''] after:absolute after:bottom-0 
             after:left-2 after:right-2 after:h-[1.5px] 
             after:bg-gradient-to-r
             after:from-[#cb202d]/0 after:via-[#cb202d] after:to-[#cb202d]/0"
              >
                <td className="p-3">{row.ads}</td>
                <td className="p-3">{row.date}</td>
                <td className="p-3">{row.validity}</td>
                <td className="p-3">{row.price}</td>
                <td className="p-3">
                  {row.status === "Active" ? (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full inline-flex items-center">
                      ● Active
                    </span>
                  ) : (
                    <span className="text-red-600 text-xs font-medium inline-flex items-center">
                      ● Expired
                    </span>
                  )}
                </td>
                <td className="p-3 space-x-2 flex items-center">
                  <button className="bg-[#cb202d] text-white px-4 py-1 text-sm rounded-md hover:bg-[#a51a24] transition cursor-pointer">
                    Renew
                  </button>
                  <button className="bg-white text-[#cb202d] border border-[#cb202d] px-4 py-1 text-sm rounded-md hover:bg-[#cb202d]/10 transition cursor-pointer flex gap-2 items-center">
                    <Download size={16} /> invoice
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
