import {
  EllipsisVerticalIcon,
  MapPinIcon,
  FlameIcon,
  SearchIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AiFillHeart } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteCar,
  fetchUserCars,
  markCarAsSold,
} from "../../store/slices/listingsSlice";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import { formatTimeAgo } from "../../utils/formatPrice";

export const MyListing = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const {
    cars: listings,
    loading,
    error,
  } = useAppSelector((state) => state.listings);

  console.log("carsData", listings);

  useEffect(() => {
    dispatch(fetchUserCars());
  }, [dispatch]);

  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAction = (action: string, id: string) => {
    if (action === "Mark as Sold") {
      dispatch(markCarAsSold(id)).then(() => dispatch(fetchUserCars()));
    } else if (action === "show Lead") {
      navigate("/settings/my-leads", { state: { carId: id } });
      console.log("action : ", id)
    } else if (action === "Delete") {
      dispatch(deleteCar(id)).then(() => dispatch(fetchUserCars()));
    }
    setOpenMenuId(null);
  };

  // outside click detect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openMenuId !== null &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId]?.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const filteredListings = listings.filter((car: any) =>
    car.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatShortNumber = (num: number, isKm = false) => {
    if (!num) return isKm ? "0 km" : "0";
    if (num >= 10000000)
      return (num / 10000000).toFixed(1) + " Cr" + (isKm ? " km" : "");
    if (num >= 100000)
      return (num / 100000).toFixed(1) + " L" + (isKm ? " km" : "");
    if (num >= 1000) return (num / 1000).toFixed(1) + "k" + (isKm ? " km" : "");
    return num + (isKm ? " km" : "");
  };

  return (
    <>
      <div className="grid md:grid-cols-3 justify-between items-center md:mb-6 gap-1 md:gap-0 px-4 md:px-0 shadow-sm md:shadow-none pb-3 md:pb-0 mt-2">
        <h1 className="font-semibold text-md md:text-2xl py-2 md:py-0">
          My Listings
        </h1>
        <div className="col-span-2 flex justify-end gap-2">
          <span className="w-full md:w-[60%] flex items-center gap-2 bg-gray-100 rounded-sm px-2 md:px-4 py-2">
            <SearchIcon className="w-3 md:w-4 h-3 md:h-4 text-black" />
            <input
              type="text"
              placeholder="Search for Cars, Brands, Model..."
              className="w-full focus:outline-none text-[10px] md:text-xs text-black placeholder:text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </span>
          <Link
            to="/settings/my-leads"
            className="whitespace-nowrap bg-black text-white px-3 py-2 rounded-xs md:rounded-sm flex items-center gap-2 text-[10px] md:text-xs"
          >
            Show All Leads
          </Link>
        </div>
      </div>

      {loading && <p className="text-gray-500 px-4 md:px-0">Loading...</p>}
      {error && <p className="text-red-500 px-4 md:px-0">{error}</p>}

      <div className="space-y-2 md:space-y-4 px-2 md:px-0 py-4 md:py-0 sm:mb-10 lg:mb-0">
        {filteredListings.map((car: any) => (
          <div
            key={car.id}
            className={`flex flex-row rounded-sm md:rounded-md border border-gray-100 p-1 md:p-2 ${
              car.isSold ? "opacity-40" : ""
            }`}
          >
            {/* Left Image */}
            <div className="h-fit w-28 md:w-48 shrink-0 relative">
              <img
                src={
                  car.images && car.images.length > 0 && car.images[0]
                    ? car.images[0]
                    : car.carImages && car.carImages.length > 0
                    ? car.carImages[0]
                    : "/fallback-car-img.png"
                }
                alt="car image"
                className="w-full h-22 md:h-35 object-cover rounded-xs md:rounded"
              />
              {car.isSold && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <img
                    src="/sold-img.png"
                    alt="Sold"
                    className="w-24 opacity-90"
                  />
                </span>
              )}
            </div>

            <div className="w-full flex flex-col justify-between">
              {/* Middle Content */}
              <div className="flex md:h-full md:justify-between">
                <div className="flex-1 px-2 md:px-4 flex flex-col justify-between">
                  {/* Title + Details */}
                  <div className="space-y-1 md:space-y-2">
                    <h3
                      className={`font-semibold text-xs md:text-sm ${
                        car.isSold ? "text-gray-500" : "text-gray-900"
                      }`}
                    >
                      {car.title}
                    </h3>
                    <p
                      className={`text-[9px] md:text-[10px] font-medium mt-1 leading-tight ${
                        car.isSold ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {formatShortNumber(car.kmDriven, true)} | {car.bodyType}{" "}
                      {car.seats} seater | {car.fuel} | {car.transmission}
                    </p>
                    <div
                      className={`hidden text-[9px] md:text-[10px] md:flex items-center mt-2 font-medium ${
                        car.isSold ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      <MapPinIcon
                        className={`w-3 md:w-4 h-3 md:h-4 mr-1 ${
                          car.isSold ? "text-gray-400" : "text-gray-900"
                        }`}
                      />
                      {car.address.city}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="hidden md:block ">
                    <p
                      className={`font-bold text-sm md:text-lg flex items-center gap-2 mb-2 ${
                        car.isSold ? "text-gray-500" : "text-gray-900"
                      }`}
                    >
                      Rs. {formatShortNumber(car.price)}
                    </p>
                    <div className="text-left w-fit">
                      <p className="text-[9px] font-medium text-end">
                        Added on{" "}
                        {formatTimeAgo(
                          car.updatedAt || new Date().toISOString()
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="flex flex-col items-end justify-between">
                  <div className="flex ">
                    <div className="hidden w-fit md:flex flex-row lg:flex-col justify-center text-sm text-gray-600 gap-3 pr-1">
                      <span className="flex items-start justify-end gap-3">
                        <button
                          className="p-1 rounded-sm text-lg flex flex-col items-center gap-1 cursor-pointer"
                          aria-label="like"
                        >
                          <span className="rounded-sm p-1 bg-gray-100 shadow-md border border-gray-50">
                            <AiFillHeart className="w-4 h-4 text-green-600" />
                          </span>
                          <span className="text-[8px] w-[50px]">
                            {car?.isSaved || 0} Peoples Liked
                          </span>
                        </button>
                      </span>
                    </div>

                    <div
                      className="relative mt-1 md:mt-1.5"
                      ref={(el) => {
                        menuRefs.current[car.id] = el;
                      }}
                    >
                      <EllipsisVerticalIcon
                        className="w-3 md:w-5 h-3 md:h-5 cursor-pointer"
                        onClick={() => handleMenuToggle(car.id)}
                      />
                      {openMenuId === car.id && (
                        <div className="absolute right-0 mt-2 w-30 md:w-40 bg-white border border-gray-100 rounded-xs md:rounded shadow-md z-50">
                          <div
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate("/sell", { state: { editCar: car } });
                            }}
                            className="text-[10px] md:text-md px-4 py-1 md:py-2 hover:bg-gray-200 cursor-pointer"
                          >
                            Edit
                          </div>
                          <div
                            onClick={() => handleAction("Mark as Sold", car.id)}
                            className="text-[10px] md:text-md px-4 py-1 md:py-2 hover:bg-gray-200 cursor-pointer"
                          >
                            Mark as Sold
                          </div>
                          <div
                            onClick={() =>
                              handleAction("show Lead", car.id)
                            }
                            className="text-[10px] md:text-md px-4 py-1 md:py-2 hover:bg-gray-200 cursor-pointer"
                          >
                            show Lead
                          </div>
                          <div
                            onClick={() => handleAction("Delete", car.id)}
                            className="text-[10px] md:text-md px-4 py-1 md:py-2 hover:bg-gray-200 cursor-pointer"
                          >
                            Delete
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 hidden md:block">
                    <div className="flex items-center justify-end">
                      <div
                        className={`flex items-center justify-center gap-1 ${
                          car.isSold ? "text-gray-400" : ""
                        }`}
                      >
                        <FlameIcon className="w-4 h-4 text-red-600" />
                        <span className="text-[9px]">
                          Trending Viewed by {car.enquiries.viewProperty || 0} users
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* mobile right bottom */}
              <div className="flex md:hidden items-center justify-between px-2">
                <div
                  className={`md:hidden text-[8px] md:text-xs flex items-center ${
                    car.isSold ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  <MapPinIcon
                    className={`w-2.5 md:w-4 h-2.5 md:h-4 mr-1 ${
                      car.isSold ? "text-gray-400" : "text-gray-900"
                    }`}
                  />
                  {car.address.city}
                </div>

                {/* Price */}
                <div className="">
                  <p
                    className={`font-bold text-xs flex items-center gap-2 ${
                      car.isSold ? "text-gray-500" : "text-gray-900"
                    }`}
                  >
                    Rs. {formatShortNumber(car.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && listings.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No cars found.
          </p>
        )}
      </div>
    </>
  );
};