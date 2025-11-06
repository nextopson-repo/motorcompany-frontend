import {
  Phone,
  MapPin,
  MessageCircle,
  EllipsisVertical,
  Eye,
} from "lucide-react";
import type { CarDetails, Enquiry } from "../store/slices/enqueriesSlice";
import { formatPriceToL, formatPriceToLakh, formatShortNumber } from "../utils/formatPrice";
import { useState, useRef, useEffect } from "react";

interface EnquiryCardProps {
  enquiry: Enquiry;
  car?: CarDetails;
}

export default function EnquiryCard({ enquiry }: EnquiryCardProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const car = enquiry.carDetails;
  console.log(enquiry);
  // const carOwner = enquiry.

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // share profile link
    const handleShareCar = async () => {
      const profileUrl = `${window.location.origin}/buy-car/${car.id}`;
  
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Check out this Enquiry on Dhikcar",
            text: `Check out ${enquiry?.DealerName}'s Car`,
            url: profileUrl,
          });
        } catch (error) {
          console.log("Error sharing:", error);
        }
      } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(profileUrl);
        alert("Car link copied to clipboard!");
      }
    };
  
    // check is mobile or desktop
    function isMobile() {
      return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
  
    const handlePhoneClick = async () => {
      try {
        console.log("📞 Phone button clicked");
  
        // 🔹 2. Initiate call or WhatsApp
        const phoneDigits = enquiry?.mobileNumber?.replace(/[^+\d]/g, "");
        if (!phoneDigits) return;
  
        if (isMobile()) {
          window.location.href = `tel:${phoneDigits}`;
        } else {
          const whatsAppMsg = encodeURIComponent(
            `Hello, I'm seen you enquiry: ${car.carName}.`
          );
          window.open(
            `https://wa.me/${phoneDigits}?text=${whatsAppMsg}`,
            "_blank"
          );
        }
      } catch (err) {
        console.error("⚠️ handlePhoneClick error:", err);
      }
    };

    const handleMessageClick = async () => {
      try {
        console.log("💬 Message button clicked");
  
        // 🔹 2. Initiate call or WhatsApp
        const phoneDigits = enquiry?.mobileNumber?.replace(/[^+\d]/g, "");
        if (!phoneDigits) return;
  
        if (isMobile()) {
          const whatsAppMsg = encodeURIComponent(
            `Hello, I'm seen you enquiry: ${car.carName}.`
          );
          window.open(
            `https://wa.me/${phoneDigits}?text=${whatsAppMsg}`,
            "_blank"
          );
        }
      } catch (err) {
        console.error("⚠️ handlePhoneClick error:", err);
      }
    };

  return (
    <div className="flex flex-col rounded-sm md:rounded-md border border-gray-200 shadow-sm p-1 md:p-2 bg-white mb-4">
      <div className="flex h-full w-full">
        {/* 🚗 Left Car Image */}
        <div className="h-fit w-28 md:w-48 shrink-0 relative">
          <img
            src={car?.carImages?.[0] || "/fallback-car-img.png"}
            alt={car?.carName || enquiry.carTitle || "Car"}
            className="w-full h-22 md:h-36 object-cover rounded-xs md:rounded"
          />
        </div>

        {/* 📄 Right Section */}
        <div className="w-full flex flex-col justify-between overflow-hidden">
          <div className="flex md:h-full md:justify-between">
            {/* 🔹 Car Info */}
            <div className="flex-1 px-2 md:px-4 flex flex-col justify-between pr-3 md:pr-2">
              <div className="space-y-1 md:space-y-2">
                <h3 className="font-bold text-xs md:text-sm text-gray-900">
                  {car?.carName || enquiry.carTitle || "Car Details Unavailable"}{" "}
                  {car?.variant ? `${car.variant}` : ""}{" "}
                  {car?.manufacturingYear ? `(${car.manufacturingYear})` : ""}
                </h3>

                <p className="text-[9px] md:text-[10px] font-medium mt-1 leading-tight text-gray-700 pr-3 md:pr-0">
                  {car?.kmDriven ? `${formatShortNumber(car.kmDriven)} km | ` : ""}
                  {car?.bodyType ? `${car.bodyType} ` : ""}
                  {car?.seats ? `${car.seats} Seater | ` : ""}
                  {car?.fuelType ? `${car.fuelType} | ` : ""}
                  {car?.ownership ? `${car.ownership} owner` : ""}
                </p>

                <div className="hidden text-[9px] md:text-[10px] font-medium lg:flex items-center mt-2 text-gray-700">
                  <MapPin className="w-3 md:w-3.5 h-3 md:h-3.5 mr-1" />
                  {car?.address?.city || "Unknown City"}
                </div>
              </div>

              {/* 💰 Price + Views */}
              <div className="hidden md:block mt-3">
                <p className="font-bold text-sm md:text-lg text-gray-900">
                  Rs. {formatPriceToLakh(car?.carPrice || 0)}
                </p>
                <p className="text-[10px] text-gray-600 mt-1 flex items-center gap-1 font-medium">
                  <Eye className="h-3 w-3 text-orange-500" />{" "}
                  {formatShortNumber(100)} Views 
                  {/* above line ko update karna hai dynamic data se */}
                </p>
              </div>
            </div>

            {/* 🔸 Right Menu + Owner Info */}
            <div className="h-full sm:w-[30vw] lg:w-[18vw] flex flex-col items-end justify-between">
              {/* ⋮ 3-dot menu (mobile) */}
              <div
                className="block md:hidden relative  md:mt-1.5"
                ref={menuRef}
              >
                <EllipsisVertical
                  className="w-3 md:w-5 h-3 md:h-5 cursor-pointer"
                  onClick={() => setOpenMenu(!openMenu)}
                />
                {openMenu && (
                  <div className="absolute right-0 mt-2 w-28 md:w-40 bg-white border border-gray-100 rounded-xs md:rounded shadow-md z-50 py-1">
                    <div className="px-3 py-1.5 text-xs md:text-sm hover:bg-gray-200 cursor-pointer" onClick={handleShareCar}>
                      Share
                    </div>
                    <div className="px-3 py-1.5 text-xs md:text-sm hover:bg-gray-200 cursor-pointer text-red-500">
                      Delete
                    </div>
                  </div>
                )}
              </div>

              {/* 👤 Owner Info (Desktop) */}
              <div className="hidden md:flex h-full w-full flex-col items-start justify-between bg-[#D9D9D933] p-2 rounded-xs">
                <div className="w-full space-y-2">
                  <div className="w-full flex items-center gap-2">
                    <img
                      src={car?.owner?.userProfileUrl || "/default-men-logo.jpg"} //ye line bhi update karna hai dynamic data se
                      alt={enquiry.DealerName || "Dealer"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="w-full flex flex-col gap-1">
                      <span className="w-full flex items-center justify-between">
                        <p className="text-xs font-bold truncate">
                          {enquiry.DealerName ||  "Unknown"}
                        </p>
                        <p className="text-[8px] text-gray-500">
                          {enquiry.timeAgo || ""}
                        </p>
                      </span>
                      <p className="text-[10px] text-gray-500">
                        {enquiry.DealerRole || "unknown"}
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] font-semibold text-gray-800 flex items-center">
                    <Phone className="w-3 h-3 mr-1" />{" "}
                    {enquiry.mobileNumber || "N/A"}
                  </p>
                  <p className="text-[10px] font-semibold text-gray-800 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />{" "}
                    {car?.address?.city || "Unknown City"}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full">
                  <button className="flex-1 bg-white text-black border border-gray-300 py-1 px-2 rounded-sm text-[10px] font-semibold flex items-center justify-center gap-2 hover:bg-black hover:text-white transition" onClick={handlePhoneClick}>
                    <Phone size={10} /> Call
                  </button>
                  <button className="flex-1 bg-white text-black border border-gray-300 py-1 px-2 rounded-sm text-[10px] font-semibold flex items-center justify-center gap-2 hover:bg-black hover:text-white transition" onClick={handleMessageClick}>
                    <MessageCircle size={10} /> WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 📱 Mobile Bottom Row */}
          <div className="flex md:hidden items-center justify-between px-2 mt-2">
            <div className="text-[8px] flex items-center text-gray-700">
              <MapPin className="w-2.5 h-2.5 mr-1" />
              {car?.address?.city || "Unknown City"}
            </div>
            <p className="font-bold text-xs text-gray-900">
              Rs. {formatPriceToL(car?.carPrice || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* 📞 Mobile Owner Section */}
      <div className="block md:hidden">
        <div className="custom-dash py-1"></div>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <img
              src={"/default-men-logo.jpg"} //ye line bhi update karna hai dynamic data se
              alt={enquiry.DealerName || "unknown"}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] font-semibold">
                {enquiry.DealerName || "Unknown"}
              </p>
              <span className="w-fit bg-gray-100 text-[7px] p-px px-[3px] rounded-xs text-gray-500">
                {enquiry.DealerRole || "unknown"}
              </span>
            </div>
          </div>

          <div className="flex gap-1 mr-1">
            <button className="bg-white border border-gray-300 px-1.5 py-1.5 md:py-1 rounded-sm text-[9px] flex items-center gap-1 hover:bg-black hover:text-white transition active:bg-black active:text-white active:scale-95" onClick={handlePhoneClick}>
              <Phone size={12} />
              <span className="hidden sm:block">Call</span>
            </button>
            <button className="bg-white border border-gray-300 px-1.5 py-1.5 md:py-1 rounded-sm text-[9px] flex items-center gap-1 hover:bg-black hover:text-white transition active:bg-black active:text-white active:scale-95" onClick={handleMessageClick}>
              <MessageCircle size={12} />
              <span className="hidden sm:block">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
