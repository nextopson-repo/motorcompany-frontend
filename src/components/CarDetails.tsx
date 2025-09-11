import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { carsData } from "../data/cars";
import { FaHeart } from "react-icons/fa";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Flame,
  MapPin,
  Share2,
  User,
} from "lucide-react";
import { formatPriceToLakh } from "../utils/formatPrice";
import CarsDetailsSlider from "./CarsDetailsSlider";
import FindDealers from "./FindDealers";

// Accordion item (future use)
// const AccordionItem = ({ title, content, isOpen, onClick }) => {
//   return (
//     <div className="rounded-lg overflow-hidden shadow-sm bg-white">
//       {/* Header */}
//       <button
//         onClick={onClick}
//         className="w-full flex justify-between items-center p-4 font-semibold bg-white hover:bg-gray-50 transition"
//       >
//         {title}
//         <ChevronDown
//           className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {/* Content */}
//       {isOpen && (
//         <div className="p-4 text-sm bg-gray-50">
//           {content}
//         </div>
//       )}
//     </div>
//   );
// };

const CarDetails = () => {
  const { id } = useParams();
  const car = carsData.find((c) => c.id.toString() === id);

  const [mainImageIndex, setMainImageIndex] = useState(0);
  // const [openIndex, setOpenIndex] = useState(0); // first one open by default

  if (!car) {
    return (
      <div className="p-10 text-center text-red-500 text-xl">Car not found</div>
    );
  }

  const handlePrevImage = () => {
    setMainImageIndex((prev) =>
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setMainImageIndex((prev) =>
      prev === car.images.length - 1 ? 0 : prev + 1
    );
  };

  // Accordion data (future use)
  // const accordionSections = [
  //   {
  //     title: "Specifications",
  //     content: (
  //       <table className="w-full text-sm">
  //         <tbody>
  //           <tr className="border-b border-gray-200 flex items-center justify-between">
  //             <td className="py-2 ">Registration year</td>
  //             <td className="py-2 font-medium text-[#cb202d]">Nov 2018</td>
  //           </tr>
  //           <tr className="border-b border-gray-200 flex items-center justify-between">
  //             <td className="py-2 ">No. Of Cylinder</td>
  //             <td className="py-2 font-medium text-[#cb202d]">8 cylinders</td>
  //           </tr>
  //           <tr className="border-b border-gray-200 flex items-center justify-between">
  //             <td className="py-2 ">Kms Driven</td>
  //             <td className="py-2 font-medium text-[#cb202d]">2,00,000 Kms</td>
  //           </tr>
  //           <tr className="flex items-center justify-between">
  //             <td className="py-2 ">GearBox</td>
  //             <td className="py-2 font-medium text-[#cb202d]">8 Boxes</td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     ),
  //   },
  //   {
  //     title: "Engine & Transmission",
  //     content: (
  //       <table className="w-full text-sm">
  //        <tbody>
  //           <tr className="border-b border-gray-200 flex items-center justify-between">
  //             <td className="py-2 font-medium">Engine Type</td>
  //             <td className="py-2 text-[#cb202d]">Diesel</td>
  //           </tr>
  //           <tr className="border-b border-gray-200 flex items-center justify-between">
  //             <td className="py-2 font-medium">Displacement</td>
  //             <td className="py-2 text-[#cb202d]">1969 cc</td>
  //           </tr>
  //           <tr className="flex items-center justify-between">
  //             <td className="py-2 font-medium">Transmission</td>
  //             <td className="py-2 text-[#cb202d]">Automatic</td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     ),
  //   },
  //   {
  //     title: "Suspension, Steering & Brakes",
  //     content: (
  //       <table className="w-full text-sm">
  //         <tbody>
  //           <tr className="border-b border-gray-200 flex items-center justify-between">
  //             <td className="py-2 font-medium">Engine Type</td>
  //             <td className="py-2 text-[#cb202d]">Diesel</td>
  //           </tr>
  //           <tr className="border-b border-gray-200 flex items-center justify-between">
  //             <td className="py-2 font-medium">Displacement</td>
  //             <td className="py-2 text-[#cb202d]">1969 cc</td>
  //           </tr>
  //           <tr className="flex items-center justify-between">
  //             <td className="py-2 font-medium">Transmission</td>
  //             <td className="py-2 text-[#cb202d]">Automatic</td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     ),
  //   },
  //   {
  //     title: "Dimensions & Capacity",
  //     content: (
  //       <table className="w-full text-sm">
  //         <tbody>
  //           <tr className="border-b border-gray-200 flex items-center justify-between">
  //             <td className="py-2 font-medium">Engine Type</td>
  //             <td className="py-2 text-[#cb202d]">Diesel</td>
  //           </tr>
  //           <tr className="border-b border-gray-200 flex items-center justify-between">
  //             <td className="py-2 font-medium">Displacement</td>
  //             <td className="py-2 text-[#cb202d]">1969 cc</td>
  //           </tr>
  //           <tr className="flex items-center justify-between">
  //             <td className="py-2 font-medium">Transmission</td>
  //             <td className="py-2 text-[#cb202d]">Automatic</td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     ),
  //   },
  //   {
  //     title: "Fuel & Performance",
  //     content: (
  //       <table className="w-full text-sm">
  //         <tbody>
  //           <tr className="border-b border-gray-200 flex items-center justify-between">
  //             <td className="py-2 font-medium">Engine Type</td>
  //             <td className="py-2 text-[#cb202d]">Diesel</td>
  //           </tr>
  //           <tr className="border-b border-gray-200 flex items-center justify-between">
  //             <td className="py-2 font-medium">Displacement</td>
  //             <td className="py-2 text-[#cb202d]">1969 cc</td>
  //           </tr>
  //           <tr className="flex items-center justify-between">
  //             <td className="py-2 font-medium">Transmission</td>
  //             <td className="py-2 text-[#cb202d]">Automatic</td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     ),
  //   },
  // ];

  return (
    <div className="max-w-7xl mx-auto mt-20 font-montserrat">
      {/* Breadcrumb */}
      <nav className="text-sm text-black mb-6 m-6">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        {" > "}
        <Link to="/buy-car" className="hover:underline">
          Buy Car
        </Link>
        {" > "}
        <span className="text-black font-semibold underline underline-offset-3">
          {car.title}
        </span>
      </nav>

      {/* Parent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-13 m-6 md:gap-6">
        {/* LEFT SIDE */}
        <div className="col-span-9 space-y-6">
          {/* Main Image */}
          <div className="relative">
            <img
              src={car.images[mainImageIndex]}
              alt={car.title}
              className="w-full h-96 object-cover rounded-lg shadow"
            />
            {/* Arrows */}
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 hover:scale-[1.02] cursor-pointer"
            >
              <ChevronLeft className="text-black" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 hover:scale-[1.02] cursor-pointer"
            >
              <ChevronRight className="text-black" />
            </button>
          </div>

          {/* Thumbnail Carousel */}
          <div className="relative flex items-center mt-4">
            {/* Prev Button */}
            <button
              onClick={() => {
                const thumbs = document.getElementById("thumbs");
                if (thumbs) {
                  const imgWidth =
                    thumbs.querySelector("img")?.clientWidth || 160; // w-40 ≈ 160px
                  thumbs.scrollBy({ left: -imgWidth - 8, behavior: "smooth" }); // -8 for gap
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
              {car.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setMainImageIndex(index)}
                  className={`w-40 h-[120px] object-cover rounded cursor-pointer border-2 transition ${
                    mainImageIndex === index
                      ? "border-green-500"
                      : "border-gray-50/5"
                  }`}
                  alt={`${car.title} - Image ${index + 1}`}
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

          {/* Car Overview Table */}
          <div className="bg-white py-6 rounded-lg shadow-md">
            <h2 className="text-md md:text-xl font-bold px-6 py-2">
              Car Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 text-sm md:px-6">
              {[
                { label: "Registration Year", value: `${car.year}` },
                { label: "Year of Manufacture", value: `${car.year}` },
                {
                  label: "Kms Driven",
                  value: `${car.kms.toLocaleString()} Kms`,
                },
                { label: "Seats", value: `${car.seater} Seats` },
                // { label: "Top Speed", value: "210 kmph" },
                // { label: "No. of Cylinder", value: "4" },
                { label: "Transmission", value: car.transmission },
                { label: "Fuel", value: car.fuelTypes },
                {
                  label: "Engine",
                  value: car.specs.Engine || car.specs.Motor || "N/A",
                },
                { label: "Power", value: car.specs.Power || "N/A" },
                // { label: "Gearbox", value: car.gear },
                { label: "Drive Type", value: "FWD" },
              ].map((item, i, arr) => {
                const isLastRow = i >= arr.length - 3; // last 3 items
                return (
                  <div
                    key={i}
                    className={`p-4 flex items-center justify-between text-xs md:text-sm
            ${(i + 1) % 3 !== 0 ? "md:border-r border-gray-200" : ""}
            ${!isLastRow ? "md:border-b border-gray-200" : ""}`}
                  >
                    <p className="text-gray-700">{item.label}</p>
                    <p className="text-gray-900 font-medium">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-4 space-y-6">
          {/* Car Details Card */}
          <div className="border border-gray-100 p-4 rounded-lg space-y-3 shadow">
            <div className="flex items-start justify-between">
              <h1 className="text-lg font-bold">{car.title}</h1>
              <button className="text-green-500 flex flex-col items-center gap-1 cursor-pointer">
                <span className="border border-gray-200 rounded-sm">
                  <FaHeart size={14} className="m-1" />
                </span>
                <span className="min-w-10 text-gray-500 text-[9px] leading-tight">
                  146 Liked
                </span>
              </button>
            </div>

            <div className="text-xs font-semibold">
              <span>{car.kms} kms</span> |{" "}
              <span>
                {car.bodyType} {car.seater}seater
              </span>{" "}
              | <span>{car.mileage} kmpl</span> | <span>{car.fuelTypes}</span> |{" "}
              <span>{car.transmission}</span>
            </div>

            <div className="flex items-end gap-2 mb-3">
              <p className="text-lg font-bold">
              Rs. {formatPriceToLakh(car.price)}
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
                <span className="text-black text-[10px] leading-tight font-semibold">
                  Sourav Jha{" "}
                  <span className="text-[8px] text-gray-700">(Owner)</span>
                </span>
              </div>

              <div>
                <p className="text-black flex items-center text-[10px]">
                  <MapPin className="text-black mr-1 h-[14px] w-[14px]" />{" "}
                  {car.location.city}, {car.location.state} - 450001
                </p>
              </div>
            </div>

            <button className="w-full bg-black text-white px-6 py-[6px] rounded-sm hover:bg-black/90 cursor-pointer">
              Contact Seller
            </button>

            <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1 pt-1">
              <Flame className="text-[#cb202d] h-[14px] w-[14px]" />
              Trending Viewed By {car.views} user's
            </p>
          </div>

          {/* report ad and share buttons */}
          <div className=" w-full flex text-gray-400 gap-6 justify-end px-2">
            <span className="flex text-[10px] items-center gap-2 hover:scale-[1.02] cursor-pointer transition-all duration-300">
              <Flag className="h-[14px] w-[14px]" />
              <span className="underline font-light">Report ad</span>
            </span>
            <span className="flex text-[10px] items-center gap-2 hover:scale-[1.02] cursor-pointer transition-all duration-300">
              <Share2 className="h-[14px] w-[14px]" />
              <span className="underline font-light">Share</span>
            </span>
          </div>

          {/* Accordion UI  (future use)*/}
          {/* <div className="space-y-2">
            {accordionSections.map((section, i) => (
              <AccordionItem
                key={i}
                title={section.title}
                content={section.content}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div> */}
        </div>
      </div>

      {/* Car Towing Banner */}
      <div className="relative max-w-7xl h-[300px] mx-5 p-10 flex flex-col justify-around">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/carBanner.png)" }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-white space-y-6">
          <h1 className="font-semibold text-5xl">
            Home Test Drive, <br /> Home Delivery
          </h1>
          <p className="text-3xl ">Buy Comfortably from your home</p>
        </div>
      </div>

      {/* slider */}
      <div className="m-6">
        <h2 className="text-xl font-semibold mt-10 py-4 px-2">Similar Cars</h2>
        <CarsDetailsSlider carsData={carsData} />
      </div>

      {/* top dealer container */}
      <div className="my-6">
        <FindDealers />
      </div>
    </div>
  );
};

export default CarDetails;
