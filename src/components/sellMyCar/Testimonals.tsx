import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import "swiper/css";

const testimonials = [
  {
    id: 1,
    date: "12 Oct, 2025",
    bgImg: "/Testimonals/card-1.png",
    profileImg: "https://randomuser.me/api/portraits/men/58.jpg", // Example Indian male avatar
    name: "Arjun Patel",
    location: "Ahmedabad, Gujarat",
    rating: 4.8,
    text: "Smooth and fast car buying experience.",
    description:
      "Had a wonderful experience From car selection to test drive , booking and delivery was very smooth. Quick and transparent documentation",
    response:
      "Thank you, Arjun! We are delighted to hear about your positive experience. We strive to keep our marketplace transparent and easy to use.",
  },
  {
    id: 2,
    date: "29 Sep, 2025",
    bgImg: "/Testimonals/card-2.png",
    profileImg: "https://randomuser.me/api/portraits/women/15.jpg", // Example Indian female avatar
    name: "Neha Sharma",
    location: "New Delhi, Delhi",
    rating: 4.6,
    text: "Help to select right car.",
    description:
      "Recently took delivery of Honda. The whole experience experience of purchase was very smooth. We were given time for test ride, understand the product.",
    response:
      "Thanks for your feedback, Neha! Our team is committed to supporting our users at every step and providing great vehicle options.",
  },
  {
    id: 3,
    date: "05 Oct, 2025",
    bgImg: "/Testimonals/card-3.png",
    profileImg: "https://randomuser.me/api/portraits/men/48.jpg",
    name: "Rohit Singh",
    location: "Lucknow, Uttar Pradesh",
    rating: 4.3,
    text: "Good overall, needs faster delivery",
    description:
      "Had a great experience with them. They are supportive and understanding. They provide you a genuine product with the cheap and affordable prices. ",
    response:
      "Thank you, Rohit. We appreciate your honest feedback and are actively working on improving our delivery timelines.",
  },
  {
    id: 4,
    date: "20 Oct, 2025",
    bgImg: "/Testimonals/card-1.png",
    profileImg: "https://randomuser.me/api/portraits/women/54.jpg",
    name: "Pooja Desai",
    location: "Mumbai, Maharashtra",
    rating: 5.0,
    text: "Excellent service and smooth payment",
    description:
      "Good variety of vehicles and they provide valuable inputs on the cars. Also, offer reasonable prices. Good people to deal with.",
    response:
      "We really appreciate your encouraging words, Pooja! We aim to make car buying simple and safe for all our customers.",
  },
  {
    id: 5,
    date: "15 Oct, 2025",
    bgImg: "/Testimonals/card-2.png",
    profileImg: "https://randomuser.me/api/portraits/men/44.jpg",
    name: "Amit Verma",
    location: "Bangalore, Karnataka",
    rating: 4.7,
    text: "Reliable platform with genuine listings",
    description:
      "I could browse many cars and had no worries about security. The transparency helped me trust the platform fully for my purchase.",
    response:
      "Thank you for trusting us, Amit! Transparency and reliability are our core values, and we are glad you experienced that firsthand.",
  },
  {
    id: 6,
    date: "01 Nov, 2025",
    bgImg: "/Testimonals/card-3.png",
    profileImg: "https://randomuser.me/api/portraits/women/40.jpg",
    name: "Sneha Reddy",
    location: "Hyderabad, Telangana",
    rating: 4.5,
    text: "Helpful support and smooth vehicle selection",
    description:
      "Customer support team was very helpful in answering my queries which made choosing a car easier. I highly recommend this platform to friends and family.",
    response:
      "Thanks for your recommendation, Sneha! We're glad our support could assist you. We look forward to helping more customers like you.",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="w-full mx-auto md:pt-12 pb-4 md:pb-6 font-roboto mb-4 relative ">
      {/* Heading */}
      <div className="text-xs text-center mb-2 md:mb-4 px-4">
        <p className="text-[#EE1422] text-[10px] md:text-xs font-semibold flex items-center justify-center gap-2 md:gap-4">
          <span className="w-7 md:w-10  h-px md:h-[1.4px] bg-[#EE1422]/80"></span>
          Testimonials
          <span className="w-7 md:w-10  h-px md:h-[1.4px] bg-[#EE1422]/80"></span>
        </p>
        <h2 className="text-sm lg:text-2xl font-bold mt-2 md:mt-4">
          Real Stories. Real Experiences. Real
          <br />
          Satisfaction.
        </h2>
        <p className="text-[9px] lg:text-[16px] lg:max-w-2xl mx-auto mt-2 lg:mt-4 text-black leading-2.7 md:leading-5.5 tracking-tight md:tracking-none md:px-4">
          Hear from our happy customers! Discover how our products/services have
          made a difference in their lives.
        </p>
      </div>

      <button className="swiper-button-prev1 absolute top-[58%] md:top-[63%] -translateY-1/2 left-[2.5%] hidden md:flex items-center justify-center bg-black/70 p-2 md:p-3 rounded-full text-white z-10 hover:scale-[1.1] active:scale-90">
        <FaChevronLeft className="h-3 md:h-5 w-3 md:w-5" />
      </button>
      <button className="swiper-button-next1 absolute top-[58%] md:top-[63%] -translateY-1/2 right-[2.5%] hidden md:flex items-center justify-center bg-black/70 p-2 md:p-3 rounded-full text-white z-10 hover:scale-[1.1] active:scale-90">
        <FaChevronRight className="h-3 md:h-5 w-3 md:w-5" />
      </button>

      {/* Swiper */}
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={32}
        slidesPerView={3}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          1024: { slidesPerView: 3, spaceBetween: 32 },
          640: { slidesPerView: 2, spaceBetween: 5 },
          0: { slidesPerView: 1, spaceBetween: 5 },
        }}
        navigation={{
          nextEl: ".swiper-button-next1",
          prevEl: ".swiper-button-prev1",
        }}
        className="max-w-5xl overflow-visible"
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id}>
            <div
              className="bg-white rounded-md p-4 relative h-full flex flex-col my-2 m-4"
              style={{
                boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.15)",
              }}
            >
              {/* Profile + Rating Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={t.profileImg}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div className="space-y-1">
                    <p className="font-medium text-xs lg:text-sm whitespace-nowrap truncate text-ellipsis">
                      {t.name}
                    </p>
                    <p className="text-gray-500 text-thin text-[8px] lg:text-[10px]">
                      {t.date} | {t.location}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-[2.5px] text-yellow-400 text-[10px]">
                    {/* {Array.from({ length: 5 }, (_, i) => (
                      <IoStarSharp key={i} className="h-2.5 w-2.5"/>
                    ))} */}
                    {Array.from({ length: 5 }, (_, i) => {
                      const isFilled = i < Math.floor(t.rating);
                      return (
                        <IoStarSharp
                          key={i}
                          className={`h-2.5 w-2.5 ${
                            isFilled ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-green-600 font-semibold text-[10px] mt-1 whitespace-nowrap">
                    {t.rating} +
                  </p>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-[11px] lg:text-xs mb-2 line-clamp-2 text-black font-medium">
                {t.text}
              </h3>

              {/* Review Text */}
              <p className="text-black text-[10px] lg:text-[11px] relative z-10 flex-1 tracking-tight">
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
              <span className="w-24 h-24 absolute bottom-[5%] left-[70%] select-none pointer-events-none leading-none">
                <img
                  src="/quote-close.png"
                  alt="close quote"
                  className="w-full h-full"
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
