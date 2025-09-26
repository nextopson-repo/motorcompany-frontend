import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { toggleBrand, resetFilters } from "../../store/slices/filterSlice";
import { useState } from "react";

interface Props {
  onClose: () => void;
}

const brands = [
  {
    title: "Tata",
    logo: "/CarsLogo/tata-motors.png",
    description: "120 Cars Available",
  },
  {
    title: "Honda",
    logo: "/CarsLogo/honda.png",
    description: "120 Cars Available",
  },
  {
    title: "Mahindra",
    logo: "/CarsLogo/mahindra.png",
    description: "120 Cars Available",
  },
  {
    title: "Hyundai",
    logo: "/CarsLogo/hyundai.png",
    description: "120 Cars Available",
  },
  {
    title: "Ford",
    logo: "/CarsLogo/ford.png",
    description: "120 Cars Available",
  },
  {
    title: "Volkswagen",
    logo: "/CarsLogo/volkswagon.png",
    description: "120 Cars Available",
  },
  {
    title: "Maruti Suzuki",
    logo: "/CarsLogo/maruti-suzuki.png",
    description: "120 Cars Available",
  },
  {
    title: "Suzuki",
    logo: "/CarsLogo/suzuki.png",
    description: "120 Cars Available",
  },
  {
    title: "Audi",
    logo: "/CarsLogo/Audi.png",
    description: "120 Cars Available",
  },
  {
    title: "BMW",
    logo: "/CarsLogo/BMW.png",
    description: "120 Cars Available",
  },
  {
    title: "Range Rover",
    logo: "/CarsLogo/RangeRover.png",
    description: "20 Cars Available",
  },
  {
    title: "Ferrari",
    logo: "/CarsLogo/Ferrari.png",
    description: "5 Cars Available",
  },
];

const BrandModelFilter: React.FC<Props> = ({ onClose }) => {
  const selectedBrands = useSelector((state: RootState) => state.filters.brand);
  const dispatch = useDispatch();

  const [currentSlide, setCurrentSlide] = useState(0);
  const brandsPerSlide = 9; // 2 rows × 3 columns
  const totalSlides = Math.ceil(brands.length / brandsPerSlide);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (index: number) => setCurrentSlide(index);

  const getCurrentBrands = () => {
    const startIndex = currentSlide * brandsPerSlide;
    return brands.slice(startIndex, startIndex + brandsPerSlide);
  };

  const handleShowCars = () => {
    onClose();
  };

  return (
    <div className="fixed left-0 bottom-0 w-full bg-white shadow-lg rounded-t-lg px-4 py-4 z-20 border border-gray-200">
      <h3 className="font-semibold mb-2">Select a Car Brand</h3>

      <div className="lg:hidden relative pt-2 pb-4">
        <div className="grid grid-cols-3 gap-2 gap-y-4 max-w-xs mx-auto">
          {getCurrentBrands().map((brand) => (
            <div
              key={brand.title}
              onClick={() => dispatch(toggleBrand(brand.title))}
              className={`flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform p-1 rounded ${
                selectedBrands.includes(brand.title)
                  ? "shadow-md scale-[1.05]"
                  : ""
              }`}
            >
              <div className="w-10 h-7 mb-2">
                <img
                  src={brand.logo}
                  alt={brand.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="font-semibold text-[9px]">{brand.title}</p>
              <p className="text-gray-500 text-[9px] mt-1">
                {brand.description}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full flex items-center justify-around px-24 mt-6">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors active:scale-95"
            disabled={currentSlide === 0}
          >
            <svg
              className={`w-5 h-5 ${
                currentSlide === 0 ? "text-gray-200" : "text-gray-400"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index ? "bg-gray-800" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors active:scale-95"
            disabled={currentSlide === totalSlides - 1}
          >
            <svg
              className={`w-5 h-5 ${
                currentSlide === totalSlides - 1
                  ? "text-gray-200"
                  : "text-gray-400"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.59 16.09l4.58-4.59-4.58-4.59L10 5.5l6 6-6 6z" />
            </svg>
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            className="w-full py-1 bg-gray-200 rounded-xs text-xs active:scale-95"
            onClick={() => {
              dispatch(resetFilters());
              onClose();
            }}
          >
            Clear Filter
          </button>
          <button
            className="w-full py-1 bg-black text-white rounded-xs text-xs active:scale-95"
            onClick={handleShowCars}
          >
            Show Cars
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandModelFilter;

// // src/components/filters/BrandModelFilter.tsx
// "use client";

// import { useSelector, useDispatch } from "react-redux";
// import type { RootState } from "../../store/store";
// import { toggleBrand } from "../../store/slices/filterSlice";

// interface Props {
//   onClose: () => void;
// }

// const brands = ["Maruti Suzuki", "Hyundai", "Honda", "Tata", "Renault", "Kia"];

// const BrandModelFilter: React.FC<Props> = ({ onClose }) => {
//   const selectedBrands = useSelector((state: RootState) => state.filters.brand);
//   const dispatch = useDispatch();

//   return (
//     <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded p-3 z-20">
//       <h3 className="font-semibold mb-2">Brand + Models</h3>
//       <div className="space-y-2 max-h-60 overflow-y-auto">
//         {brands.map((brand) => (
//           <label key={brand} className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={selectedBrands.includes(brand)}
//               onChange={() => dispatch(toggleBrand(brand))}
//             />
//             <span>{brand}</span>
//           </label>
//         ))}
//       </div>

//       <div className="flex justify-between mt-3">
//         <button
//           className="px-3 py-1 bg-gray-200 rounded"
//           onClick={onClose}
//         >
//           Close
//         </button>
//         <button
//           className="px-3 py-1 bg-red-500 text-white rounded"
//           onClick={onClose}
//         >
//           Show Cars
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BrandModelFilter;
