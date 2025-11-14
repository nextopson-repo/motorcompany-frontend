import React from "react";
import { MapPin, Phone } from "lucide-react";
import { toast } from "react-hot-toast";

interface LeadCardProps {
  name: string;
  city: string;
  timeAgo: string;
  image: string;
  phone: string;
  carId: string;
  carName: string;

  // NEW PROPS
  isLocked?: boolean;
  onLockedClick?: () => void;
}

const LeadCard: React.FC<LeadCardProps> = ({
  name,
  city,
  timeAgo,
  image,
  phone,
  carId,
  carName,
  isLocked = false,
  onLockedClick,
}) => {
  // detect device
  function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  const handlePhoneClick = async () => {
    if (isLocked) {
      onLockedClick?.();
      return;
    }

    if (!phone) {
      toast.error("Phone number missing!");
      return;
    }

    const phoneDigits = phone.replace(/[^+\d]/g, "");

    if (isMobile()) {
      window.location.href = `tel:${phoneDigits}`;
      toast.success(`Calling ${name}...`);
    } else {
      const whatsAppMsg = encodeURIComponent(`Hello, let's talk about the car.`);
      window.open(`https://wa.me/${phoneDigits}?text=${whatsAppMsg}`, "_blank");
      toast.success(`Messaging ${name}...`);
    }
  };

  const handleViewClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      onLockedClick?.();
    }
  };

  return (
    <div
      className={`flex justify-between items-center py-3 px-4 bg-white rounded-md shadow-sm border border-gray-100 transition-all ${
        isLocked ? "opacity-40 blur-[1px]" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <img
          src={image || "/default-men-logo.jpg"}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div className="gap-1">
          <h3 className="font-medium text-gray-800 text-sm md:text-base">
            {name}
          </h3>

          <p className="text-xs text-gray-500 flex items-center gap-3">
            <span>{carName}</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {city}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <p className="text-[10px] md:text-xs text-gray-500">{timeAgo}</p>

        {/* VIEW BUTTON */}
        <a
          href={`/buy-car/${carId}`}
          onClick={handleViewClick}
          className={isLocked ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:underline"}
        >
          view
        </a>

        {/* CALL BUTTON */}
        <button
          className={`p-2 rounded-sm ${
            isLocked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-700 cursor-pointer"
          }`}
          onClick={handlePhoneClick}
        >
          <Phone className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default LeadCard;



// import React from "react";
// import { MapPin, Phone } from "lucide-react";
// import { toast } from "react-hot-toast";

// interface LeadCardProps {
//   name: string;
//   city: string;
//   timeAgo: string;
//   image: string;
//   phone: string;
//   carId: string;
//   carName: string;
// }

// const LeadCard: React.FC<LeadCardProps> = ({ name, city, timeAgo, image, phone, carId, carName }) => {
//    // check is mobile or desktop
//   function isMobile() {
//     return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
//   }

//   const handlePhoneClick = async () => {
//     try {
//       console.log("📞 Phone button clicked");

//       if (!phone) {
//         console.warn("Missing Mobile Number for call.");
//         toast.success(`Missing Mobile Number of ${name}... 📞`);
//         return;
//       }

//       // // 🔹 2. Initiate call or WhatsApp
//       const phoneDigits = phone.replace(/[^+\d]/g, "");
//       if (!phoneDigits) return;

//       if (isMobile()) {
//         window.location.href = `tel:${phoneDigits}`;
//         toast.success(`Calling ${name}... 📞`);
//       } else {
//         const whatsAppMsg = encodeURIComponent(
//           `Hello, Lets talk about my car.`
//         );
//         toast.success(`Message ${name}... 📞`);
//         window.open(
//           `https://wa.me/${phoneDigits}?text=${whatsAppMsg}`,
//           "_blank"
//         );
//       }
//     } catch (err) {
//       console.error("⚠️ handlePhoneClick error:", err);
//     }
//   };

//   // console.log(carId)
//   return (
//     <div className="flex justify-between items-center py-3 px-4 bg-white hover:bg-gray-50 rounded-md shadow-sm border border-gray-100 transition-all">
//       <div className="flex items-center gap-3">
//         <img
//           src={image || "/default-men-logo.jpg"}
//           alt={name}
//           className="w-12 h-12 rounded-full object-cover"
//         />
//         <div className="gap-1">
//           <h3 className="font-medium text-gray-800 text-sm md:text-base">{name}</h3>
//           <p className="text-xs text-gray-500 flex items-center gap-3">
//             <span>{carName}</span>
//             <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 "/>{city}</span>
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center gap-6">
//         <p className="text-[10px] md:text-xs text-gray-500">{timeAgo}</p>
//         <a href={`/buy-car/${carId}`} className="text-blue-600 hover:underline">view</a>
//         <button className="bg-black p-2 rounded-sm hover:bg-gray-700 cursor-pointer" onClick={handlePhoneClick}>
//           <Phone className="w-4 h-4 text-white" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LeadCard;
