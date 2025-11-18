import React from "react";
import { Link } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { MapPin, ChevronRight } from "lucide-react";
import type { CarRecord } from "../types/car";
import { formatPriceToLakh, formatTimeAgo } from "../utils/formatPrice";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import { createSaveCar, removeSaveCar } from "../store/slices/savedSlice";

interface CarCardProps {
  car: CarRecord & { isSaved?: boolean; savedCarId?: string };
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const dispatch = useAppDispatch();

  // All saved car IDs (actual car IDs)
  const savedCarIdsByCarId = useAppSelector(
    (state) => state.saved.savedCarIdsByCarId
  );

  // All saved table IDs (needed for unsave)
  const savedCars = useAppSelector((state) => state.saved.cars);

  // TRUE if this car is saved
  const isSaved =
    car.isSaved || savedCarIdsByCarId.includes(String(car.id));

  // find savedCarId for unSaving
  const savedCarEntry = savedCars.find((c) => c.id === car.id);
  const savedCarId = savedCarEntry?.savedCarId;

  const image = car.carImages?.[0] || "/fallback-car-img.png";
  const updateTime = car.updatedAt;

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
          className="w-full h-40 lg:h-48 object-cover"
          loading="lazy"
        />

        {/* ❤️ SAVE BUTTON */}
        <span
          className="absolute top-2 right-2 flex gap-2 cursor-pointer"
          onClick={() => {
            if (isSaved) {
              if (savedCarId) {
                dispatch(removeSaveCar(String(car.id)));
                // window.location.reload();
              }
            } else {
              dispatch(createSaveCar(String(car.id)));
            }
          }}
        >
          <AiFillHeart
            className={`w-5 h-5 ${
              isSaved ? "text-green-600" : "text-gray-400"
            }`}
          />
        </span>
      </div>
      

      <div className="py-4 px-2 flex-1 flex flex-col">
        <div className="flex justify-between items-end mb-2 gap-4">
          <h3 className="text-md font-semibold text-gray-800 truncate">
            {car.brand} {car.model}
          </h3>
          <span className="text-xs">
            {formatTimeAgo(updateTime || new Date().toISOString())}
          </span>
        </div>

        <p className="text-xs text-black mb-2">
          {car.bodyType} {car.seats ? ` ${car.seats} Seater` : ""} |{" "}
          {car.fuelType} | {car.transmission} |{" "}
          {car.ownership ? `${car.ownership} owner` : ""}
        </p>

        <div className="flex items-end justify-between mb-4">
          <div className="space-y-2">
            <p className="text-xs text-gray-600 capitalize">
              {car.user?.fullName || "Unknown"} ({car.user?.userType})
            </p>
            <p className="flex items-center gap-1 text-[10px] bg-[#CFCFCF] rounded-xs w-fit py-0.5 px-2">
              <MapPin size={8} /> {car.address?.city || "Unknown"}
            </p>
          </div>

          <span className="text-lg font-bold text-gray-900">
            ₹ {formatPriceToLakh(car.carPrice || 0)}
          </span>
        </div>

        <Link to={`/buy-car/${car.id}`}>
          <button className="flex items-center justify-center w-full border border-gray-500 gap-2 text-[13px] font-semibold text-gray-900 py-2 rounded hover:text-gray-700">
            View More
            <span className="rounded-full bg-gray-900">
              <ChevronRight size={14} className="text-white p-px" />
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CarCard;