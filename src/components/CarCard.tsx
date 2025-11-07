import React from "react";
import { Link } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { MapPin, ChevronRight } from "lucide-react";
import type { CarRecord } from "../types/car";
import { formatPriceToLakh, formatTimeAgo } from "../utils/formatPrice";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import { createSaveCar, removeSaveCar } from "../store/slices/savedSlice";

interface CarCardProps { car: CarRecord;}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const image = car.carImages?.[0] || "/fallback-car-img.png";
  const updateTime = car.updatedAt;
  const dispatch = useAppDispatch();
  const CarId = useAppSelector((state) => state.saved.savedCarIds);
  const isSaved = CarId.includes(car.savedCarId!);

  return (
    <div className="bg-white rounded-md overflow-hidden flex flex-col card-shadow-custom mb-3">
      <div className="relative">
        <img
          src={
            typeof image === "string"
              ? image
              : image?.presignedUrl || image?.imageUrl || ""
          }
          alt={`${car.brand} ${car.model}`}
          className="w-full h-40 lg:h-48 object-cover rounded-sm"
          loading="lazy"
        />
        <span
          className="absolute top-2 right-2 flex gap-2 cursor-pointer"
          onClick={() => {
            if (isSaved) {
              dispatch(removeSaveCar(String(car.id)));
            } else {
              dispatch(createSaveCar(String(car.id)));
            }
          }}
        >
          <AiFillHeart
            className={`w-4 h-4 ${
              isSaved ? "text-green-600" : "text-gray-400"
            }`}
          />
        </span>
      </div>
      <div className="py-4 px-2 flex-1 flex flex-col">
        <div className="flex justify-between items-end mb-2 gap-4">
          <h3 className="text-md font-semibold leading-tight text-gray-800 truncate">
            {car.brand} {car.model}
          </h3>
          <span className="text-xs whitespace-nowrap">
            {formatTimeAgo(updateTime || new Date().toISOString())}
          </span>
        </div>
        <p className="text-xs text-black whitespace-nowrap overflow-hidden text-ellipsis mb-2">
          {car.bodyType} {car.seats ? ` ${car.seats} Seater` : ""} |{" "}
          {car.fuelType} | {car.transmission}
        </p>
        <div className="flex items-end justify-between mb-4">
          <div className="space-y-4">
            <p className="text-xs text-gray-600 mb-2 capitalize">
              {car.user?.fullName || "Unknown"} (
              {car.user?.userType || "Unknown"})
            </p>
            <p className="flex items-center gap-1 text-[10px] capitalize bg-[#CFCFCF] rounded-xs w-fit py-0.5 pl-1 pr-2 mt-2">
              <MapPin size={8} /> {car.address?.city || "Unknown"}
            </p>
          </div>
          <span className="text-lg font-bold text-gray-900 -mb-1">
            ₹ {formatPriceToLakh(car.carPrice || 0)}
          </span>
        </div>
        <Link to={`/buy-car/${car.id}`}>
          <button className="flex items-center justify-center w-full mx-auto border border-gray-500 gap-2 text-[13px] font-semibold text-gray-900 py-2 rounded transition hover:text-gray-700">
            View More{" "}
            <span className="rounded-full bg-gray-900 transition">
              <ChevronRight size={14} className="text-white p-px" />
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
