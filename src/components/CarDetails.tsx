import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShareAlt, FaWhatsapp } from "react-icons/fa";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CopyIcon,
  Flag,
  Flame,
  MapPin,
  Phone,
  Share2,
  User,
  X,
} from "lucide-react";
import { formatPriceToLakh } from "../utils/formatPrice";
import CarsDetailsSlider from "./CarsDetailsSlider";
import FindDealers from "./FindDealers";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchSelectedCarById } from "../store/slices/carSlice";
import { selectAuth } from "../store/slices/authSlices/authSlice";
import { openLogin } from "../store/slices/authSlices/loginModelSlice";
import { createEnquiry } from "../store/slices/enqueriesSlice";

const CarDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();
  const carsState = useSelector(
    (state: RootState) => state.cars as any | undefined
  );
  const currentUser = useSelector((state: RootState) => state.auth.user?.id);
  const selectedCar = carsState?.selectedCar ?? null;
  const cars = Array.isArray(carsState?.cars) ? carsState!.cars : [];

  useEffect(() => {
    if (id) {
      dispatch(fetchSelectedCarById(id));
    }
  }, [id, dispatch]);

  const { user, token } = useSelector(selectAuth);

  const handleAccess = () => {
    if (!user || !token) {
      dispatch(openLogin());
      return;
    }
    console.log("User logged in, allow to view seller details");
  };

  const [showSellerPopup, setShowSellerPopup] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // safe: use selectedCar first, else try find in cars array; never call .find on non-array
  const car: any =
    selectedCar ??
    (cars.length ? cars.find((c: any) => String(c.id) === String(id)) : null);

  if (!car) {
    return (
      <div className="max-w-7xl h-full mx-auto mt-20 flex items-center justify-center">
        <div className="p-10 text-center text-red-500 text-xl">
          Cars not found
        </div>
      </div>
    );
  }

  // Normalize all car images to URLs
  const images: string[] =
    (Array.isArray(car.carImages) && car.carImages.length
      ? car.carImages.map((img: any) =>
          typeof img === "string" ? img : img.presignedUrl
        )
      : []) ||
    (Array.isArray(car.carDetailsImages) && car.carDetailsImages.length
      ? car.carDetailsImages.map((img: any) =>
          typeof img === "string" ? img : img.presignedUrl
        )
      : []) ||
    (Array.isArray(car.images) && car.images.length
      ? car.images.map((img: any) =>
          typeof img === "string" ? img : img.presignedUrl
        )
      : []) ||
    (car.image ? [car.image] : []);

  const visibleImages = images.length > 0 ? images : ["/fallback-car-img.png"];

  // safe prev/next using visibleImages.length
  const handlePrevImage = () =>
    setMainImageIndex((prev) =>
      prev === 0 ? visibleImages.length - 1 : prev - 1
    );
  const handleNextImage = () =>
    setMainImageIndex((prev) =>
      prev === visibleImages.length - 1 ? 0 : prev + 1
    );

  // map fields (handle different naming)
  const title =
    car.title ??
    `${car.brand ?? ""} ${car.model ?? ""} ${car.varient ?? ""}`.trim();
  const price = car.carPrice ?? car.price ?? 0;
  const manufactureYear = car.manufacturingYear ?? car.year ?? "N/A";
  const registrationYear = car.registrationYear ?? "N/A";
  const ownership = car.ownership ?? "N/A";
  const kms = car.kmDriven ?? car.kms ?? car.kmsDriven ?? 0;
  const seats = car.seats ?? car.noOfSeats ?? null;
  const bodyType = car.bodyType ?? car.body ?? "";
  const fuelType = car.fuelType ?? car.fuel ?? "";
  const transmission = car.transmission ?? "";
  const address = car.address ?? {};
  const carUser = car.user ?? {};
  const userId = carUser.id ?? "";

  // OWNER DETAILS
  const owner = car.owner ?? {};
  const ownerId = owner.id ?? "";
  const ownerName = owner.fullName ?? "N/A";
  const ownerType = owner.userType ?? "N/A";

  // share profile link
  const handleShareCar = async () => {
    const profileUrl = `${window.location.origin}/buy-car/${car.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this profile on Dhikcar",
          text: `Check out ${car.title}'s Car`,
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
    console.log("button clicked");

    const enquiryPayload = {
      carId: car.id,
      userId: currentUser,
      Calling: "",
    };

    await dispatch(createEnquiry(enquiryPayload));

    // 2. Mobile: Initiate call
    if (isMobile()) {
      window.location.href = `tel:${owner.mobileNumber}`;
      return;
    }
    // 3. Desktop: WhatsApp Web
    const whatsAppMsg = encodeURIComponent(
      `Hello, I'm interested in your car listing: ${car.carTitle}.`
    );
    const phoneDigits = owner.mobileNumber.replace(/[^+\d]/g, "");
    window.open(`https://wa.me/${phoneDigits}?text=${whatsAppMsg}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 lg:mt-20 z-0 lg:pt-2">
      {/* Breadcrumb */}
      <nav className="hidden lg:block text-sm text-black font-semibold lg:mx-6">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        {" > "}
        <Link to="/buy-car" className="hover:underline">
          Buy Car
        </Link>
        {" > "}
        <span className="text-black font-semibold underline underline-offset-3">
          {title}
        </span>
      </nav>

      {/* Parent Grid */}
      <div className="relative h-fit lg:grid lg:grid-cols-13 lg:mx-6 lg:my-3 md:gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-9 space-y-6">
          {/* Main Image */}
          <div className="relative z-0">
            <img
              src={visibleImages[mainImageIndex]}
              alt={title}
              className="w-full h-56 sm:h-68 lg:h-96 object-cover lg:rounded-lg shadow"
            />
            {/* Arrows */}
            <button
              onClick={() => {
                handlePrevImage();
              }}
              className="z-50 absolute top-1/2 left-2 -translate-y-1/2 bg-white p-1 lg:p-2 rounded-full shadow hover:bg-gray-200 hover:scale-[1.02] cursor-pointer active:bg-gray-300 active:scale-95"
            >
              <ChevronLeft className="text-black w-4 lg:h-6 h-4 lg:w-6" />
            </button>
            <button
              onClick={() => {
                handleNextImage();
              }}
              className="z-50 absolute top-1/2 right-2 -translate-y-1/2 bg-white p-1 lg:p-2 rounded-full shadow hover:bg-gray-200 hover:scale-[1.02] cursor-pointer active:bg-gray-300 active:scale-95"
            >
              <ChevronRight className="text-black w-4 lg:h-6 h-4 lg:w-6" />
            </button>
          </div>

          {/* Thumbnail Carousel */}
          <div className="hidden relative lg:flex items-center mt-4">
            {/* Prev Button */}
            <button
              onClick={() => {
                const thumbs = document.getElementById("thumbs");
                if (thumbs) {
                  const imgWidth =
                    thumbs.querySelector("img")?.clientWidth || 160;
                  thumbs.scrollBy({ left: -imgWidth - 8, behavior: "smooth" });
                }
              }}
              className="absolute left-0 z-10 bg-gray-900  w-9 h-9 flex items-center justify-center rounded-full shadow hover:bg-gray-800 transition cursor-pointer"
            >
              <ChevronLeft className="text-white" />
            </button>

            {/* Thumbnails */}
            <div
              id="thumbs"
              className="grid grid-cols-4 gap-2 overflow-x-auto scroll-smooth px-5"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {visibleImages.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setMainImageIndex(index)}
                  className={`w-40 h-[120px] object-cover rounded cursor-pointer border-2 transition ${
                    mainImageIndex === index
                      ? "border-green-500"
                      : "border-gray-50/5"
                  }`}
                  alt={`${title} - Image ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => {
                const thumbs = document.getElementById("thumbs");
                if (thumbs) {
                  const imgWidth =
                    thumbs.querySelector("img")?.clientWidth || 160;
                  thumbs.scrollBy({ left: imgWidth + 8, behavior: "smooth" });
                }
              }}
              className="absolute right-0 z-10 bg-gray-900 w-9 h-9 flex items-center justify-center rounded-full shadow hover:bg-gray-800 transition cursor-pointer"
            >
              <ChevronRight className="text-white" />
            </button>
          </div>

          {/* */}

          {/*mobile Car Details Card */}
          <div className="lg:hidden bg-white border border-gray-200 p-4 py-6 rounded-2xl space-y-3 shadow z-40 -mt-10">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h1 className="text-lg font-bold">{title}</h1>
                </div>

                <div className="text-[10px] font-semibold">
                  <span>
                    {kms ? `${kms} kms ` : "0 kms"} | {bodyType}{" "}
                    {seats ? `${seats} seater` : ""} | {fuelType} |{" "}
                    {transmission}
                  </span>
                </div>

                <div className="flex items-end gap-2 mb-2">
                  <p className="text-lg font-bold">
                    Rs. {formatPriceToLakh(price)}
                  </p>
                  <p className="text-orange-600 font-semibold text-[10px] mb-1">
                    Make Your Offer
                  </p>
                </div>

                <div className="font-semibold text-[10px]">
                  EMI starts{" "}
                  <span className="font-normal text-green-500 hover:underline cursor-pointer">
                    @ Rs. 6203/mo
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button className="text-green-500 flex flex-col items-center gap-1 cursor-pointer active:scale-95">
                  <span className="border border-gray-200 rounded-sm">
                    <FaHeart size={10} className="m-1" />
                  </span>
                </button>
                <button className="text-red-500 flex flex-col items-center gap-1 cursor-pointer active:scale-95">
                  <span className="border border-gray-200 rounded-sm">
                    <FaShareAlt size={10} className="m-1" />
                  </span>
                </button>
              </div>
            </div>

            {/* Dashed line */}
            <div className="custom-dash"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="text-gray-500 h-[14px] w-[14px]" />
                <span className="text-black text-[10px] leading-tight font-semibold capitalize">
                  {carUser?.fullName ?? "Unknown"}{" "}
                  <span className="text-[8px] text-gray-700">
                    ({carUser?.userType ?? "Unknown"})
                  </span>
                </span>
              </div>

              <div>
                <p className="text-black flex items-center text-[10px]">
                  <MapPin className="text-black mr-1 h-[14px] w-[14px]" />{" "}
                  {address?.city ?? "Unknown"}, {address?.state ?? "Unknown"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (user) {
                  setShowSellerPopup(true);
                } else {
                  handleAccess();
                }
              }}
              className="text-xs lg:text-base w-full bg-black text-white px-6 py-2 rounded-sm hover:bg-black/90 cursor-pointer active:bg-black/90 active:scale-95"
            >
              Contact Seller
            </button>

            {/* Seller Popup */}
            {showSellerPopup && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-50 px-2">
                <div className="bg-white rounded-lg w-full relative ">
                  <div className="flex items-center justify-between bg-[#BEFFC2] p-4 px-4 rounded-t-lg">
                    <span className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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
                      <p className="text-[10px] font-extralight font-roboto tracking-tight text-gray-700">
                        Thank you. Contact seller for more details
                      </p>
                    </span>
                    <button
                      onClick={() => setShowSellerPopup(false)}
                      className="hover:scale-[1.1] cursor-pointer"
                    >
                      <X strokeWidth={2.5} className="h-4 w-4 text-gray-900" />
                    </button>
                  </div>
                  <div className="py-2 px-2">
                    <div className="flex items-center gap-2 py-2">
                      <div className="flex items-center justify-center w-24 h-16">
                        <img src="/user-img.png" alt="seller img" />
                      </div>

                      <div className="flex flex-col gap-2 w-full pb-1 pl-1">
                        <div className="flex items-center justify-between">
                          <h1 className="font-bold text-lg capitalize truncate">
                            {carUser?.fullName || "Unknown"}
                          </h1>
                          <span className="flex items-center gap-2 px-2">
                            <p className="text-[#9e9e9e] bg-[#f4f4f4] p-[2px] px-1 rounded-sm text-[10px]">
                              {carUser?.userType || "N/A"}
                            </p>
                            <Link
                              to={`/seller-details/${userId}`}
                              className="text-sky-500 font-normal text-xs underline"
                            >
                              View
                            </Link>
                          </span>
                        </div>

                        <span className="flex items-center gap-2 text-gray-500 text-sm">
                          <span>+91</span>
                          {carUser?.mobileNumber || "Not Provided"}
                          <button className="px-2 cursor-pointer hover:scale-[1.1]">
                            <CopyIcon className="h-4 w-4 text-black" />
                          </button>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center  gap-2 my-2">
                      <button
                        className="flex items-center justify-center gap-3 w-full hover:font-semibold text-sm p-2 border rounded-sm cursor-pointer active:text-white active:bg-[#24272c]"
                        onClick={handlePhoneClick}
                      >
                        <Phone className=" h-4 w-4" /> Phone
                      </button>
                      <button
                        className="flex items-center justify-center gap-3 w-full hover:font-semibold text-sm p-2 border rounded-sm cursor-pointer active:text-white active:bg-[#24272c]"
                        // onClick={handleWhatsAppClick}
                      >
                        <FaWhatsapp className=" h-5 w-5" /> What's app
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
              <Flame className="text-[#cb202d] h-[14px] w-[14px]" />
              Trending Viewed By {car.views ?? 0} user's
            </p>
          </div>

          {/* Car Overview Table */}
          <div
            className="lg:hidden bg-white lg:pt-4 border-b border-gray-100 pb-2 rounded-2xl border"
            style={{
              boxShadow: "0 1px 5px 1px rgb(0, 0, 0, 0.15)",
            }}
          >
            <h2 className="text-md md:text-xl font-bold px-4 py-2">
              Car Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:px-6">
              {[
                {
                  label: "Year of Manufacture",
                  value: manufactureYear || "N/A",
                },
                {
                  label: "Kms Driven",
                  value: kms ? `${Number(kms).toLocaleString()} Kms` : "N/A",
                },
                {
                  label: "Seats",
                  value: seats ? `${seats} Seats` : "N/A",
                },
                { label: "Transmission", value: transmission || "N/A" },
                {
                  label: "Year of Manufacture",
                  value: manufactureYear || "N/A",
                },
                {
                  label: "Kms Driven",
                  value: kms ? `${Number(kms).toLocaleString()} Kms` : "N/A",
                },
                {
                  label: "Seats",
                  value: seats ? `${seats} Seats` : "N/A",
                },
                { label: "Transmission", value: transmission || "N/A" },
              ].map((item, i, arr) => {
                const isLastRow = i >= arr.length - 3;
                return (
                  <div
                    key={i}
                    className={` p-2 px-4 lg:p-4 lg:px-6 flex items-center justify-between text-xs
                  ${(i + 1) % 3 !== 0 ? "md:border-r border-gray-200" : ""}
                  ${!isLastRow ? "md:border-b border-gray-200" : ""}`}
                  >
                    <span className="w-[70%] text-left">
                      <p className="text-gray-700">{item.label}</p>
                    </span>
                    <span className="w-[30%] text-left">
                      <p className="text-gray-900 font-semibold text-right lg:text-left">
                        {item.value}
                      </p>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          {/* Car Details Card */}
          <div className="border border-gray-100 p-4 rounded-lg space-y-3 shadow">
            <div className="flex items-start justify-between">
              <h1 className="text-lg font-bold">{title}</h1>
              <button className="text-green-500 flex flex-col items-center gap-1 cursor-pointer">
                <span className="border border-gray-200 rounded-sm">
                  <FaHeart size={14} className="m-1" />
                </span>
                <span className="min-w-10 text-gray-500 text-[9px] leading-tight">
                  146 Liked
                </span>
              </button>
            </div>

            <div className="text-[10px] font-semibold">
              <span>
                {kms ? `${kms} kms ` : "0 kms"} | {bodyType}{" "}
                {seats ? `${seats} seater` : ""} | {fuelType} | {transmission}
              </span>
            </div>

            <div className="flex items-end gap-2 mb-2">
              <p className="text-lg font-bold">
                Rs. {formatPriceToLakh(price)}
              </p>
              <p className="text-orange-600 font-semibold text-[10px] mb-1">
                Make Your Offer
              </p>
            </div>

            <div className="font-semibold text-[10px]">
              EMI starts{" "}
              <span className="font-normal text-green-500 hover:underline cursor-pointer">
                @ Rs. 6203/mo
              </span>
            </div>

            {/* Dashed line */}
            <div className="custom-dash"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="text-gray-500 h-[14px] w-[14px]" />
                <span className="text-black text-[10px] leading-tight font-semibold capitalize">
                  {ownerName ?? "Unknown"}{" "}
                  <span className="text-[8px] text-gray-700">
                    ({ownerType ?? "Unknown"})
                  </span>
                </span>
              </div>

              <div>
                <p className="text-black font-semibold flex items-center text-[10px]">
                  <MapPin className="text-black mr-1 h-[14px] w-[14px]" />{" "}
                  {address?.city ?? "Unknown"}, {address?.state ?? "Unknown"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (user) {
                  setShowSellerPopup(true);
                } else {
                  handleAccess();
                }
              }}
              className="w-full text-sm bg-black text-white px-6 py-[6px] rounded-sm hover:bg-black/90 cursor-pointer"
            >
              Contact Seller
            </button>

            {/* Seller Popup */}
            {showSellerPopup && (
              <div className="fixed inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-lg relative ">
                  <div className="flex items-center justify-between bg-[#BEFFC2] p-4 px-8 rounded-t-sm">
                    <span className="flex items-center gap-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
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
                      <p className="text-sm font-extralight font-roboto tracking-tight text-gray-700">
                        Thank you. Contact seller for more details
                      </p>
                    </span>
                    <button
                      onClick={() => setShowSellerPopup(false)}
                      className="hover:scale-[1.1] cursor-pointer"
                    >
                      <X strokeWidth={3.5} className="h-5 w-5 text-gray-900" />
                    </button>
                  </div>
                  <div className="py-3 px-8">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-32 h-24">
                        <img src="/user-img.png" alt="seller img" />
                      </div>

                      <div className="flex flex-col gap-2 w-full pb-3 pl-3">
                        <div className="flex items-center justify-between">
                          <h1 className="font-bold text-2xl capitalize w-[220px] truncate">
                            {ownerName || "Unknown"}
                          </h1>
                          <span className="flex items-center gap-4 px-2">
                            <Link
                              to={`/seller-details/${ownerId}`}
                              className="text-sky-500 font-normal text-xs underline"
                            >
                              View
                            </Link>
                          </span>
                        </div>

                        <span className="flex items-center gap-2 text-gray-500 text-lg">
                          {/* <span>+91</span>
                          {ownerMobile || "Not Provided"}
                          <button className="px-2 cursor-pointer hover:scale-[1.1]">
                            <CopyIcon className="h-5 w-5 text-black" />
                          </button> */}
                          <p className="text-[#9e9e9e] bg-[#f4f4f4] p-1 px-2 rounded-sm">
                            {ownerType || "N/A"}
                          </p>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center  gap-4 my-2">
                      <button className="flex items-center justify-center gap-3 w-full hover:font-semibold text-xl p-2 border rounded-sm cursor-pointer hover:text-white hover:bg-[#24272c]"
                      onClick={handlePhoneClick}
                      >
                        <Phone className=" h-6 w-6" /> Phone
                      </button>
                      <button className="flex items-center justify-center gap-3 w-full hover:font-semibold text-xl p-2 border rounded-sm cursor-pointer hover:text-white hover:bg-[#24272c]">
                        <FaWhatsapp className=" h-6 w-6" /> What's app
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1 pt-1">
              <Flame className="text-[#cb202d] h-[14px] w-[14px]" />
              Trending Viewed By {car.views ?? 0} user's
            </p>
          </div>

          {/* report ad and share buttons */}
          <div className="hidden w-full lg:flex text-gray-400 gap-6 justify-end px-2">
            <span className="flex text-[10px] items-center gap-2 hover:scale-[1.02] cursor-pointer transition-all duration-300">
              <Flag className="h-[14px] w-[14px]" />
              <span className="underline font-light">Report ad</span>
            </span>
            <span className="flex text-[10px] items-center gap-2 hover:scale-[1.02] cursor-pointer transition-all duration-300">
              <Share2 className="h-[14px] w-[14px]" />
              {/* <span className="underline font-light">Share</span> */}
              <button onClick={handleShareCar} className="underline font-light">
                Share
              </button>
            </span>
          </div>

          {/* car overview dropdown */}
          <div className="hidden md:block sticky z-40 space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 w-full max-w-md">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setOpenDropdown(openDropdown === 0 ? null : 0)}
              >
                <h2 className="font-semibold text-sm">Car Overview</h2>
                {openDropdown === 0 ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>

              {openDropdown === 0 && (
                <div className="grid grid-cols-1 mt-2 h-34 overflow-y-auto scrollbar-light">
                  {[
                    {
                      label: "Year of Manufacture",
                      value: manufactureYear || "N/A",
                    },
                    {
                      label: "Kms Driven",
                      value: kms
                        ? `${Number(kms).toLocaleString()} Kms`
                        : "N/A",
                    },
                    {
                      label: "Seats",
                      value: seats ? `${seats} Seats` : "N/A",
                    },
                    { label: "Transmission", value: transmission || "N/A" },

                    {
                      label: "Year of Registration",
                      value: registrationYear || "N/A",
                    },
                    {
                      label: "Ownership",
                      value: ownership ? `${ownership} owner` : "N/A",
                    },
                  ].map((item, i) => {
                    return (
                      <div
                        key={i}
                        className={`p-2 flex justify-between items-center text-xs`}
                      >
                        <p className="text-gray-700">{item.label}</p>
                        <p className="text-gray-900 font-semibold">
                          {item.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Car Towing Banner */}
      <div className="my-6 lg:my-0 relative max-w-7xl h-[150px] lg:h-[280px] lg:mx-5 lg:p-10 flex flex-col justify-around z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/carBanner.png)",
            backgroundPositionX: "center",
            backgroundPositionY: "75%",
          }}
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="relative z-10 text-white space-y-6 ml-4">
          <h1 className="font-semibold text-lg lg:text-5xl leading-5.5 lg:leading-normal">
            Home Test Drive, <br /> Home Delivery
          </h1>
          <p className="text-xs lg:text-3xl ">Buy Comfortably from your home</p>
        </div>
      </div>

      {/* similar cars slider */}
      <div
        className="pb-3 lg:p-6 rounded-2xl lg:rounded-none border lg:border-none border-gray-100 "
        style={{
          boxShadow: "0 1px 10px 1px rgb(0, 0, 0, 0.15)",
        }}
      >
        <div className="flex items-center justify-between mt-4 lg:mt-6 px-4 lg:px-0">
          <h2 className="text-md lg:text-2xl font-semibold py-3 ">
            Similar Cars
          </h2>
          <button
            onClick={() => {
              navigate("/buy-car");
            }}
            className="flex items-center bg-black rounded-sm p-[6px] lg:p-2 px-3 lg:px-6 text-white gap-2 text-[10px] lg:text-base"
          >
            View All{" "}
            <ChevronRight className="h-3 lg:h-4 w-3 lg:w-4 text-white" />
          </button>
        </div>
        <CarsDetailsSlider carsData={cars} />
      </div>

      {/* top dealer container */}
      <div className="my-10">
        <FindDealers />
      </div>
    </div>
  );
};

export default CarDetails;
