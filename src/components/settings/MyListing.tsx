import {
  EllipsisVerticalIcon,
  MapPinIcon,
  FlameIcon,
  Download,
  SearchIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyListing = () => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [listings, setListings] = useState<any[]>([]);
  const navigate = useNavigate();

  // Fetch cars dynamically
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?.id;

        if (!userId) return;

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/car/get-user-cars`,
          { userId }
        );
        console.log("🚀 Listings fetched:", res.data.cars);
        setListings(res.data.cars || []);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  const handleMenuToggle = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAction = async (action: string, id: number) => {
    try {
      if (action === "Mark as Sold") {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/car/mark-sold`,
          { carId: id }
        );
        setListings((prev) =>
          prev.map((car) => (car.id === id ? { ...car, isSold: true } : car))
        );
      } else if (action === "Delete") {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/car/delete`,
          { carId: id }
        );
        setListings((prev) => prev.filter((car) => car.id !== id));
      }
      setOpenMenuId(null);
    } catch (error) {
      console.error(`${action} failed:`, error);
    }
  };

  // Outside click detect
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

  // Helper function for formatting
  const formatShortNumber = (num: number, isKm = false) => {
    if (!num) return isKm ? "0 km" : "0";
    if (num >= 10000000)
      return (
        (num / 10000000).toFixed(1).replace(/\.0$/, "") +
        "Cr" +
        (isKm ? " km" : "")
      );
    if (num >= 100000)
      return (
        (num / 100000).toFixed(1).replace(/\.0$/, "") +
        " Lakh" +
        (isKm ? " km" : "")
      );
    if (num >= 1000)
      return (
        (num / 1000).toFixed(1).replace(/\.0$/, "") + " K" + (isKm ? " km" : "")
      );
    return num + (isKm ? " km" : "");
  };

  return (
    <div>
      {/* Top bar */}
      <div className="grid grid-cols-3 justify-between items-center mb-6">
        <div className="w-fit whitespace-nowrap">
          <h1 className="font-semibold text-2xl">My Listings</h1>
        </div>
        <div className="w-full flex justify-end gap-2 col-span-2 ">
          <span className="w-[60%] flex items-center gap-2 bg-gray-100 rounded-sm px-4 py-2">
            <SearchIcon className="w-4 h-4 text-black" />
            <input
              type="text"
              placeholder="Search for Cars, Brands, Model..."
              className="w-full focus:outline-none text-xs text-black placeholder:text-black"
            />
          </span>

          <div className="gap-2 flex items-center col-span-2 whitespace-nowrap">
            <button className="bg-black text-white px-4 py-2 rounded-sm flex items-center gap-2 text-xs">
              Download Leads
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {listings.map((car) => (
          <div
            key={car.id}
            className={`flex flex-col lg:flex-row rounded-md border border-gray-100 p-2 overflow-hidden bg-white ${
              car.isSold ? "opacity-40" : ""
            }`}
          >
            {/* Left Image */}
            <div className="w-full lg:w-48 flex-shrink-0 relative">
              <img
                src={
                  car.carImages && car.carImages.length > 0
                    ? car.carImages[0]
                    : "/car-1.jpg"
                }
                alt={car.carName}
                className="w-full h-40 lg:h-35 object-cover rounded"
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

            {/* Middle Content */}
            <div className="flex-1 px-4 flex flex-col justify-between">
              {/* Title + Details */}
              <div className="space-y-2">
                <h3
                  className={`font-semibold text-md ${
                    car.isSold ? "text-gray-500" : "text-gray-900"
                  }`}
                >
                  {car.title}
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    car.isSold ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {formatShortNumber(car.kmDriven, true)} | {car.bodyType} |{" "}
                  {car.seats} seater | {car.fuelType} | {car.transmission}
                </p>
                <div
                  className={`text-xs flex items-center mt-2 ${
                    car.isSold ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  <MapPinIcon
                    className={`w-4 h-4 mr-1 ${
                      car.isSold ? "text-gray-400" : "text-gray-900"
                    }`}
                  />
                  {car.address.city}, {car.address.state}
                </div>
              </div>

              {/* Price */}
              <div className="mt-3">
                <p
                  className={`font-bold text-lg flex items-center gap-2 ${
                    car.isSold ? "text-gray-500" : "text-gray-900"
                  }`}
                >
                  Rs. {formatShortNumber(car.price)}
                </p>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-44 flex flex-row lg:flex-col justify-between text-sm text-gray-600 gap-3 pr-1">
              <div className="flex items-center justify-between">
                <span></span>

                <span className="flex items-start gap-3">
                  {/* Likes */}
                  <button
                    className="bg-white p-1 rounded-sm text-lg flex flex-col items-center gap-1"
                    aria-label="like"
                  >
                    <span className="rounded-sm p-1 bg-gray-100 shadow-md border border-gray-50">
                      <AiFillHeart className="w-4 h-4 text-green-600" />
                    </span>
                    <span className="text-[8px] w-[50px]">
                      {car.liked || 0} Peoples Liked
                    </span>
                  </button>
                  {/* 3 dots menu */}
                  <div className="relative mt-[6px]" ref={(el) => (menuRefs.current[car.id] = el)}>
                    <EllipsisVerticalIcon
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => handleMenuToggle(car.id)}
                    />
                    {openMenuId === car.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            navigate("/sell", { state: { editCar: car } });
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded cursor-pointer"
                        >
                          Edit
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            handleAction("Mark as Sold", car.id);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded cursor-pointer"
                        >
                          Mark as Sold
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            handleAction("Delete", car.id);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded cursor-pointer text-green-500"
                        >
                          Delete
                        </div>
                      </div>
                    )}
                  </div>
                </span>
              </div>

              <div className="space-y-1">
                <div>
                  <p className="text-[9px] text-end">
                    Added on{" "}
                    {car.time}
                  </p>
                </div>
                <div className="flex items-center justify-end">
                  <div
                    className={`flex items-center justify-center gap-1 ${
                      car.isSold ? "text-gray-400" : ""
                    }`}
                  >
                    <FlameIcon className="w-4 h-4 text-red-600" />
                    <span className="text-[9px]">
                      Trending Viewed by {car.trending || 0} users
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {listings.length === 0 && (
          <p className="text-gray-500 text-sm">No cars found.</p>
        )}
      </div>
    </div>
  );
};

export default MyListing;

// import {
//   EllipsisVerticalIcon,
//   MapPinIcon,
//   FlameIcon,
//   Download,
//   SearchIcon,
// } from "lucide-react";
// import { useState, useRef, useEffect } from "react";
// import { AiFillHeart } from "react-icons/ai";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const MyListing = () => {
//   const [openMenuId, setOpenMenuId] = useState<number | null>(null);
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const [listings, setListings] = useState<any[]>([]);
//   const navigate = useNavigate();

//   // Fetch cars dynamically
//   useEffect(() => {
//     const fetchListings = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("user") || "{}");
//         const userId = user?.id;

//         if (!userId) return;

//         const res = await axios.post(
//           `${import.meta.env.VITE_BACKEND_URL}/api/v1/car/get-user-cars`,
//           { userId }
//         );
//         setListings(res.data.cars || []);
//       } catch (error) {
//         console.error("Error fetching listings:", error);
//       }
//     };

//     fetchListings();
//   }, []);

//   const handleMenuToggle = (id: number) => {
//     setOpenMenuId(openMenuId === id ? null : id);
//   };

//   const handleAction = (action: string, id: number) => {
//     console.log(`${action} clicked for listing ${id}`);
//     setOpenMenuId(null);
//   };

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setOpenMenuId(null);
//       }
//     };

//     if (openMenuId !== null) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [openMenuId]);

//   // Helper function for formatting
//   const formatShortNumber = (num: number, isKm = false) => {
//     if (num >= 10000000)
//       return (
//         (num / 10000000).toFixed(1).replace(/\.0$/, "") +
//         "Cr" +
//         (isKm ? " km" : "")
//       );
//     if (num >= 100000)
//       return (
//         (num / 100000).toFixed(1).replace(/\.0$/, "") +
//         " Lakh" +
//         (isKm ? " km" : "")
//       );
//     if (num >= 1000)
//       return (
//         (num / 1000).toFixed(1).replace(/\.0$/, "") + " K" + (isKm ? " km" : "")
//       );
//     return num + (isKm ? " km" : "");
//   };

//   return (
//     <div className="">
//       {/* Top bar */}
//       <div className="grid grid-cols-3 justify-between items-center mb-6">
//         <div className="w-fit whitespace-nowrap">
//           <h1 className="font-semibold text-2xl">My Listings</h1>
//         </div>
//         <div className="w-full flex justify-end gap-2 col-span-2 ">
//           <span className="w-[60%] flex items-center gap-2 bg-gray-100 rounded-sm px-4 py-2">
//             <SearchIcon className="w-4 h-4 text-black" />
//             <input
//               type="text"
//               placeholder="Search for Cars, Brands, Model..."
//               className="w-full focus:outline-none text-xs text-black placeholder:text-black"
//             />
//           </span>

//           <div className="gap-2 flex items-center col-span-2 whitespace-nowrap">
//             <button className="bg-black text-white px-4 py-2 rounded-sm flex items-center gap-2 text-xs">
//               Download Leads
//               <Download size={14} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Listings */}
//       <div className="space-y-4">
//         {listings.map((car) => (
//           <div
//             key={car.id}
//             className={`flex flex-col lg:flex-row rounded-md border border-gray-100 p-2 overflow-hidden bg-white ${
//               car.sold ? "opacity-40" : ""
//             }`}
//           >
//             {/* Left Image */}
//             <div className="w-full lg:w-48 flex-shrink-0 relative">
//               <img
//                 src={
//                   car.images && car.images.length > 0
//                     ? car.images[0]
//                     : "/car-1.jpg"
//                 }
//                 alt={car.title}
//                 className="w-full h-40 lg:h-35 object-cover rounded"
//               />
//               {car.sold && (
//                 <span className="absolute inset-0 flex items-center justify-center bg-black/40">
//                   <img
//                     src="/sold-img.png"
//                     alt="Sold"
//                     className="w-24 opacity-90"
//                   />
//                 </span>
//               )}
//             </div>

//             {/* Middle Content */}
//             <div className="flex-1 px-4 flex flex-col justify-between">
//               {/* Title + Details */}
//               <div className="space-y-2">
//                 <h3
//                   className={`font-semibold text-md ${
//                     car.sold ? "text-gray-500" : "text-gray-900"
//                   }`}
//                 >
//                   {car.title}
//                 </h3>
//                 <p
//                   className={`text-xs mt-1 ${
//                     car.sold ? "text-gray-400" : "text-gray-900"
//                   }`}
//                 >
//                   {formatShortNumber(car.kmDriven, true)} | {car.bodyType} |{" "}
//                   {car.seats} seater | {car.fuel} | {car.transmission}
//                 </p>
//                 <div
//                   className={`text-xs flex items-center mt-2 ${
//                     car.sold ? "text-gray-400" : "text-gray-900"
//                   }`}
//                 >
//                   <MapPinIcon
//                     className={`w-4 h-4 mr-1 ${
//                       car.sold ? "text-gray-400" : "text-gray-900"
//                     }`}
//                   />
//                   {car.address.city}, {car.address.state}
//                 </div>
//               </div>

//               {/* Price */}
//               <div className="mt-3">
//                 <p
//                   className={`font-bold text-lg flex items-center gap-2 ${
//                     car.sold ? "text-gray-500" : "text-gray-900"
//                   }`}
//                 >
//                   Rs. {formatShortNumber(car.price)}
//                 </p>
//               </div>
//             </div>

//             {/* Right Sidebar (likes + menu + trending) */}
//             <div className="w-full lg:w-44 flex flex-row lg:flex-col justify-between text-sm text-gray-600 gap-3 py- pr-1">
//               <div className="flex items-center justify-between">
//                 <span></span>

//                 <span className="flex items-start gap-3">
//                   {/* Likes */}
//                   <button
//                     className="bg-white p-1 rounded-sm text-lg flex flex-col items-center gap-1"
//                     aria-label="like"
//                   >
//                     <span className="rounded-sm p-1 bg-gray-100 shadow-md border border-gray-50">
//                       <AiFillHeart className="w-4 h-4 text-green-600" />
//                     </span>
//                     <span className="text-[8px] w-[50px]">
//                       {car.liked} Peoples Liked
//                     </span>
//                   </button>
//                   {/* 3 dots menu */}
//                   <div className="relative mt-[6px]" ref={menuRef}>
//                     <EllipsisVerticalIcon
//                       className="w-5 h-5 cursor-pointer"
//                       onClick={() => handleMenuToggle(car.id)}
//                     />
//                     {openMenuId === car.id && (
//                       <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
//                         <button
//                           onClick={() => navigate("/sell", { state: { editCar: car } })}
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleAction("Mark as Sold", car.id)}
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
//                         >
//                           Mark as Sold
//                         </button>
//                         <button
//                           onClick={() => handleAction("Delete", car.id)}
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded text-green-500"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </span>
//               </div>

//               <div className="space-y-1">
//                 <div>
//                   <p className="text-[9px] text-end">Added on {car.time}</p>
//                 </div>
//                 <div className="flex items-center justify-end">
//                   {/* Trending */}
//                   <div
//                     className={`flex items-center justify-center gap-1 ${
//                       car.sold ? "text-gray-400" : ""
//                     }`}
//                   >
//                     <FlameIcon className="w-4 h-4 text-red-600" />
//                     <span className="text-[9px]">
//                       Trending Viewed by {car.trending | 0} user's
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

//         {listings.length === 0 && (
//           <p className="text-gray-500 text-sm">No cars found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyListing;

// import {
//   EllipsisVerticalIcon,
//   MapPinIcon,
//   FlameIcon,
//   Download,
//   SearchIcon,
// } from "lucide-react";
// import { useState, useRef, useEffect } from "react";
// import { AiFillHeart } from "react-icons/ai";

// const MyListing = () => {
//   const [openMenuId, setOpenMenuId] = useState<number | null>(null);
//   const menuRef = useRef<HTMLDivElement | null>(null);

//   const listings = [
//     {
//       id: 1,
//       title: "2021 Renault KWID Climber 1.0 MT Opt",
//       kms: "30,000 kms",
//       type: "SUV 5 Seater",
//       mileage: "19.4 Kmpl",
//       fuel: "Petrol",
//       transmission: "Manual",
//       location: "Kurla East, Mumbai - 700986",
//       price: "Rs. 9.78 Lakhs",
//       liked: 146,
//       trending: 9850,
//       sold: true,
//       image: "/car-1.jpg",
//       date: "10/08/2025",
//     },
//     {
//       id: 2,
//       title: "2021 Hyundai Venue SX 1.0 Turbo",
//       kms: "42,000 kms",
//       type: "SUV 5 Seater",
//       mileage: "18.2 Kmpl",
//       fuel: "Petrol",
//       transmission: "Automatic",
//       location: "Thane West, Mumbai - 400601",
//       price: "Rs. 10.50 Lakhs",
//       liked: 210,
//       trending: 12000,
//       sold: false,
//       image: "/car-2.jpg",
//       date: "12/08/2025",
//     },
//     {
//       id: 3,
//       title: "2020 Maruti Baleno Alpha 1.2",
//       kms: "25,500 kms",
//       type: "Hatchback 5 Seater",
//       mileage: "21.1 Kmpl",
//       fuel: "Petrol",
//       transmission: "Manual",
//       location: "Andheri East, Mumbai - 400069",
//       price: "Rs. 7.20 Lakhs",
//       liked: 180,
//       trending: 8900,
//       sold: false,
//       image: "/car-3.jpg",
//       date: "14/08/2025",
//     },
//     {
//       id: 4,
//       title: "2019 Honda City VX 1.5 i-VTEC",
//       kms: "55,000 kms",
//       type: "Sedan 5 Seater",
//       mileage: "17.4 Kmpl",
//       fuel: "Petrol",
//       transmission: "Manual",
//       location: "Bandra West, Mumbai - 400050",
//       price: "Rs. 9.95 Lakhs",
//       liked: 240,
//       trending: 13500,
//       sold: false,
//       image: "/car-4.jpg",
//       date: "16/08/2025",
//     },
//   ];

//   const handleMenuToggle = (id: number) => {
//     setOpenMenuId(openMenuId === id ? null : id);
//   };

//   const handleAction = (action: string, id: number) => {
//     console.log(`${action} clicked for listing ${id}`);
//     setOpenMenuId(null);
//   };

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setOpenMenuId(null);
//       }
//     };

//     if (openMenuId !== null) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [openMenuId]);

//   return (
//     <div className="">
//       {/* Top bar */}
//       <div className="grid grid-cols-3 justify-between items-center mb-6">
//         <div className="w-fit whitespace-nowrap">
//           <h1 className="font-semibold text-2xl">My Listings</h1>
//         </div>
//         <div className="w-full flex justify-end gap-2 col-span-2 ">
//           <span className="w-[60%] flex items-center gap-2 bg-gray-100 rounded-sm px-4 py-2">
//             <SearchIcon className="w-4 h-4 text-black" />
//             <input
//               type="text"
//               placeholder="Search for Cars, Brands, Model..."
//               className="w-full focus:outline-none text-xs text-black placeholder:text-black"
//             />
//           </span>

//           <div className="gap-2 flex items-center col-span-2 whitespace-nowrap">
//             <button className="bg-black text-white px-4 py-2 rounded-sm flex items-center gap-2 text-xs">
//               Download Leads
//               <Download size={14} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Listings */}
//       <div className="space-y-4">
//         {listings.map((car) => (
//           <div
//             key={car.id}
//             className={`flex flex-col lg:flex-row rounded-md overflow-hidden bg-white ${
//               car.sold ? "opacity-40" : ""
//             }`}
//           >
//             {/* Left Image */}
//             <div className="w-full lg:w-48 flex-shrink-0 relative">
//               <img
//                 src={car.image}
//                 alt={car.title}
//                 className="w-full h-40 lg:h-35 object-cover rounded"
//               />
//               {car.sold && (
//                 <span className="absolute inset-0 flex items-center justify-center bg-black/40">
//                   <img
//                     src="/sold-img.png"
//                     alt="Sold"
//                     className="w-24 opacity-90"
//                   />
//                 </span>
//               )}
//             </div>

//             {/* Middle Content */}
//             <div className="flex-1 px-4 flex flex-col justify-between">
//               {/* Title + Details */}
//               <div className="space-y-2">
//                 <h3
//                   className={`font-semibold text-md ${
//                     car.sold ? "text-gray-500" : "text-gray-900"
//                   }`}
//                 >
//                   {car.title}
//                 </h3>
//                 <p
//                   className={`text-xs mt-1 ${
//                     car.sold ? "text-gray-400" : "text-gray-900"
//                   }`}
//                 >
//                   {car.kms} | {car.type} | {car.mileage} | {car.fuel} |{" "}
//                   {car.transmission}
//                 </p>
//                 <div
//                   className={`text-xs flex items-center mt-2 ${
//                     car.sold ? "text-gray-400" : "text-gray-900"
//                   }`}
//                 >
//                   <MapPinIcon className={`w-4 h-4 mr-1 ${car.sold ? "text-gray-400" : "text-gray-900"}`} />
//                   {car.location}
//                 </div>
//               </div>

//               {/* Price */}
//               <div className="mt-3">
//                 <p
//                   className={`font-bold text-lg flex items-center gap-2 ${
//                     car.sold ? "text-gray-500" : "text-gray-900"
//                   }`}
//                 >
//                   {car.price}
//                 </p>
//               </div>
//             </div>

//             {/* Right Sidebar (likes + menu + trending) */}
//             <div className="w-full lg:w-44 flex flex-row lg:flex-col justify-between text-sm text-gray-600 gap-3 py-1 pr-1">
//               <div className="flex items-center justify-between">
//                 <span></span>

//                 <span className="flex items-start gap-3">
//                   {/* Likes */}
//                   <button
//                     className="bg-white p-1 rounded-sm text-lg flex flex-col items-center gap-1"
//                     aria-label="like"
//                   >
//                     <span className="rounded-sm p-1 bg-gray-100 shadow-md border border-gray-50"><AiFillHeart className="w-4 h-4 text-green-600" /></span>
//                     <span className="text-[8px] w-[50px]">{car.liked} Peoples Liked</span>
//                   </button>
//                   {/* 3 dots menu */}
//                   <div className="relative mt-[6px]" ref={menuRef}>
//                     <EllipsisVerticalIcon
//                       className="w-5 h-5 cursor-pointer"
//                       onClick={() => handleMenuToggle(car.id)}
//                     />
//                     {openMenuId === car.id && (
//                       <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
//                         <button
//                           onClick={() => handleAction("Edit", car.id)}
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleAction("Mark as Sold", car.id)}
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
//                         >
//                           Mark as Sold
//                         </button>
//                         <button
//                           onClick={() => handleAction("Delete", car.id)}
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded text-green-500"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </span>
//               </div>

//               <div className="space-y-1">
//                 <div>
//                   <p className="text-[9px] text-end pr-2">
//                     Added on {car.date}
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-around">
//                   {/* Trending */}
//                   <div
//                     className={`flex items-center justify-center gap-1 ${
//                       car.sold ? "text-gray-400" : ""
//                     }`}
//                   >
//                     <FlameIcon className="w-4 h-4 text-red-600" />
//                     <span className="text-[9px]">
//                       Trending Viewed by {car.trending} user's
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyListing;
