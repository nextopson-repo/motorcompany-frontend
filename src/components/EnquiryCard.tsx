import { Phone, MapPin, MessageCircle, EllipsisVertical, Eye } from "lucide-react";
import type { Enquiry } from "../store/slices/enqueriesSlice";
import { formatPriceToL, formatPriceToLakh } from "../utils/formatPrice";
import { useState, useRef, useEffect } from "react";

interface EnquiryCardProps {
  enquiry: Enquiry;
}

export default function EnquiryCard({ enquiry }: EnquiryCardProps){
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col rounded-sm md:rounded-md border border-gray-200 shadow-sm p-1 md:p-2 bg-white mb-4">
      <div className="flex h-full w-full">  
        {/*left Car Image */}
        <div className="h-fit w-28 md:w-48 flex-shrink-0 relative">
          <img
            src={enquiry.image || "/fallback-car-img.png"}
            alt={enquiry.carTitle}
            className="w-full h-22 md:h-36 object-cover rounded-xs md:rounded"
          />
        </div>

        {/*right Details + Owner */}
        <div className="w-full flex flex-col justify-between overflow-hidden">
          <div className="flex md:h-full md:justify-between">

            {/* Car Info */}
            <div className="flex-1 px-2 md:px-4 flex flex-col justify-between">
              <div className="space-y-1 md:space-y-2">
                <h3 className="font-bold text-xs md:text-sm text-gray-900">
                  {enquiry.carTitle}
                </h3>
                <p className="text-[9px] md:text-[10px] font-medium mt-1 leading-tight text-gray-700">
                  {enquiry.kmDriven} | {enquiry.carType} | {enquiry.mileage} |{" "}
                  {enquiry.fuelType} | {enquiry.transmission}
                </p>
                <div className="hidden text-[9px] md:text-[10px] font-medium lg:flex items-center mt-2 text-gray-700">
                  <MapPin className="w-3 md:w-[14px] h-3 md:h-[14px] mr-1" />
                  {enquiry.location}
                </div>
              </div>

              {/* Price + EMI (desktop) */}
              <div className="hidden md:block mt-3">
                <p className="font-bold text-sm md:text-lg text-gray-900">
                  Rs. {formatPriceToLakh(enquiry.price)}
                </p>
                <p className="text-[10px] text-gray-600 mt-1 flex items-center gap-1 font-medium">
                  <span><Eye className="h-3 w-3 text-orange-500"/></span> 100 Views
                </p>
              </div>
            </div>

            {/* Right Top Menu + Owner Info (desktop) */}
            <div className="h-full sm:w-[30vw] lg:w-[18vw] flex flex-col items-end justify-between">
              {/* 3-dot menu */}
              <div
                className="block md:hidden relative mt-1 md:mt-[6px]"
                ref={menuRef}
              >
                <EllipsisVertical
                  className="w-3 md:w-5 h-3 md:h-5 cursor-pointer"
                  onClick={() => setOpenMenu(!openMenu)}
                />
                {openMenu && (
                  <div className="absolute right-0 mt-2 w-28 md:w-40 bg-white border border-gray-100 rounded-xs md:rounded shadow-md z-50">
                    <div className="px-3 py-2 text-xs md:text-sm hover:bg-gray-200 cursor-pointer">
                      Save Enquiry
                    </div>
                    <div className="px-3 py-2 text-xs md:text-sm hover:bg-gray-200 cursor-pointer">
                      Share
                    </div>
                    <div className="px-3 py-2 text-xs md:text-sm hover:bg-gray-200 cursor-pointer text-red-500">
                      Delete
                    </div>
                  </div>
                )}
              </div>

              {/* Owner Section (desktop) */}
              <div className="hidden md:flex h-full w-full flex-col items-start justify-between bg-[#D9D9D933] p-2 rounded-xs">
                <div className="w-full space-y-2">
                  <div className="w-full flex items-center gap-2">
                  <img
                    src={enquiry.owner.avatar}
                    alt={enquiry.owner.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="w-full flex flex-col gap-1">
                    <span className="w-full flex items-center justify-between ">
                      <p className="text-xs font-bold">{enquiry.owner.name}</p>
                      <p className="text-[8px] text-gray-500">{enquiry.owner.timeAgo}</p>
                    </span>
                    <p className="text-[10px] text-gray-500">
                      {enquiry.owner.role}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] font-semibold text-gray-800 flex items-center">
                  <Phone className="w-3 h-3 mr-1" /> {enquiry.owner.phone}
                </p>
                <p className="text-[10px] font-semibold text-gray-800 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" /> {enquiry.owner.address}
                </p>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <button className="flex-1 bg-white text-black border border-gray-300 py-1 px-2 rounded-sm text-[10px] font-semibold flex items-center justify-center gap-2 hover:bg-black hover:text-white transition">
                    <Phone size={10} /> Call
                  </button>
                  <button className="flex-1 bg-white text-black border border-gray-300 py-1 px-2 rounded-sm text-[10px] font-semibold flex items-center justify-center gap-2 hover:bg-black hover:text-white transition">
                    <MessageCircle size={10} /> WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Row */}
          <div className="flex md:hidden items-center justify-between px-2 mt-2">
            {/* Location */}
            <div className="text-[8px] flex items-center text-gray-700">
              <MapPin className="w-[10px] h-[10px] mr-1" />
              {enquiry.location}
            </div>
            {/* Price */}
            <p className="font-bold text-xs text-gray-900">
              Rs. {formatPriceToL(enquiry.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Owner Actions */}
      <div className="block md:hidden">
        <div className="custom-dash py-1"></div>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <img
              src={enquiry.owner.avatar}
              alt={enquiry.owner.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col gap-[2px]">
              <p className="text-[10px] font-semibold">
                {enquiry.owner.name}
              </p>
              <span className="w-fit bg-gray-100 text-[7px] p-[1px] px-[3px] rounded-xs text-gray-500">
                {enquiry.owner.role}
              </span>
            </div>
          </div>
          <div className="flex gap-1 mr-1">
            <button className="bg-white border border-gray-300 px-[6px] py-[6px] md:py-1 rounded-sm text-[9px] flex items-center gap-1 hover:bg-black hover:text-white transition active:bg-black active:text-white active:scale-95">
              <Phone size={12} />
              <span className="hidden sm:block">Call</span>
            </button>
            <button className="bg-white border border-gray-300 px-[6px] py-[6px] md:py-1 rounded-sm text-[9px] flex items-center gap-1 hover:bg-black hover:text-white transition active:bg-black active:text-white active:scale-95">
              <MessageCircle size={12} />
              <span className="hidden sm:block">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { Phone, MapPin, MessageCircle } from "lucide-react";
// import type { Enquiry } from "../store/slices/enqueriesSlice";
// import { formatPriceToLakh } from "../utils/formatPrice";

// interface EnquiryCardProps {
//   enquiry: Enquiry;
// }

// export default function EnquiryCard({ enquiry }: EnquiryCardProps) {
//   return (
//     <div className="flex rounded-sm border border-gray-200 shadow-md p-1 md:p-2 mb-3 bg-amber-200">
//       {/* Car Image */}
//       <img
//         // src={enquiry.image}
//         src={"/fallback-car-img.png"}
//         alt={enquiry.carTitle}
//         className="w-28 md:w-56 h-24 md:h-40 object-cover rounded-xs md:rounded-sm"
//       />

//       {/* Car Details */}
//       <div className="flex-1 px-2 md:px-4 space-y-2">
//         <h2 className="md:max-w-68 font-bold text-xs md:text-md tracking-tight">
//           {enquiry.carTitle}
//         </h2>
//         <p className="text-[8px] md:text-[10px] text-black font-semibold">
//           {enquiry.kmDriven} | {enquiry.carType} | {enquiry.mileage} |{" "}
//           {enquiry.fuelType} | {enquiry.transmission}
//         </p>
//         <p className="hidden text-[8px] md:text-[10px] font-semibold md:flex items-center text-gray-900 mt-1">
//           <MapPin className="w-2 md:h-3 h-2 md:w-3 mr-1 text-black font-semibold" />{" "}
//           {enquiry.location}
//         </p>
//         <p className="hidden md:block text-xs md:text-md font-bold text-black mt-2">Rs.{formatPriceToLakh(enquiry.price)}</p>
//         <p className="hidden md:block text-[10px] text-black font-semibold">
//           EMI starts @ <span className="text-green-600">{enquiry.emi}</span>
//         </p>
//       </div>

//       {/* Owner Section */}
//       <div className="hidden w-56 py-4 px-1 md:flex flex-col justify-between">
//         <div className="flex items-center gap-2">
//           <img
//             src={enquiry.owner.avatar}
//             alt={enquiry.owner.name}
//             className="w-10 h-10 rounded-full"
//           />
//           <div className="w-full flex flex-col gap-1">
//             <span className="flex items-center justify-between gap-2">
//               <p className="text-xs font-bold max-w-28 truncate">{enquiry.owner.name}</p>
//               <p className="text-[7px] text-gray-400">
//                 {enquiry.owner.timeAgo}
//               </p>
//             </span>
//             <p className="text-xs text-gray-500">{enquiry.owner.role}</p>
//           </div>
//         </div>

//         <p className="text-[10px] font-semibold text-black flex items-center -mb-2"><Phone className="w-3 h-3 mr-1" />{enquiry.owner.phone}</p>
//         <p className="text-[10px] font-semibold text-black flex items-center"><MapPin className="w-3 h-3 mr-1"/> {enquiry.owner.address}</p>

//         <div className="flex gap-2 ">
//           <button className="flex-1 bg-white text-black border border-[#24272C] py-1 rounded-sm text-[10px] font-semibold flex items-center justify-center gap-1 hover:text-white hover:bg-[#24272C] transition-all duration-300 cursor-pointer">
//             <Phone size={10} /> Phone
//           </button>
//           <button className="flex-1 bg-white text-black border border-[#24272C] py-1 rounded-sm text-[10px] font-semibold flex items-center justify-center gap-1 hover:text-white hover:bg-[#24272C] transition-all duration-300 cursor-pointer">
//             <MessageCircle size={10} /> WhatsApp
//           </button>
//         </div>
//       </div>

//       {/* Mobile Owner Section */}
//     </div>
//   );
// }
