import React from "react";
import { Phone, Trash2 } from "lucide-react";
import type { Requirement } from "../store/slices/requirementsSlice";

interface Props extends Requirement {
  onContact?: (requirement: Requirement) => void;
  onDelete?: (requirementId: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isOwner?: boolean;
}

const RequirementCard: React.FC<Props> = ({
  requirementId,
  id,
  carName,
  brand,
  model,
  variant,
  fuelType,
  transmission,
  bodyType,
  ownership,
  manufacturingYear,
  registrationYear,
  isSale,
  minPrice,
  maxPrice,
  maxKmDriven,
  seats,
  description,
  budget,
  address,
  createdAt,
  enquiryCount,
  user,
  onContact,
  onDelete,
  // isExpanded = false,
  // onToggleExpand,
  isOwner = false,
}) => {
  const location = address
    ? ` ${address.city || ""}`.trim().replace(/^,\s*|,\s*$/g, "")
    : "Location not specified";

  const userName = user?.fullName || "Unknown";
  const contact = user?.mobileNumber || "";
  const userImage = (user as any)?.userProfileUrl || "/default-men-logo.jpg";
  const phoneNumber = contact ? `+91${contact}` : null;

  const handleContactClick = () => {
    if (onContact) {
      onContact({
        requirementId: requirementId || id || "",
        carName,
        brand,
        model,
        variant,
        fuelType,
        transmission,
        bodyType,
        ownership,
        manufacturingYear,
        registrationYear,
        isSale,
        minPrice,
        maxPrice,
        maxKmDriven,
        seats,
        description,
        budget,
        address,
        createdAt,
        enquiryCount,
        user,
      });
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const reqId = requirementId || id;
    if (reqId && onDelete) {
      onDelete(reqId);
    }
  };

  // Determine if there are additional details to show
  // const hasAdditionalDetails = ownership || manufacturingYear || registrationYear || maxKmDriven || seats || description;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors duration-200 flex flex-col self-start w-full">
      {/* Header - Compact */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <img
            src={userImage}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-black text-sm capitalize truncate">
              {userName}
            </h3>
            <p className="text-xs text-gray-500 truncate">{location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isOwner && onDelete && (
            <button
              onClick={handleDeleteClick}
              className="p-1 text-gray-400 hover:text-black transition-colors"
              title="Delete requirement"
            >
              <Trash2 size={14} />
            </button>
          )}
          <p className="text-xs text-gray-400 whitespace-nowrap">{createdAt || "N/A"}</p>
        </div>
      </div>

      {/* Minimal Data - Always Visible */}
      <div className="space-y-2 grow min-h-0">
        {budget && (
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-sm font-semibold text-black">{budget}</p>
          </div>
        )}
        
        {(brand || model) && (
          <div>
            <p className="text-xs text-gray-500">Car</p>
            <p className="text-sm text-black">{[brand, model, variant].filter(Boolean).join(" ")}</p>
          </div>
        )}

        {/* {(fuelType || transmission || bodyType) && (
          <div className="flex gap-3 text-xs text-gray-500">
            {fuelType && <span>{fuelType}</span>}
            {transmission && <span>• {transmission}</span>}
            {bodyType && <span>• {bodyType}</span>}
          </div>
        )} */}

        {/* Additional details - shown only when expanded */}
        {/* {isExpanded && (
          <div className="pt-2 mt-2 border-t border-gray-200 space-y-2">
          

            {ownership && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 min-w-20">Ownership:</span>
                <span className="text-black">{ownership === "1st" ? "1st Owner" : ownership === "2nd" ? "2nd Owner" : ownership === "3rd" ? "3rd Owner" : `${ownership} Owner`}</span>
              </div>
            )}

            {manufacturingYear && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 min-w-20">Manufacturing:</span>
                <span className="text-black">{manufacturingYear}</span>
              </div>
            )}

            {registrationYear && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 min-w-20">Registration:</span>
                <span className="text-black">{registrationYear}</span>
              </div>
            )}

            {maxKmDriven && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 min-w-20">Max KM:</span>
                <span className="text-black">{maxKmDriven.toLocaleString()} km</span>
              </div>
            )}

            {seats && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 min-w-20">Seats:</span>
                <span className="text-black">{seats}</span>
              </div>
            )}

            {description && (
              <div className="pt-2 mt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Description:</p>
                <p className="text-xs text-black leading-relaxed">{description}</p>
              </div>
            )}

            {enquiryCount !== undefined && (
              <div className="pt-2 mt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  {enquiryCount} {enquiryCount === 1 ? "enquiry" : "enquiries"}
                </p>
              </div>
            )}
          </div>
        )} */}
      </div>

      {/* Show More/Less Button */}
      {/* {hasAdditionalDetails && onToggleExpand && (
        <button
          onClick={onToggleExpand}
          className="w-full mt-3 py-1.5 text-xs text-black hover:bg-gray-100 transition-colors flex items-center justify-center gap-1 border-t border-gray-200 pt-2 shrink-0"
        >
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <ChevronUp size={12} />
            </>
          ) : (
            <>
              <span>Show More</span>
              <ChevronDown size={12} />
            </>
          )}
        </button>
      )} */}

      {/* Contact Button */}
      <button
        onClick={handleContactClick}
        disabled={!phoneNumber}
        className="w-full mt-3 py-2 bg-black text-white text-sm font-medium rounded-md flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400 shrink-0"
      >
        <Phone size={14} /> Contact
      </button>
    </div>
  );
};

export default RequirementCard;