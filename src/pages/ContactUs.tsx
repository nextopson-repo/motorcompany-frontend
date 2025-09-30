import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  updateField,
  submitContactForm,
  type ContactFormData,
} from "../store/slices/contactSlice";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  Mail,
  MapPin,
  Phone,
  YoutubeIcon,
} from "lucide-react";

export default function ContactUs() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status, error } = useSelector(
    (state: RootState) => state.contact
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(
      updateField({
        field: e.target.name as keyof ContactFormData,
        value: e.target.value,
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(submitContactForm(data));
    console.log(data);
  };

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

  return (
    <div className="bg-white h-full max-w-8xl relative mt-12 md:my-14 z-0 mx-auto font-roboto">
      <div className="bg-white w-full h-[140px] sm:h-auto lg:max-h-[300px] absolute top-0 left-0 -z-1">
        <img
          src="/contact-us-bg-1.avif"
          alt="contact us background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="min-h-1/3 px-4 md:px-0 max-w-[250px] sm:max-w-xl lg:max-w-2xl sm:text-center pt-14 sm:pt-18 lg:pt-32 pb-2 sm:pb-8 text-white sm:mx-auto sm:space-y-6">
        <h1 className="text-xs sm:text-xl lg:text-3xl font-semibold">
          Feel Free to Get in Touch
        </h1>
        <p className="text-[8px] md:text-sm">
          Get in touch with us for any car sale, purchase, or resell inquiries.
          Our dedicated team is here to assist you with quick support, reliable
          guidance, and the best deals to make your car journey smooth and
          hassle-free. Reach out today and let us help you drive your dream
          forward.
        </p>
      </div>

      {/* contact us form here */}
      <div className="max-w-4xl h-full sm:mx-auto px-2 sm:px-0 grid grid-cols-1 sm:grid-cols-18 sm:bg-gray-100 rounded-md overflow-hidden z-10 contact-form-shadow">
        {/* Left info panel */}
        <div className="hidden col-span-8 p-8 py-10 bg-gray-100 sm:flex flex-col justify-between">
          <div className="mt-2">
            <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
            <p className="text-gray-600 mb-8 text-[10px]">
              Have questions or need assistance with buying, selling, or
              reselling your car? Our team is here to provide fast support and
              reliable guidance.
            </p>
            <div className="space-y-6 border-b border-gray-400 pb-6">
              <div className="flex items-start gap-3">
                <span className="bg-red-500 rounded-full p-2">
                  <MapPin className="h-6 w-6 text-white" />
                </span>
                <div>
                  <p className="text-sm text-gray-800 mb-1 font-semibold">
                    Address
                  </p>
                  <p className="text-black text-[10px]">
                    8502 Preston Rd, Inglewood, Maine 98380
                  </p>
                  <p className="text-black text-[10px]">Maine 98380</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-red-500 rounded-full p-2">
                  <Mail className="h-6 w-6 text-white" />
                </span>
                <div>
                  <p className="text-sm text-gray-800 mb-1 font-semibold">
                    Email Us
                  </p>
                  <p className="text-black text-[10px]">example@email.com</p>
                  <p className="text-black text-[10px]">example@email.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-red-500 rounded-full p-2">
                  <Phone className="h-6 w-6 text-white" />
                </span>
                <div>
                  <p className="text-sm text-gray-800 mb-1 font-semibold">
                    Call Us
                  </p>
                  <p className="text-black text-[10px]">+1 555 0126</p>
                  <p className="text-black text-[10px]">+1 555 0126</p>
                </div>
              </div>
            </div>
          </div>

          <div className="my-4 flex items-center gap-3">
            <span className="text-sm font-semibold mr-6">
              {" "}
              Contact With Us :
            </span>
            <a href="#" className="bg-red-500 text-white p-2 rounded-xs">
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a href="#" className="bg-red-500 text-white p-2 rounded-xs">
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a href="#" className="bg-red-500 text-white p-2 rounded-xs">
              <YoutubeIcon className="h-4 w-4" />
            </a>
            <a href="#" className="bg-red-500 text-white p-2 rounded-xs">
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Right form panel */}
        <div className="col-span-10 px-2 sm:px-8 py-4 sm:py-8 rounded-lg sm:bg-white contact-form-shadow">
          <h2 className="text-xs md:text-2xl font-bold mb-4 text-center sm:text-left">
            Send us a message
          </h2>
          <form className="space-y-1 md:space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-4">
              <span>
                <label htmlFor="firstName" className="text-[9px] md:text-xs">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={data.firstName}
                  onChange={handleChange}
                  placeholder="Jhon"
                  className="bg-gray-100 text-xs rounded p-[6px] px-2 md:px-4 w-full placeholder:text-[10px]"
                  required
                />
              </span>
              <span>
                <label htmlFor="firstName" className="text-[9px] md:text-xs">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={data.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="bg-gray-100 text-xs rounded p-[6px] px-2 md:px-4 w-full placeholder:text-[10px]"
                  required
                />
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-4">
              <span>
                <label htmlFor="firstName" className="text-[9px] md:text-xs ">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="bg-gray-100 text-xs rounded p-[6px] px-2 md:px-4 w-full placeholder:text-[10px]"
                  required
                />
              </span>
              <span>
                <label htmlFor="firstName" className="text-[9px] md:text-xs ">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="jhonfoe@xyz.com"
                  className="bg-gray-100 text-xs rounded p-[6px] px-2 md:px-4 w-full placeholder:text-[10px]"
                  required
                />
              </span>
            </div>
            <span>
              <label htmlFor="firstName" className="text-[9px] md:text-xs ">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={data.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="bg-gray-100 rounded p-[6px] px-2 md:px-4 w-full placeholder:text-[10px]"
                required
              />
            </span>
            <span>
              <label htmlFor="firstName" className="text-[9px] md:text-xs ">
                Message
              </label>
              <textarea
                name="message"
                value={data.message}
                onChange={handleChange}
                placeholder="Write your message here"
                className="bg-gray-100 text-xs rounded p-[6px] px-2 md:px-4 w-full placeholder:text-[10px] h-14 md:h-24 resize-none"
                required
              />
            </span>

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-xs md:rounded text-white mt-2 md:mt-6 ${
                status === "loading"
                  ? "text-xs bg-gray-400 cursor-not-allowed"
                  : "text-xs bg-red-500 hover:bg-red-600"
              }`}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>

            {status === "succeeded" && (
              <p className="text-green-500 font-semibold mt-2">
                Message sent successfully!
              </p>
            )}
            {status === "failed" && (
              <p className="text-red-500 mt-2">{error}</p>
            )}
          </form>
        </div>

        {/*mobile Left info panel */}
        <div
          className="bg-[#FFFAFA] sm:hidden col-span-8 mt-2 md:mt-0 p-2 md:p-8 py-4 md:py-10 flex flex-col justify-between"
          style={{
            boxShadow: "0px 0px 45px -6px rgba(0, 0, 0, 0.07)",
          }}
        >
          <div className="mt-2 border-b border-gray-400 ">
            <h2 className="text-xs text-center font-bold mb-4">Get in touch</h2>
            <p className="text-gray-600 mb-4 text-[9px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-start gap-2 col-span-2">
                <span className="bg-red-500 rounded-full p-2">
                  <MapPin className="h-3 w-3 text-white" />
                </span>
                <div>
                  <p className="text-xs text-gray-800 mb-1 font-semibold">
                    Address
                  </p>
                  <p className="text-black text-[10px]">
                    8502 Preston Rd, Inglewood, Maine 98380
                  </p>
                  <p className="text-black text-[10px]">Maine 98380</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-red-500 rounded-full p-2">
                  <Mail className="h-3 w-3 text-white" />
                </span>
                <div>
                  <p className="text-xs text-gray-800 mb-1 font-semibold">
                    Email Us
                  </p>
                  <p className="text-black text-[10px]">example@email.com</p>
                  <p className="text-black text-[10px]">example@email.com</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-red-500 rounded-full p-2">
                  <Phone className="h-3 w-3 text-white" />
                </span>
                <div>
                  <p className="text-xs text-gray-800 mb-1 font-semibold">
                    Call Us
                  </p>
                  <p className="text-black text-[10px]">+1 555 0126</p>
                  <p className="text-black text-[10px]">+1 555 0126</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs font-semibold">Contact With Us :</span>
            <a href="#" className="bg-red-500 text-white p-1 rounded-xs">
              <FacebookIcon className="h-3 w-3" />
            </a>
            <a href="#" className="bg-red-500 text-white p-1 rounded-xs">
              <LinkedinIcon className="h-3 w-3" />
            </a>
            <a href="#" className="bg-red-500 text-white p-1 rounded-xs">
              <YoutubeIcon className="h-3 w-3" />
            </a>
            <a href="#" className="bg-red-500 text-white p-1 rounded-xs">
              <InstagramIcon className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 cards end */}
      <div className="bg-white p-2 lg:p-6 py-8 sm:py-0 mb-2 sm:my-10 md:pt-4 rounded-sm grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-8 px-4 lg:px-14">
        {fourCards.map((card, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 items-center justify-center rounded-sm p-2 md:p-4 py-4 md:py-7 md:gap-3 shadow-custom"
          >
            <img
              src={card.img}
              alt={card.title}
              className="w-8 md:w-16 h-6 md:h-12 object-contain"
            />
            <div className="col-span-2 flex flex-col md:gap-3">
              <p className="text-[10px] md:text-md font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                {card.title}
              </p>
              <p className="text-[8px] md:text-xs font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis md:-mt-2">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
