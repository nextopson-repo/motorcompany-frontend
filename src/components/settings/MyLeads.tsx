import React, { useEffect } from "react";
import { Download, Calendar } from "lucide-react";
import LeadCard from "../LeadCard";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../store/slices/authSlices/authSlice";
import { fetchCarLeads } from "../../store/slices/leadsSlice";

const LeadCardSkeleton = () => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-md animate-pulse">
      <div className="w-12 h-12 bg-gray-300 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-300 rounded w-1/3" />
        <div className="h-3 bg-gray-300 rounded w-1/4" />
      </div>
    </div>
  );
};

const MyLeads: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);
  const { leads, loading, error } = useSelector((state: any) => state.leads);

  console.error("lead component error:", error);

  useEffect(() => {
    if (user) {
      dispatch(fetchCarLeads() as any);
    }
  }, [dispatch, user]);

  console.log("🎯 Leads in Component:", leads);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          My Leads{" "}
          <span className="text-gray-500 text-sm block lg:hidden">
            ({leads.length})
          </span>
        </h2>

        <button className="mt-3 sm:mt-0 bg-gray-800 text-white text-sm px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-gray-700">
          <Download className="w-4 h-4" />
          Download Leads
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center bg-white rounded-sm shadow-sm border border-gray-200 px-4 py-2 mb-4">
        <p className="text-gray-600 text-sm">
          Total Leads: <span className="font-semibold">{leads.length}</span>
        </p>
        <button className="flex items-center gap-2 text-gray-700 text-sm hover:text-gray-900">
          <Calendar className="w-4 h-4" /> Date
        </button>
      </div>

      {/* Leads List */}
      <div className="flex flex-col gap-3 mt-4">
        {loading ? (
          // Show skeleton while loading
          <>
            <LeadCardSkeleton />
            <LeadCardSkeleton />
            <LeadCardSkeleton />
          </>
        ) : leads.length > 0 ? (
          // Show actual data when loaded
          leads.map((lead: any) => (
            <LeadCard
              key={lead.id}
              name={lead.name}
              city={lead.city}
              timeAgo={lead.timeAgo}
              image={lead.image}
            />
          ))
        ) : (
          // When no data found
          <p className="text-center text-gray-500 py-6">No leads found.</p>
        )}
      </div>
    </div>
  );
};

export default MyLeads;
