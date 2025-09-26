import { useDispatch } from "react-redux";
import { resetFilters, setCity } from "../../store/slices/filterSlice";
import { useState } from "react";

interface Props {
  onClose: () => void;
}

const cities = [
  { name: "Chandigarh", cars: 2023, img: "/Cities/Chandigarh.png" },
  { name: "Ahmedabad", cars: 2023, img: "/Cities/Ahemdabad.png" },
  { name: "Pune", cars: 2023, img: "/Cities/pune.png" },
  { name: "Hyderabad", cars: 2023, img: "/Cities/hyderabad.png" },
  { name: "Kanpur", cars: 2023, img: "/Cities/Kanpur.png" },
  { name: "Indore", cars: 2023, img: "/Cities/Indore.png" },
  { name: "Lucknow", cars: 2023, img: "/Cities/Lucknow.png" },
  { name: "Delhi", cars: 2023, img: "/Cities/Delhi.png" },
  { name: "Bhopal", cars: 2023, img: "/Cities/Bhopal.png" },
  { name: "Jaipur", cars: 2023, img: "/Cities/jaipur.png" },
];

const LocationFilter: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const citiesPerSlide = 6; // 2 rows × 3 columns
  const totalSlides = Math.ceil(cities.length / citiesPerSlide);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (slideIndex: number) => setCurrentSlide(slideIndex);

  const getCurrentCities = () => {
    const startIndex = currentSlide * citiesPerSlide;
    return cities.slice(startIndex, startIndex + citiesPerSlide);
  };

  const handleShowCars = () => {
    if (selectedCity) {
      dispatch(setCity(selectedCity));
    }
    onClose();
  };

  return (
    <div className="fixed left-0 bottom-0 w-full bg-white shadow-lg rounded px-4 py-4 z-20 rounded-t-lg border border-gray-200">
      <h3 className="font-semibold mb-1">Select City</h3>

      <div className="lg:hidden relative pt-2 pb-4">
        <div className="grid grid-cols-3 gap-2 gap-y-4 max-w-xs mx-auto">
          {getCurrentCities().map((city) => (
            <div
              key={city.name}
              onClick={() => setSelectedCity(city.name)}
              className={`flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform p-1 rounded ${
                selectedCity === city.name ? "shadow-md scale-[1.05]" : ""
              }`}
            >
              <div className="w-10 h-7 mb-2">
                <img
                  src={city.img}
                  alt={city.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="font-semibold text-[9px]">{city.name}</p>
              <span className="text-gray-400 text-[7px] mt-1">
                {city.cars} Cars Available
              </span>
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
              setSelectedCity(null);
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

export default LocationFilter;