import React from "react";
import { Phone } from "lucide-react";

interface Props {
  name: string;
  location: string;
  contact: string;
  budget: string;
  requirements: string;
  timeAgo: string;
  image: string;
}

const RequirementCard: React.FC<Props> = ({
  name,
  location,
  contact,
  budget,
  requirements,
  timeAgo,
  image,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div className="flex items-center gap-3 ">
          <img
            src={image}
            alt={name}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
          />
          <div className="">
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">
              {name}
            </h3>
            <p className="text-xs md:text-sm text-gray-500">{location}</p>
          </div>
        </div>
        <p className="text-xs md:text-sm text-gray-400 mt-2 ">{timeAgo}</p>
      </div>

      {/* Details */}
      <div className="mt-3 text-xs md:text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-semibold text-gray-800">Contact No.: </span>
          {contact}
        </p>
        <p>
          <span className="font-semibold text-gray-800">Budget: </span>
          {budget}
        </p>
        <p>
          <span className="font-semibold text-gray-800">Requirements: </span>
          {requirements}
        </p>
      </div>

      {/* Contact Button */}
      <button className="w-full mt-4 py-2 bg-gray-200 rounded-sm flex justify-center items-center gap-2 text-gray-700 hover:bg-gray-200 transition">
        <Phone size={16} /> Contact
      </button>
    </div>
  );
};

export default RequirementCard;