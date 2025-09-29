import React from "react";
import { Link } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { MapPin, ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import type { CarRecord } from "../types/car";
import { setSelectedCar } from "../store/slices/carSlice";
import { formatPriceToLakh } from "../utils/formatPrice";

interface CarCardProps { car: CarRecord }

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const dispatch = useDispatch<AppDispatch>();
  const image = car.carImages?.[0]?.imageUrl || "/fallback-car-img.png";

  return (
    <div className="bg-white rounded-md overflow-hidden flex flex-col card-shadow-custom mb-3">
      <div className="relative">
        <img src={image} alt={`${car.brand} ${car.model}`} className="w-full h-40 lg:h-48 object-cover rounded-sm" loading="lazy" />
        <span className="absolute top-2 right-2 flex gap-2">
          <AiFillHeart className="w-4 h-4 text-green-600" />
        </span>
      </div>
      <div className="py-4 px-2 flex-1 flex flex-col">
        <div className="flex justify-between items-end mb-1 gap-4">
          <h3 className="text-sm font-semibold leading-tight text-gray-800 truncate">{car.brand} {car.model}</h3>
          <span className="text-[8px]">{"just now"}</span>
        </div>
        <p className="text-[9px] text-black whitespace-nowrap overflow-hidden text-ellipsis mb-1">
          {car.bodyType} {car.seats ? ` ${car.seats} Seater` : ""} | {car.fuelType} | {car.transmission}
        </p>
        <div className="flex items-end justify-between mb-3">
          <div className="space-y-2">
            <p className="text-[9px] text-gray-600 mb-1 capitalize">{car.user?.fullName || "Unknown"} ({car.user?.userType || "Unknown"})</p>
            <p className="flex items-center gap-1 text-[8px] capitalize bg-[#CFCFCF] rounded-xs w-fit py-[2px] pl-1 pr-2 mt-2"><MapPin size={8} /> {car.address?.city || "Unknown"}</p>
          </div>
          <span className="text-md font-bold text-gray-900 -mb-1">₹ {formatPriceToLakh(car.carPrice || 0)}</span>
        </div>
        <Link to={`/buy-car/${car.id}`} onClick={() => dispatch(setSelectedCar(car))}>
          <button className="flex items-center justify-center w-full mx-auto border border-gray-500 gap-2 text-[11px] font-semibold text-gray-900 py-1 rounded transition hover:text-gray-700">
            View More <span className="rounded-full bg-gray-900 transition"><ChevronRight size={10} className="text-white p-[1px]" /></span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CarCard;



// import React from "react";
// import { formatPriceToLakh } from "../utils/formatPrice";
// import { Link } from "react-router-dom";
// import { ChevronRight, MapPin } from "lucide-react";
// import { AiFillHeart } from "react-icons/ai";
// // import { formatDistanceToNow, parseISO } from "date-fns";
// import { useDispatch } from "react-redux";
// import type { AppDispatch } from "../store/store";
// import { setSelectedCar } from "../store/slices/carSlice";
// import type { CarRecord } from "../types/car";

// interface CarCardProps {
//   car: CarRecord;
// }

// const CarCard: React.FC<CarCardProps> = ({ car }) => {
//   const {
//     id,
//     brand,
//     model,
//     carPrice,
//     fuelType,
//     transmission,
//     bodyType,
//     seats,
//     carImages,
//     address,
//     user,
//   } = car;

//   const dispatch = useDispatch<AppDispatch>();

//   const handleViewMore = () => dispatch(setSelectedCar(car));

//   const image = carImages?.[0]?.imageUrl || "/fallback-car-img.png";

//   // const updatedAgo = car.updatedAt
//   //   ? formatDistanceToNow(parseISO(car.updatedAt), { addSuffix: true })
//   //   : "just now";

//   return (
//     <div>
//       <div className="bg-white rounded-md overflow-hidden flex flex-col w-auto relative mb-3 lg:mb-0 card-shadow-custom my-1">
//         <div className="relative">
//           <img
//             src={image}
//             alt={`${brand || ""} ${model || ""}`}
//             className="w-full h-40 lg:h-48 object-cover rounded-sm"
//             loading="lazy"
//           />
//           <span className="absolute top-2 right-2 flex gap-2 items-end justify-end">
//             <button
//               className="bg-white p-1 rounded-sm text-lg"
//               aria-label="like"
//             >
//               <AiFillHeart className="w-4 h-4 text-green-600" />
//             </button>
//             <button className="bg-white rounded-sm text-lg" aria-label="share">
//               {/* Share icon */}
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 40 40"
//                 fill="none"
//               >
//                 <rect width="40" height="40" rx="7" fill="white" />
//                 <path
//                   d="M25 30C24.1667 30 23.4583 29.7083 22.875 29.125C22.2917 28.5417 22 27.8333 22 27C22 26.9 22.025 26.6667 22.075 26.3L15.05 22.2C14.7833 22.45 14.475 22.646 14.125 22.788C13.775 22.93 13.4 23.0007 13 23C12.1667 23 11.4583 22.7083 10.875 22.125C10.2917 21.5417 10 20.8333 10 20C10 19.1667 10.2917 18.4583 10.875 17.875C11.4583 17.2917 12.1667 17 13 17C13.4 17 13.775 17.071 14.125 17.213C14.475 17.355 14.7833 17.5507 15.05 17.8L22.075 13.7C22.0417 13.5833 22.021 13.471 22.013 13.363C22.005 13.255 22.0007 13.134 22 13C22 12.1667 22.2917 11.4583 22.875 10.875C23.4583 10.2917 24.1667 10 25 10C25.8333 10 26.5417 10.2917 27.125 10.875C27.7083 11.4583 28 12.1667 28 13C28 13.8333 27.7083 14.5417 27.125 15.125C26.5417 15.7083 25.8333 16 25 16C24.6 16 24.225 15.929 23.875 15.787C23.525 15.645 23.2167 15.4493 22.95 15.2L15.925 19.3C15.9583 19.4167 15.9793 19.5293 15.988 19.638C15.9967 19.7467 16.0007 19.8673 16 20C15.9993 20.1327 15.9953 20.2537 15.988 20.363C15.9807 20.4723 15.9597 20.5847 15.925 20.7L22.95 24.8C23.2167 24.55 23.525 24.3543 23.875 24.213C24.225 24.0717 24.6 24.0007 25 24C25.8333 24 26.5417 24.2917 27.125 24.875C27.7083 25.4583 28 26.1667 28 27C28 27.8333 27.7083 28.5417 27.125 29.125C26.5417 29.7083 25.8333 30 25 30Z"
//                   fill="#ED1D2B"
//                 />
//               </svg>
//             </button>
//           </span>
//         </div>

//         <div className="py-4 px-2 flex-1 flex flex-col">
//           <div className="flex justify-between items-end mb-1 gap-4">
//             <h3 className="text-sm font-semibold leading-tight text-gray-800 truncate">
//               {brand} {model}
//             </h3>
//             <span className="min-w-12 text-[8px] text-right">{"just now"}</span>
//           </div>

//           <p className="text-[9px] font-[500] text-black whitespace-nowrap overflow-hidden text-ellipsis mb-1">
//             {bodyType} {seats ? ` ${seats} Seater` : ""} | {fuelType} |{" "}
//             {transmission}
//           </p>

//           <div className="flex items-end justify-between mb-3">
//             <div className="space-y-2">
//               <p className="text-[9px] text-gray-600 mb-1 capitalize">
//                 {user?.fullName || "Unknown"}{" "}
//                 <span className="text-[8px] text-gray-600">
//                   ({user?.userType || "Unknown"})
//                 </span>
//               </p>
//               <p className="flex items-center gap-1 text-[8px] capitalize bg-[#CFCFCF] rounded-xs w-fit py-[2px] pl-1 pr-2 mt-2">
//                 <MapPin size={8} /> {address?.city || "Unknown"}
//               </p>
//             </div>
//             <span className="text-md font-bold text-gray-900 -mb-1">
//               ₹ {formatPriceToLakh(carPrice ?? 0)}
//             </span>
//           </div>

//           <Link
//             to={`/buy-car/${id}`}
//             className="group"
//             onClick={handleViewMore}
//           >
//             <button className="flex items-center justify-center w-full mx-auto border border-gray-500 gap-2 text-[11px] font-semibold group-hover:text-gray-700 text-gray-900 py-1 rounded transition cursor-pointer">
//               View More
//               <span className="rounded-full bg-gray-900 group-hover:bg-gray-700 transition">
//                 <ChevronRight size={10} className="text-white p-[1px]" />
//               </span>
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CarCard;
