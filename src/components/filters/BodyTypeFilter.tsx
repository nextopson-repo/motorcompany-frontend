import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { toggleBrand, resetFilters } from "../../store/slices/filterSlice";
import { useState } from "react";

interface Props {
  onClose: () => void;
}

const bodyTypes = [
  { id: 1, name: "Hatchback", vehicles: 26, img: "/CarCategories/hatchback.png" },
  { id: 2, name: "SUV", vehicles: 26, img: "/CarCategories/suv.png" },
  { id: 3, name: "Sedan Car", vehicles: 26, img: "/CarCategories/sedan.png" },
  { id: 4, name: "MUV", vehicles: 125, img: "/CarCategories/muv.png" },
  { id: 5, name: "Convertible", vehicles: 132, img: "/CarCategories/convertable.png" },
  { id: 6, name: "Coupe", vehicles: 26, img: "/CarCategories/coupe1.png" },
];

const BodyTypeFilter: React.FC<Props> = ({ onClose }) => {
  const selectedBodyTypes = useSelector((state: RootState) => state.filters.brand);
  const dispatch = useDispatch();

  const [currentSlide, setCurrentSlide] = useState(0);
  const bodyTypesPerSlide = 6; // 2 rows × 3 columns
  const totalSlides = Math.ceil(bodyTypes.length / bodyTypesPerSlide);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (index: number) => setCurrentSlide(index);

  const getCurrentBodyTypes = () => {
    const startIndex = currentSlide * bodyTypesPerSlide;
    return bodyTypes.slice(startIndex, startIndex + bodyTypesPerSlide);
  };

  const handleShowCars = () => {
    onClose();
  };

  return (
    <div className="fixed left-0 bottom-0 w-full bg-white shadow-lg rounded-t-lg px-4 py-4 z-20 border border-gray-200">
      <h3 className="font-semibold mb-2">Select a Car Brand</h3>

      <div className="lg:hidden relative pt-2 pb-4">
        <div className="grid grid-cols-3 gap-2 gap-y-4 max-w-xs mx-auto">
          {getCurrentBodyTypes().map((bodyTypes) => (
            <div
              key={bodyTypes.id}
              onClick={() => dispatch(toggleBrand(bodyTypes.name))}
              className={`flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform p-1 rounded ${
                selectedBodyTypes.includes(bodyTypes.name)
                  ? "shadow-md scale-[1.05]"
                  : ""
              }`}
            >
              <div className="w-10 h-7 mb-2">
                <img
                  src={bodyTypes.img}
                  alt={bodyTypes.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="font-semibold text-[9px]">{bodyTypes.name}</p>
              <p className="text-gray-500 text-[9px] mt-1">
                {bodyTypes.vehicles}
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

export default BodyTypeFilter;