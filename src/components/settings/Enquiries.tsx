import { useEffect } from "react";
import { Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  fetchCarDetailsById,
  // fetchCarDetailsById,
  fetchEnquiries,
} from "../../store/slices/enqueriesSlice";
import EnquiryCard from "../EnquiryCard";
import EnquiriesSkeletonLoader from "../loader/EnquiriesSkeletonLoader";
import toast from "react-hot-toast";

const Enquiries: React.FC = () => {
  const dispatch = useAppDispatch();

  // 🔹 Redux states
  const { enquiries, loading, error } = useAppSelector(
    (state) => state.enquiries
  );
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?._id || user?.id;
  console.log(userId)

  // 🧭 Fetch all enquiries when userId available
  useEffect(() => {
    if (userId) {
      dispatch(fetchEnquiries({ userId }))
        .unwrap()
        .catch((err) => toast.error(err));
    }
  }, [dispatch, userId]);

  // 🚗 Fetch car details for each enquiry
  useEffect(() => {
    if (!loading && enquiries.length > 0) {
      enquiries.forEach((enquiry) => {
        if (!enquiry.carDetails && enquiry.carId) {
          dispatch(fetchCarDetailsById(enquiry.carId));
        }
      });
    }
  }, [dispatch, enquiries, loading]);

  // 💀 Handle errors
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  console.log("enquiry :",enquiries)

  return (
    <div className="mx-auto -m-1 px-4 md:px-0 sm:mb-10 lg:mb-0 min-h-screen bg-gray-50">
      {/* 🔹 Header with search + sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 lg:mb-6 sm:mt-3 lg:mt-0">
        <h1 className="text-md md:text-2xl text-[#24272C] font-bold py-3 md:py-0 md:flex">
          <span className="hidden md:block mr-2">My</span> Enquiries
        </h1>
        <div className="flex items-center gap-2">
          <span className="w-full md:w-68 flex items-center gap-2 bg-[#F2F3F7] text-xs px-2 rounded-xs ">
            <Search className="text-black" size={14} />
            <input
              type="text"
              placeholder="Search for Cars, Brands, Models..."
              className="w-full py-2 placeholder:text-xs placeholder:text-[#24272C] focus:outline-none bg-transparent"
            />
          </span>
          <select className="hidden md:block bg-[#24272C] text-white font-semibold text-xs rounded-xs px-3 py-2">
            <option>Sort By: Price - Low to High</option>
            <option>Sort By: Price - High to Low</option>
          </select>
        </div>
      </div>

      {/* 🌀 Loading skeletons */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <EnquiriesSkeletonLoader key={i} />
          ))}
        </div>
      )}

      {/* 🫥 No enquiries */}
      {!loading && enquiries.length === 0 && (
        <p className="text-gray-500 text-center py-12">No enquiries found 😔</p>
      )}

      {/* 🧾 Enquiry cards */}
      {!loading && enquiries.length > 0 && (
        <div >
          {enquiries.map((enquiry) => (
            <EnquiryCard
              key={enquiry.id}
              enquiry={enquiry}
              car={enquiry.carDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Enquiries;

