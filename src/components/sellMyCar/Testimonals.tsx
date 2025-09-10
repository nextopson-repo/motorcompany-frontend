import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import "swiper/css";

const testimonials = [
  {
    id: 1,
    date: "12 Mar, 2024",
    bgImg: "/Testimonals/card-1.png",
    profileImg: "/Testimonals/profile-logo.png",
    name: "Savannah Nguyen",
    location: "Guwahati",
    rating: 4.7,
    text: "Kia Syros Long Term Introduction: Third Time's The Cha Citroen eC3 1000 km",
    description:
      "After fleeting experiences that left me with mixed feelings for Kia’s rather ingenious SUV, it is feelings for Kia’s rather is After fleeting experiences that left me with mixed feeling...",
  },
  {
    id: 2,
    date: "12 Mar, 2024",
    bgImg: "/Testimonals/card-2.png",
    profileImg: "/Testimonals/profile-logo.png",
    name: "Dianne Russell",
    location: "Guwahati",
    rating: 4.7,
    text: "Kia Syros Long Term Introduction: Third Time's The Cha Citroen eC3 1000 km",
    description:
      "After fleeting experiences that left me with mixed feelings for Kia’s rather ingenious SUV, it is feelings for Kia’s rather is After fleeting experiences that left me with mixed feeling...",
  },
  {
    id: 3,
    date: "12 Mar, 2024",
    bgImg: "/Testimonals/card-3.png",
    profileImg: "/Testimonals/profile-logo.png",
    name: "Bessie Cooper",
    location: "Panaji",
    rating: 3.1,
    text: "Kia Syros Long Term Introduction: Third Time's The Cha Citroen eC3 1000 km",
    description:
      "After fleeting experiences that left me with mixed feelings for Kia’s rather ingenious SUV, it is feelings for Kia’s rather is After fleeting experiences that left me with mixed feeling...",
  },
  {
    id: 4,
    date: "12 Mar, 2024",
    bgImg: "/Testimonals/card-1.png",
    profileImg: "/Testimonals/profile-logo.png",
    name: "Savannah Nguyen",
    location: "Guwahati",
    rating: 4.7,
    text: "Kia Syros Long Term Introduction: Third Time's The Cha Citroen eC3 1000 km",
    description:
      "After fleeting experiences that left me with mixed feelings for Kia’s rather ingenious SUV, it is feelings for Kia’s rather is After fleeting experiences that left me with mixed feeling...",
  },
  {
    id: 5,
    date: "12 Mar, 2024",
    bgImg: "/Testimonals/card-2.png",
    profileImg: "/Testimonals/profile-logo.png",
    name: "Dianne Russell",
    location: "Guwahati",
    rating: 4.7,
    text: "Kia Syros Long Term Introduction: Third Time's The Cha Citroen eC3 1000 km",
    description:
      "After fleeting experiences that left me with mixed feelings for Kia’s rather ingenious SUV, it is feelings for Kia’s rather is After fleeting experiences that left me with mixed feeling...",
  },
  {
    id: 6,
    date: "12 Mar, 2024",
    bgImg: "/Testimonals/card-3.png",
    profileImg: "/Testimonals/profile-logo.png",
    name: "Bessie Cooper",
    location: "Panaji",
    rating: 3.1,
    text: "Kia Syros Long Term Introduction: Third Time's The Cha Citroen eC3 1000 km",
    description:
      "After fleeting experiences that left me with mixed feelings for Kia’s rather ingenious SUV, it is feelings for Kia’s rather is After fleeting experiences that left me with mixed feeling...",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="w-full mx-auto pt-12 pb-6 px-4 font-montserrat mb-4 relative">
      {/* Heading */}
      <div className="text-xs text-center mb-10">
        <p className="text-[#EE1422] font-semibold flex items-center justify-center gap-4">
          <span className="w-10 h-[1.4px] bg-[#EE1422]/80"></span>
          Testimonials
          <span className="w-10 h-[1.4px] bg-[#EE1422]/80"></span>
        </p>
        <h2 className="text-xl md:text-[23px] leading-7.5 font-bold mt-4">
          Real Stories. Real Experiences. Real
          <br className="hidden md:block" />
          Satisfaction.
        </h2>
        <p className="text-[16px] max-w-2xl mx-auto mt-4 text-gray-800 leading-5.5 px-4">
          Hear from our happy customers! Discover how our products/services have
          made a difference in their lives.
        </p>
      </div>

      <button className="swiper-button-prev1 absolute top-[63%] -translateY-1/2 left-[2.5%] flex items-center justify-center bg-black/90 p-3 rounded-full text-white z-10 hover:scale-[1.1]">
        <FaChevronLeft className="h-5 w-5" />
      </button>
      <button className="swiper-button-next1 absolute top-[63%] -translateY-1/2 right-[2.5%] flex items-center justify-center bg-black/90 p-3 rounded-full text-white z-10 hover:scale-[1.1]">
        <FaChevronRight className="h-5 w-5" />
      </button>

      {/* Swiper */}
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={24}
        slidesPerView={3}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          1024: { slidesPerView: 3 },
          640: { slidesPerView: 2 },
          0: { slidesPerView: 1 },
        }}
        navigation={{
          nextEl: ".swiper-button-next1",
          prevEl: ".swiper-button-prev1",
        }}
        className="max-w-5xl overflow-visible"
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id}>
            <div className="bg-white rounded-xl shadow-md p-4 relative h-full flex flex-col my-2">
              {/* Profile + Rating Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={t.profileImg}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-gray-500 text-thin text-[10px]">
                      {t.date} | {t.location}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-1 mt-[6px]">
                  <div className="flex items-center gap-[2px] text-yellow-400 text-xs">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="text-green-600 font-semibold text-[10px] mt-1">
                    {t.rating} +
                  </p>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xs md:text-sm mb-2 line-clamp-2">
                {t.text} ...
              </h3>

              {/* Review Text */}
              <p className="text-gray-800 text-xs relative z-10 flex-1">
                {t.description}
              </p>

              {/* Read More */}
              <a
                href="#"
                className="text-blue-600 text-[10px] font-medium mt-3 self-end"
              >
                Read More...
              </a>

              {/* Quote Watermark */}
              <span className="absolute bottom-[8%] left-[65%] select-none pointer-events-none leading-none">
                <img
                  src="/quote-close.png"
                  alt="close quote"
                  className="w-[85%] h-[85%]"
                />
              </span>
            </div>
          </SwiperSlide>
        ))}

      </Swiper>

      

    </section>
  );
};

export default Testimonials;
