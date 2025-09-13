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
    <div className="h-full max-w-8xl relative my-14 z-0 mx-auto">
      <div className="w-full max-h-[500px] lg:max-h-[300px] absolute top-0 left-0 -z-1">
        <img
          src="/contact-us-bg.png"
          alt="contact us background"
          className="w-full h-full  lg:object-cover object-center"
        />
      </div>

      <div className="min-h-1/3 max-w-2xl text-center lg:pt-32 pb-8 text-white mx-auto space-y-6">
        <h1 className="text-3xl font-semibold">Feel Free to Get in Touch</h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud{" "}
        </p>
      </div>

      {/* contact us form here */}
      <div className="max-w-5xl h-full mx-2 sm:mx-4 md:mx-auto grid grid-cols-1 md:grid-cols-2 bg-gray-100 rounded-xl shadow-lg overflow-hidden z-10">
        {/* Left info panel */}
        <div className="p-8 py-10 bg-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="space-y-6 border-b border-gray-400 pb-6">
              <div className="flex items-start gap-3">
                <span className="bg-red-500 rounded-full p-2">
                  <MapPin className="h-6 w-6 text-white" />
                </span>
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-gray-600 text-sm">
                    8502 Preston Rd, Inglewood, Maine 98380
                  </p>
                  <p className="text-gray-600 text-sm">Maine 98380</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-red-500 rounded-full p-2">
                  <Mail className="h-6 w-6 text-white" />
                </span>
                <div>
                  <p className="font-semibold">Email Us</p>
                  <p className="text-gray-600 text-sm">example@email.com</p>
                  <p className="text-gray-600 text-sm">example@email.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-red-500 rounded-full p-2">
                  <Phone className="h-6 w-6 text-white" />
                </span>
                <div>
                  <p className="font-semibold">Call Us</p>
                  <p className="text-gray-600 text-sm">+1 555 0126</p>
                  <p className="text-gray-600 text-sm">+1 555 0126</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-xl font-semibold mr-6">
              {" "}
              Contact With Us :
            </span>
            <a href="#" className="bg-red-500 text-white p-2 rounded">
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a href="#" className="bg-red-500 text-white p-2 rounded">
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a href="#" className="bg-red-500 text-white p-2 rounded">
              <YoutubeIcon className="h-4 w-4" />
            </a>
            <a href="#" className="bg-red-500 text-white p-2 rounded">
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Right form panel */}
        <div className="p-6 shadow-2xl rounded-lg bg-white">
          <h2 className="text-2xl font-bold mb-4">Send us a message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <span>
                <label htmlFor="firstName" className="text-xs ">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={data.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="bg-gray-100 rounded p-2 w-full placeholder:text-sm"
                  required
                />
              </span>
              <span>
                <label htmlFor="firstName" className="text-xs ">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={data.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="bg-gray-100 rounded p-2 w-full placeholder:text-sm"
                  required
                />
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <span>
                <label htmlFor="firstName" className="text-xs ">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="bg-gray-100 rounded p-2 w-full placeholder:text-sm"
                  required
                />
              </span>
              <span>
                <label htmlFor="firstName" className="text-xs ">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="bg-gray-100 rounded p-2 w-full placeholder:text-sm"
                  required
                />
              </span>
            </div>
            <span>
              <label htmlFor="firstName" className="text-xs ">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={data.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="bg-gray-100 rounded p-2 w-full placeholder:text-sm"
                required
              />
            </span>
            <span>
              <label htmlFor="firstName" className="text-xs ">
                Message
              </label>
              <textarea
                name="message"
                value={data.message}
                onChange={handleChange}
                placeholder="Write your message here"
                className="bg-gray-100 rounded p-2 w-full placeholder:text-sm h-32 resize-none"
                required
              />
            </span>

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded text-white ${
                status === "loading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
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
      </div>

      {/* 4 cards end */}
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-4 lg:my-10 px-14">
        {fourCards.map((card, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center rounded-sm shadow-xs p-4 gap-3"
          >
            <img
              src={card.img}
              alt={card.title}
              className="w-16 h-12 object-contain rounded-sm"
            />
            <div className="flex flex-col gap-3">
              <p className="text-md font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                {card.title}
              </p>
              <p className="text-xs text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis -mt-2">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
