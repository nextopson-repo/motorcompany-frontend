// pages/settings/Saved.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  EllipsisVerticalIcon,
  MapPinIcon,
  FlameIcon,
} from "lucide-react";
import { AiFillHeart } from "react-icons/ai";

const Saved: React.FC = () => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const listings = [
    {
      id: 1,
      title: "2021 Renault KWID Climber 1.0 MT Opt",
      kms: "30,000 kms",
      type: "SUV 5 Seater",
      mileage: "19.4 Kmpl",
      fuel: "Petrol",
      transmission: "Manual",
      location: "Kurla East, Mumbai - 700986",
      price: "Rs. 9.78 Lakhs",
      liked: 146,
      trending: 9850,
      sold: true,
      image: "/car-1.jpg",
      date: "10/08/2025",
    },
    {
      id: 2,
      title: "2021 Hyundai Venue SX 1.0 Turbo",
      kms: "42,000 kms",
      type: "SUV 5 Seater",
      mileage: "18.2 Kmpl",
      fuel: "Petrol",
      transmission: "Automatic",
      location: "Thane West, Mumbai - 400601",
      price: "Rs. 10.50 Lakhs",
      liked: 210,
      trending: 12000,
      sold: false,
      image: "/car-2.jpg",
      date: "12/08/2025",
    },
    {
      id: 3,
      title: "2020 Maruti Baleno Alpha 1.2",
      kms: "25,500 kms",
      type: "Hatchback 5 Seater",
      mileage: "21.1 Kmpl",
      fuel: "Petrol",
      transmission: "Manual",
      location: "Andheri East, Mumbai - 400069",
      price: "Rs. 7.20 Lakhs",
      liked: 180,
      trending: 8900,
      sold: false,
      image: "/car-3.jpg",
      date: "14/08/2025",
    },
    {
      id: 4,
      title: "2019 Honda City VX 1.5 i-VTEC",
      kms: "55,000 kms",
      type: "Sedan 5 Seater",
      mileage: "17.4 Kmpl",
      fuel: "Petrol",
      transmission: "Manual",
      location: "Bandra West, Mumbai - 400050",
      price: "Rs. 9.95 Lakhs",
      liked: 240,
      trending: 13500,
      sold: false,
      image: "/car-4.jpg",
      date: "16/08/2025",
    },
  ];

  const handleMenuToggle = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAction = (action: string, id: number) => {
    console.log(`${action} clicked for listing ${id}`);
    setOpenMenuId(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div className=" max-w-6xl mx-auto px-4 py-4">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-2">Saved Cars</h1>
      <p className="text-gray-600 mb-4">
        Cars you have saved will appear here.
      </p>

      {listings.length === 0 ? (
        <p className="text-gray-600">You haven't saved any cars yet.</p>
      ) : (
        <div className="space-y-4">
          {listings.map((car) => (
            <div
              key={car.id}
              className={`flex flex-col lg:flex-row border border-[#cb202d] rounded-md overflow-hidden bg-white p-2`}
            >
              {/* Left Image */}
              <div className="w-full lg:w-48 flex-shrink-0 relative">
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-full h-40 lg:h-35 object-cover rounded"
                />
              </div>

              {/* Middle Content */}
              <div className="flex-1 px-4 flex flex-col justify-between">
                <div>
                  <h3
                    className={`font-semibold text-md `}
                  >
                    {car.title}
                  </h3>
                  <p
                    className={`text-xs mt-1 text-gray-600`}
                  >
                    {car.kms} | {car.type} | {car.mileage} | {car.fuel} |{" "}
                    {car.transmission}
                  </p>
                  <div
                    className={`flex items-center text-sm mt-2  text-gray-600`}
                  >
                    <MapPinIcon className="w-4 h-4 text-[#cb202d] mr-1" />
                    {car.location}
                  </div>
                </div>

                <div className="mt-1">
                  <p
                    className={`font-bold text-lg`}
                  >
                    {car.price}
                  </p>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-full lg:w-44 flex flex-row lg:flex-col justify-between text-sm text-gray-600 gap-3 py-1 pr-1">
                <div className="flex items-center justify-between">
                  <span></span>
                  <div className="relative" ref={menuRef}>
                    <EllipsisVerticalIcon
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => handleMenuToggle(car.id)}
                    />
                    {openMenuId === car.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
                        <button
                          onClick={() =>
                            handleAction("Remove from Saved", car.id)
                          }
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded text-red-500"
                        >
                          Remove from Saved
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-end pr-2">Added on {car.date}</p>
                  <div className="flex items-center justify-around">
                    <div
                      className={`flex items-center gap-1`}
                    >
                      <AiFillHeart className="w-4 h-4 text-red-500" />
                      <span className="text-xs">Liked {car.liked}</span>
                    </div>
                    <div
                      className={`flex items-center gap-1`}
                    >
                      <FlameIcon className="w-4 h-4 text-red-600" />
                      <span className="text-xs">Views {car.trending}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
