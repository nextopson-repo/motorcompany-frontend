// src/components/Enquiries.tsx
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import EnquiryCard from "../EnquiryCard";
import { Search } from "lucide-react";

export default function Enquiries() {
  const enquiries = useSelector(
    (state: RootState) => state.enquiries.enquiries
  );

  return (
    <div className="mx-auto -m-1 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
        <h1 className="text-md md:text-2xl text-[#24272C] font-bold py-3 md:py-0 md:flex">
          <span className="hidden md:block mr-2">My</span> Enquiries
        </h1>
        <div className="flex items-center gap-2">
          <span className="w-full md:w-68 flex items-center gap-2 bg-[#F2F3F7] text-xs px-2 rounded-xs ">
            <span>
              <Search className="text-black" size={14} />
            </span>
            <input
              type="text"
              placeholder="Search for Cars, Brands, Models..."
              className="w-full py-2 placeholder:text-xs placeholder:text-[#24272C] focus:outline-none"
            />
          </span>
          <select className="hidden md:block bg-[#24272C] text-white font-semibold text-xs rounded-xs px-3 py-2">
            <option>Sort By: Price - Low to High</option>
            <option>Sort By: Price - High to Low</option>
          </select>
        </div>
      </div>

      {enquiries.map((enquiry) => (
        <EnquiryCard key={enquiry.id} enquiry={enquiry} />
      ))}
    </div>
  );
}
