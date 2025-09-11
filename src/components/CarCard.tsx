import React from "react";
import { formatPriceToLakh } from "../utils/formatPrice";
import { Link } from "react-router-dom";
import { ChevronRight, MapPin } from "lucide-react";
import { AiFillHeart } from "react-icons/ai";

interface Car {
  id: number;
  brand: string;
  model: string;
  carPrice: number;
  manufacturingYear: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  ownership: string;
  mileage?: number;
  seater?: number;
  carImages?: { imageUrl: string }[];
  address?: { city?: string; state?: string };
  user?: { name?: string }; // seller info
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const {
    id,
    brand,
    model,
    carPrice,
    manufacturingYear,
    fuelType,
    transmission,
    bodyType,
    ownership,
    mileage,
    seater,
    carImages,
    address,
    user,
  } = car;

  const image = carImages?.[0]?.imageUrl || "/placeholder-car.jpg";

  return (
    <div className="bg-white rounded-md shadow-lg overflow-hidden flex flex-col w-auto relative">
      {/* Image and Like/Share */}
      <div className="relative">
        <img
          src={image}
          alt={`${brand} ${model}`}
          className="w-full h-52 object-cover rounded-sm"
        />

        <span className="absolute top-2 right-2 w-full gap-2 flex items-end justify-end">
          <button className="bg-white p-1 rounded-sm text-lg" aria-label="like">
            <AiFillHeart className="w-4 h-4 text-green-600" />
          </button>
          <button className="bg-white rounded-sm text-lg" aria-label="share">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 40 40"
              fill="none"
            >
              <rect width="40" height="40" rx="7" fill="white" />
              <path
                d="M25 30C24.1667 30 23.4583 29.7083 22.875 29.125C22.2917 28.5417 22 27.8333 22 27C22 26.9 22.025 26.6667 22.075 26.3L15.05 22.2C14.7833 22.45 14.475 22.646 14.125 22.788C13.775 22.93 13.4 23.0007 13 23C12.1667 23 11.4583 22.7083 10.875 22.125C10.2917 21.5417 10 20.8333 10 20C10 19.1667 10.2917 18.4583 10.875 17.875C11.4583 17.2917 12.1667 17 13 17C13.4 17 13.775 17.071 14.125 17.213C14.475 17.355 14.7833 17.5507 15.05 17.8L22.075 13.7C22.0417 13.5833 22.021 13.471 22.013 13.363C22.005 13.255 22.0007 13.134 22 13C22 12.1667 22.2917 11.4583 22.875 10.875C23.4583 10.2917 24.1667 10 25 10C25.8333 10 26.5417 10.2917 27.125 10.875C27.7083 11.4583 28 12.1667 28 13C28 13.8333 27.7083 14.5417 27.125 15.125C26.5417 15.7083 25.8333 16 25 16C24.6 16 24.225 15.929 23.875 15.787C23.525 15.645 23.2167 15.4493 22.95 15.2L15.925 19.3C15.9583 19.4167 15.9793 19.5293 15.988 19.638C15.9967 19.7467 16.0007 19.8673 16 20C15.9993 20.1327 15.9953 20.2537 15.988 20.363C15.9807 20.4723 15.9597 20.5847 15.925 20.7L22.95 24.8C23.2167 24.55 23.525 24.3543 23.875 24.213C24.225 24.0717 24.6 24.0007 25 24C25.8333 24 26.5417 24.2917 27.125 24.875C27.7083 25.4583 28 26.1667 28 27C28 27.8333 27.7083 28.5417 27.125 29.125C26.5417 29.7083 25.8333 30 25 30Z"
                fill="#ED1D2B"
              />
            </svg>
          </button>
        </span>
      </div>

      {/* Card Content */}
      <div className="py-4 px-2 pt-2 flex-1 flex flex-col">
        <div className="flex justify-between items-end mb-1 gap-4">
          <h3 className="text-base font-semibold leading-tight text-gray-800 truncate">
            {brand} {model}
          </h3>
          <span className="min-w-12 text-[10px]">New</span>
        </div>
        <p className="text-[10px] text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis mb-1">
          {manufacturingYear} • {fuelType} • {transmission} • {bodyType} •{" "}
          {ownership}
          {seater ? ` • ${seater} Seater` : ""}
          {mileage ? ` • ${mileage} kmpl` : ""}
        </p>

        <div className="flex items-end justify-between mb-4">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-500 mb-1">
              {user?.name || "Dealer/Owner"} | {ownership}
            </p>
            <p className="flex items-center gap-1 text-[10px] bg-gray-300 rounded-sm w-fit py-[3px] px-2">
              <MapPin size={11} /> {address?.city || "Unknown"},{" "}
              {address?.state || ""}
            </p>
          </div>
          <span className="text-lg font-bold text-gray-900 -mb-[6px]">
            ₹ {formatPriceToLakh(carPrice)}
          </span>
        </div>
        <Link to={`/buy-car/${id}`} className="group">
          <button className="flex items-center mx-auto border border-gray-500 w-full justify-center gap-2 text-xs md:text-xs group-hover:text-gray-700 text-gray-900 py-[6px] rounded transition cursor-pointer">
            View More
            <span className="rounded-full bg-gray-900 group-hover:bg-gray-700 transition">
              <ChevronRight size={14} className="text-white p-[2px]" />
            </span>
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

// interface Car {
//   id: number;
//   title: string;
//   price: number;
//   oldPrice: number;
//   image: string;
//   type: string;
//   seater: number;
//   mileage: number;
//   fuelTypes: string;
//   gear: string;
//   seller: string;
// }

// interface CarCardProps {
//   car: Car;
// }

// const CarCard: React.FC<CarCardProps> = ({ car }) => {
//   const { title, price, oldPrice, image } = car;

//   const discountPercent = oldPrice
//     ? Math.round(((oldPrice - price) / oldPrice) * 100)
//     : 0;

//   return (
//     <div className="bg-white rounded-md shadow-lg overflow-hidden flex flex-col w-auto relative">
//       {/* Image and Deal Badge */}
//       <div className="relative ">
//         <img
//           src={image}
//           alt={title}
//           className="w-full h-52 object-cover rounded-sm"
//         />
//         {discountPercent > 0 && (
//           <div className="absolute bottom-2 left-2 w-full">
//             <span className="text-[10px] bg-orange-400 text-white px-2 py-1 rounded-xs">
//               Deals: {discountPercent}% Off
//             </span>
//           </div>
//         )}

//         <span className="absolute top-2 right-2 w-full gap-2 flex items-end justify-end">
//           <button className="bg-white p-1 rounded-sm text-lg" aria-label="like">
//             <AiFillHeart className="w-4 h-4 text-green-600" />
//           </button>
//           <button className="bg-white rounded-sm text-lg" aria-label="like">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 40 40"
//               fill="none"
//             >
//               <rect width="40" height="40" rx="7" fill="white" />
//               <path
//                 d="M25 30C24.1667 30 23.4583 29.7083 22.875 29.125C22.2917 28.5417 22 27.8333 22 27C22 26.9 22.025 26.6667 22.075 26.3L15.05 22.2C14.7833 22.45 14.475 22.646 14.125 22.788C13.775 22.93 13.4 23.0007 13 23C12.1667 23 11.4583 22.7083 10.875 22.125C10.2917 21.5417 10 20.8333 10 20C10 19.1667 10.2917 18.4583 10.875 17.875C11.4583 17.2917 12.1667 17 13 17C13.4 17 13.775 17.071 14.125 17.213C14.475 17.355 14.7833 17.5507 15.05 17.8L22.075 13.7C22.0417 13.5833 22.021 13.471 22.013 13.363C22.005 13.255 22.0007 13.134 22 13C22 12.1667 22.2917 11.4583 22.875 10.875C23.4583 10.2917 24.1667 10 25 10C25.8333 10 26.5417 10.2917 27.125 10.875C27.7083 11.4583 28 12.1667 28 13C28 13.8333 27.7083 14.5417 27.125 15.125C26.5417 15.7083 25.8333 16 25 16C24.6 16 24.225 15.929 23.875 15.787C23.525 15.645 23.2167 15.4493 22.95 15.2L15.925 19.3C15.9583 19.4167 15.9793 19.5293 15.988 19.638C15.9967 19.7467 16.0007 19.8673 16 20C15.9993 20.1327 15.9953 20.2537 15.988 20.363C15.9807 20.4723 15.9597 20.5847 15.925 20.7L22.95 24.8C23.2167 24.55 23.525 24.3543 23.875 24.213C24.225 24.0717 24.6 24.0007 25 24C25.8333 24 26.5417 24.2917 27.125 24.875C27.7083 25.4583 28 26.1667 28 27C28 27.8333 27.7083 28.5417 27.125 29.125C26.5417 29.7083 25.8333 30 25 30Z"
//                 fill="#ED1D2B"
//               />
//             </svg>
//           </button>
//         </span>
//       </div>

//       {/* Card Content */}
//       <div className="py-4 px-2 pt-2 flex-1 flex flex-col">
//         <div className="flex justify-between items-end mb-1 gap-4">
//           <h3 className="text-base font-semibold leading-tight text-gray-800 truncate">
//             {title}
//           </h3>
//           <span className="min-w-12 text-[10px]">3 min ago</span>
//         </div>
//         <p className="text-[10px] text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis mb-1">
//           {car.type} {car.seater} Seater | {car.mileage} Kmpl | {car.fuelTypes}{" "}
//           | {car.gear}
//         </p>

//         <div className="flex items-end justify-between mb-4">
//           <div className="space-y-1">
//             <p className="text-[10px] text-gray-500 mb-1">
//               Sourav Jha | {car.seller}
//             </p>
//             <p className="flex items-center gap-1 text-[10px] bg-gray-300 rounded-sm w-fit py-[3px] px-2">
//               <MapPin size={11} /> Mumbai
//             </p>
//           </div>
//           <span className="text-lg font-bold text-gray-900 -mb-[6px]">
//             ₹ {formatPriceToLakh(price)}
//           </span>
//         </div>
//         <Link to={`/buy-car/${car.id}`} className="group">
//           <button className="flex items-center mx-auto border border-gray-500 w-full justify-center gap-2 text-xs md:text-xs group-hover:text-gray-700 text-gray-900 py-[6px] rounded transition cursor-pointer">
//             View More
//             <span className="rounded-full bg-gray-900 group-hover:bg-gray-700 transition">
//               <ChevronRight size={14} className="text-white p-[2px]" />
//             </span>
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default CarCard;
