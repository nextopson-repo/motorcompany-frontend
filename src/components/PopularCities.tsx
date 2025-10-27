import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLocation } from "../store/slices/locationSlice";
import type { AppDispatch } from "../store/store";
import { updateSelectedFilter } from "../store/slices/carSlice";
import { useNavigate } from "react-router-dom";

const cities = [
  { name: "Chandigarh", cars: 2023, img: "/Cities/Chandigarh.png" },
  { name: "Ahmedabad", cars: 2023, img: "/Cities/Ahemdabad.png" },
  { name: "Pune", cars: 2023, img: "/Cities/pune.png" },
  { name: "Hyderabad", cars: 2023, img: "/Cities/hyderabad.png" },
  { name: "Kanpur", cars: 2023, img: "/Cities/Kanpur.png" },
  { name: "Surat", cars: 2023, img: "/Cities/Indor.png" }, //update image
  { name: "Lucknow", cars: 2023, img: "/Cities/Lucknow.png" },
  { name: "Delhi", cars: 2023, img: "/Cities/Delhi.png" },
  { name: "Mumbai", cars: 2023, img: "/Cities/Bhopa.png" }, //update image]
  { name: "Jaipur", cars: 2023, img: "/Cities/jaipur.png" },
];

const fourCards = [
  {
    title: "India's #1",
    img: "/Indias.png",
    description: "Largest Car Portal",
  },
  {
    title: "Cars Sold",
    img: "/carSold.png",
    description: "Every 4 Minute",
  },
  {
    title: "Offers",
    img: "/offers.png",
    description: "Stay Updated Pay less",
  },
  {
    title: "Compare",
    img: "/compare.png",
    description: "Decode the right car",
  },
];

const PopularCities: React.FC = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const citiesPerSlide = 6; // 2 rows × 3 columns
  const totalSlides = Math.ceil(cities.length / citiesPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const getCurrentCities = () => {
    const startIndex = currentSlide * citiesPerSlide;
    return cities.slice(startIndex, startIndex + citiesPerSlide);
  };

  // in city card click handler
const handleCityClick = (cityName: string) => {
  dispatch(setLocation(cityName));
  dispatch(updateSelectedFilter({ key: 'location', value: [cityName] }));
  Navigate('/buy-car');
};

  return (
    <section className="w-full max-w-7xl pt-6 lg:pt-12 custom-bg">
      {/* Heading */}
      <div className="text-center">
        <p className="text-[#EE1422] font-semibold text-[9px] md:text-xs mb-2 md:mb-4 flex items-center justify-center gap-3 md:gap-5">
          <span className="w-7 md:w-10 h-[1px] md:h-[1.5px] bg-[#EE1422]"></span>
          Location based Cars
          <span className="w-7 md:w-10 h-[1px] md:h-[1.5px] bg-[#EE1422]"></span>
        </p>
        <h2 className="text-sm md:text-2xl font-bold md:font-semibold">
          Search by Popular Cities
        </h2>
      </div>

      {/* Mobile Slider */}
      <div className="sm:hidden relative pt-6 pb-8">
        {/* Cities Container - 2 rows × 3 columns */}
        <div className="grid grid-cols-3 gap-4 gap-y-6 max-w-xs mx-auto">
          {getCurrentCities().map((city) => (
            <div
              key={city.name}
              className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleCityClick(city.name)}
            >
              <div className="w-12 h-9 mb-2">
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

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-[30%] bottom-3 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          disabled={currentSlide === 0}
        >
          <svg 
            className={`w-5 h-5 ${currentSlide === 0 ? 'text-gray-200' : 'text-gray-400'}`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-[30%] bottom-3 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          disabled={currentSlide === totalSlides - 1}
        >
          <svg 
            className={`w-5 h-5 ${currentSlide === totalSlides - 1 ? 'text-gray-200' : 'text-gray-400'}`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M8.59 16.09l4.58-4.59-4.58-4.59L10 5.5l6 6-6 6z"/>
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? 'bg-gray-800' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Cities Grid */}
      <div className="max-w-4xl mx-auto hidden sm:grid sm:grid-cols-5 gap-2 lg:gap-8 pt-4 pb-4 lg:pb-12">
        {cities.map((city) => (
          <div
            key={city.name}
            className="flex flex-col items-center text-center lg:space-y-1 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleCityClick(city.name)}
          >
            <div className="w-12 lg:w-24 h-9 lg:h-20">
              <img src={city.img} alt="city img" className="w-full h-full object-bottom object-contain"/>
            </div>
            <p className="font-semibold text-[9px] md:text-[13px] mt-2">{city.name}</p>
            <span className="text-gray-400 text-[7px] md:text-[10px] mt-[1px] md:mt-0">
              {city.cars} Cars Available
            </span>
          </div>
        ))}
      </div>

      {/* 4 cards end */}
      <div className="bg-white p-2 py-4 mb-2 md:mb-0 lg:py-10 rounded-sm md:rounded-none grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-8 lg:border-t border-gray-200 w-full lg:max-w-6xl mx-auto">
        {fourCards.map((card, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 items-center justify-center rounded-sm p-2 px-4 md:p-4 py-4 md:py-7 md:gap-3 shadow-custom"
          >
            <img
              src={card.img}
              alt={card.title}
              className="w-8 md:w-16 h-7 md:h-12 object-contain"
            />
            <div className="col-span-2 flex flex-col md:gap-3">
              <p className="text-[10px] sm:text-xs lg:text-[1rem] font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                {card.title}
              </p>
              <p className="text-[8px] sm: lg:text-xs font-semibold lg:font-normal text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis md:-mt-2">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularCities;