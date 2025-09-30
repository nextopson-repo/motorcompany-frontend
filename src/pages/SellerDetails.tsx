import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  ChevronDown,
  ChevronRight,
  Flag,
  Flame,
  IdCard,
  List,
  Mail,
  MapPin,
  MapPinIcon,
  Phone,
  Share2,
} from "lucide-react";
import { fetchSellerCars } from "../store/slices/sellerDetailsSlice";
import { Link, useParams } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { formatPriceToLakh, formatShortNumber } from "../utils/formatPrice";
// import { setSelectedCar } from "../store/slices/carSlice";

export default function SellerDetails() {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const seller = useSelector((state: RootState) => state.SellerDetails);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  // const handleViewMore = () => dispatch(setSelectedCar(seller.cars.));

  useEffect(() => {
    if (userId) {
      dispatch(fetchSellerCars({ userId }));
    }
  }, [dispatch, userId]);

  if (seller.loading) {
    return (
      <div className="p-6 text-center text-gray-600 mt-20">
        Loading seller details…
      </div>
    );
  }

  if (seller.error) {
    return (
      <div className="p-6 text-center text-red-500 mt-20">
        Error: {seller.error}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-4 gap-8 mt-20 max-w-5xl mx-auto mb-4 overflow-hidden">
      {/* ---------- Left Seller Profile ---------- */}
      <div className="col-span-1 bg-white space-y-4 px-4 h-fit sm:w-lg lg:w-full">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={seller.avatar || "/default-avatar.png"}
              alt={seller.name || "Seller"}
              className="w-16 h-16 rounded-full border mb-3 object-cover"
            />
            <span className="flex flex-col gap-1 mb-2">
              <h2 className="max-w-[9rem] sm:max-w-[11rem] lg:max-w-[9rem] font-semibold text-md sm:text-lg lg:text-sm text-center capitalize whitespace-nowrap truncate text-ellipsis">
                {seller.name || "Unknown Seller"}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm lg:text-[10px] lg:text-xs font-semibold">
                {seller.role || "Dealer"}
              </p>
            </span>
          </div>
          {seller.joinDate && (
            <p className="text-[10px] sm:text-sm lg:text-[10px] text-gray-600">
              Joined on {seller.joinDate}
            </p>
          )}
        </div>

        <div className="space-y-1">
          {seller.location && (
          <p className="text-[10px] sm:text-sm lg:text-[10px] flex items-center gap-1">
            <MapPin className="h-[14px] w-[14px] mb-[2px]" /> {seller.location}
          </p>
        )}
        {seller.email && (
          <p className="text-[10px] sm:text-sm lg:text-[10px] break-words flex items-center gap-1">
            <Mail className="h-3 w-3" /> {seller.email}
          </p>
        )}
        {seller.phone && (
          <p className="text-[10px] sm:text-sm lg:text-[10px] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" /> {seller.phone}
            </span>
            {seller.verified && (
              <span className="text-[10px] text-green-600 font-bold p-[2px] border border-green-600 rounded-xs flex items-center gap-2 px-4">
                Verified
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 36 36"
                  fill="none"
                >
                  <path
                    d="M17.6351 0.812837C17.7765 0.497936 18.2235 0.497935 18.3649 0.812836L20.5065 5.58323C20.6153 5.82563 20.9259 5.89652 21.1291 5.72533L25.1285 2.35657C25.3925 2.13419 25.7953 2.32818 25.786 2.67323L25.6457 7.90042C25.6386 8.16603 25.8877 8.36464 26.145 8.29859L31.2099 6.99868C31.5443 6.91287 31.823 7.26241 31.665 7.56928L29.2706 12.2179C29.1489 12.4542 29.2872 12.7412 29.5477 12.7933L34.675 13.8197C35.0135 13.8875 35.113 14.3234 34.8374 14.5313L30.6632 17.6807C30.4511 17.8407 30.4511 18.1593 30.6632 18.3193L34.8374 21.4687C35.113 21.6766 35.0135 22.1125 34.675 22.1803L29.5477 23.2067C29.2872 23.2588 29.1489 23.5458 29.2706 23.7821L31.665 28.4307C31.823 28.7376 31.5443 29.0871 31.2099 29.0013L26.145 27.7014C25.8877 27.6354 25.6386 27.834 25.6457 28.0996L25.786 33.3268C25.7953 33.6718 25.3925 33.8658 25.1285 33.6434L21.1291 30.2747C20.9259 30.1035 20.6153 30.1744 20.5065 30.4168L18.3649 35.1872C18.2235 35.5021 17.7765 35.5021 17.6351 35.1872L15.4935 30.4168C15.3847 30.1744 15.0741 30.1035 14.8709 30.2747L10.8715 33.6434C10.6075 33.8658 10.2047 33.6718 10.214 33.3268L10.3543 28.0996C10.3614 27.834 10.1123 27.6354 9.85497 27.7014L4.79006 29.0013C4.45571 29.0871 4.17696 28.7376 4.33501 28.4307L6.72938 23.7821C6.85105 23.5458 6.71284 23.2588 6.4523 23.2067L1.32495 22.1803C0.98649 22.1125 0.887005 21.6766 1.16255 21.4687L5.33679 18.3193C5.5489 18.1593 5.5489 17.8407 5.33679 17.6807L1.16255 14.5313C0.887004 14.3234 0.986491 13.8875 1.32496 13.8197L6.4523 12.7933C6.71284 12.7412 6.85105 12.4542 6.72938 12.2179L4.33502 7.56928C4.17696 7.26241 4.45571 6.91287 4.79005 6.99868L9.85497 8.29859C10.1123 8.36464 10.3614 8.16603 10.3543 7.90042L10.214 2.67323C10.2047 2.32817 10.6075 2.13419 10.8715 2.35657L14.8709 5.72534C15.0741 5.89652 15.3847 5.82563 15.4935 5.58323L17.6351 0.812837Z"
                    fill="#329537"
                  />
                  <path
                    d="M23.525 15.1309C23.6731 14.9776 23.7549 14.7724 23.7531 14.5593C23.7512 14.3463 23.6658 14.1425 23.5152 13.9919C23.3645 13.8412 23.1607 13.7558 22.9477 13.7539C22.7347 13.7521 22.5294 13.834 22.3762 13.982L16.4449 19.9132L13.7637 17.232C13.6104 17.084 13.4052 17.0021 13.1922 17.0039C12.9791 17.0058 12.7753 17.0912 12.6247 17.2419C12.4741 17.3925 12.3886 17.5963 12.3867 17.8093C12.3849 18.0224 12.4668 18.2276 12.6148 18.3809L15.8648 21.6309C16.0172 21.7832 16.2238 21.8687 16.4392 21.8687C16.6547 21.8687 16.8613 21.7832 17.0137 21.6309L23.5137 15.1309H23.525Z"
                    fill="white"
                  />
                </svg>
              </span>
            )}
          </p>
        )}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full">
          <button className="w-full text-xs sm:text-[10px] bg-black text-white px-4 py-[6px] rounded-sm hover:bg-gray-900 flex items-center justify-center gap-2 whitespace-nowrap">
            <Share2 className="h-3 w-3" /> Share Profile
          </button>
          <button className="w-full text-xs sm:text-[10px] border px-4 py-[6px] rounded-sm text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2 whitespace-nowrap">
            <Flag className="h-3 w-3" /> Report User
          </button>
        </div>
      </div>

      {/* ---------- Right Car Listings ---------- */}
      <div className="hidden col-span-3 w-full lg:flex flex-col gap-4 mb-4">
        {seller.cars.length === 0 && (
          <div className="p-6 bg-white shadow rounded text-center text-gray-500">
            No cars listed by this seller yet.
          </div>
        )}

        {seller.cars.map((car) => (
          <div
            key={car.id}
            className="flex flex-row bg-white shadow rounded-xs overflow-hidden p-2 border border-gray-200"
          >
            <img
              src={car.image || "/placeholder-car.png"}
              alt={car.title}
              className="w-88 h-36 object-cover rounded-sm"
            />

            <div className="w-full  px-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-md max-w-[230px]">
                  {car.title}
                </h3>

                <p className="text-[10px] mt-1 font-semibold">
                  {car.kms} | {car.type} | {car.seats} Seater | {car.fuel} |{" "}
                  {car.transmission}
                </p>

                {car.location && (
                  <p className="text-[10px] mt-1 font-semibold flex gap-1 items-center">
                    {" "}
                    <MapPin className="h-3 w-3 text-black" /> {car.location}
                  </p>
                )}
              </div>

              <span className="space-y-1 mb-2">
                <p className="font-bold text-md">
                  Rs. {formatPriceToLakh(car.price)}
                  <span className="text-[10px] text-orange-600 ml-2">
                    Make your Offer
                  </span>
                </p>
                <p className="text-[10px] font-medium">3 days ago</p>
              </span>
            </div>

            <div className="w-auto flex flex-col items-end justify-between mb-2">
              <span className=" flex flex-col gap-1 items-center">
                <span className="p-1 rounded-sm w-fit border border-gray-200">
                  <AiFillHeart className="text-green-600 h-4 w-4" />
                </span>
                <p className="text-[7px] text-center text-gray-500">
                  {car.likes} people <br /> Liked
                </p>
              </span>
              <span className="text-[8px] whitespace-nowrap text-gray-500 mr-4 flex items-center gap-1">
                <Flame className="text-[#cb202d] h-[12px] w-[12px]" />
                Trending Viewed by {car.views} user's
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* mobile carCards listing header */}
      <div className="lg:hidden flex items-center justify-between border-t border-gray-200 px-4 pt-6 sm:pt-4">
        <h1 className="text-lg font-semibold">Listed Cars</h1>
        <div className="flex items-center gap-2">
          <span className="flex items-center border border-gray-500 rounded-sm">
            <button
              className={`p-1 rounded-l-sm ${
                viewMode === "list"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-5 w-5" />
            </button>
            <button
              className={`p-1 rounded-r-sm ${
                viewMode === "card"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setViewMode("card")}
            >
              <IdCard className="h-5 w-5" />
            </button>
          </span>
          <button className="text-sm px-4 py-[6px] bg-black text-white flex items-center rounded-sm gap-2">
            Latest <ChevronDown className="text-white h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        // List View
        <div className="block lg:hidden space-y-2 sm:space-y-4 px-4">
          {seller.cars.map((car) => (
            <div
              key={car.id}
              className="flex flex-row rounded-sm border border-gray-100 p-1"
            >
              {/* Left Image */}
              <div className="h-fit w-28 sm:w-36 flex-shrink-0 relative">
                <img
                  src={"/fallback-car-img.png"}
                  alt="car image"
                  className="w-full h-22 object-cover rounded-xs"
                />
              </div>

              <div className="w-full flex flex-col justify-between">
                <div className="flex">
                  {/* Middle Content */}
                  <div className="flex-1 px-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-xs text-gray-900">
                        {car.title}
                      </h3>
                      <p className="text-[9px] mt-1 leading-tight text-gray-900">
                        {formatShortNumber(car.kms)} kms | {car.type}{" "}
                        {car.seats} seater | {car.fuel} | {car.transmission}
                      </p>
                    </div>
                  </div>

                  {/* Right Sidebar */}
                  <div className="flex flex-col items-end justify-between p-1">
                    <span className="p-[3px] bg-gray-100 rounded-xs active:scale-95 active:bg-white transition-all duration-300">
                      <AiFillHeart className="w-3 h-3 text-green-600" />
                    </span>
                  </div>
                </div>

                {/* Mobile bottom */}
                <div className="flex items-center justify-between pl-2 pr-1">
                  <div className="text-[8px] flex items-center text-gray-900">
                    <MapPinIcon className="w-[10px] h-[10px] mr-1 text-gray-900" />
                    {car.location}
                  </div>
                  <div>
                    <p className="font-bold text-xs flex items-center gap-2 text-gray-900">
                      Rs. {formatShortNumber(car.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {seller.cars.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">
              No saved cars found.
            </p>
          )}
        </div>
      ) : (
        // Card View
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
          {seller.cars.map((car) => (
            <div className="bg-white rounded-md shadow-lg overflow-hidden flex flex-col w-auto relative mb-3 lg:mb-0">
              <div className="relative">
                <img
                  src={car.image}
                  alt={`${car.title}`}
                  className="w-full h-36 lg:h-48 object-cover rounded-sm"
                  loading="lazy"
                />
                <span className="absolute top-2 right-2 flex gap-2 items-end justify-end">
                  <button
                    className="bg-white p-1 rounded-sm text-lg"
                    aria-label="like"
                  >
                    <AiFillHeart className="w-4 h-4 text-green-600" />
                  </button>
                  <button
                    className="bg-white rounded-sm text-lg"
                    aria-label="share"
                  >
                    {/* Share icon */}
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

              <div className="py-4 px-2 flex-1 flex flex-col">
                <div className="flex justify-between items-end mb-1 gap-4">
                  <h3 className="text-sm font-semibold leading-tight text-gray-800 truncate">
                    {car.title}
                  </h3>
                  <span className="min-w-12 text-[8px]">{"2 min ago"}</span>
                </div>

                <p className="text-[9px] font-[500] text-black whitespace-nowrap overflow-hidden text-ellipsis mb-1">
                  {car.type} {` ${car.seats} Seater`} | {car.fuel} |{" "}
                  {car.transmission}
                </p>

                <div className="flex items-end justify-between mb-3">
                  <div className="space-y-2">
                    <p className="text-[9px] text-gray-600 mb-1 capitalize">
                      {seller.name || "Unknown"}{" "}
                      <span className="text-[8px] text-gray-600">
                        ({seller.role || "Unknown"})
                      </span>
                    </p>
                    <p className="flex items-center gap-1 text-[8px] capitalize bg-[#CFCFCF] rounded-xs w-fit py-[2px] pl-1 pr-2 mt-2">
                      <MapPin size={8} /> {car.location || "Unknown"}
                    </p>
                  </div>
                  <span className="text-md font-bold text-gray-900 -mb-1">
                    ₹ {formatPriceToLakh(car.price ?? 0)}
                  </span>
                </div>

                <Link
                  to={`/buy-car/${car.id}`}
                  className="group"
                  // onClick={handleViewMore}
                >
                  <button className="flex items-center justify-center w-full mx-auto border border-gray-500 gap-2 text-[11px] font-semibold group-hover:text-gray-700 text-gray-900 py-1 rounded transition cursor-pointer">
                    View More
                    <span className="rounded-full bg-gray-900 group-hover:bg-gray-700 transition">
                      <ChevronRight size={10} className="text-white p-[1px]" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
