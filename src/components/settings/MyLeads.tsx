import React from "react";
import { Download, Calendar } from "lucide-react";
import { useAppSelector } from "../../store/redux/hooks";
import LeadCard from "../LeadCard";

const MyLeads: React.FC = () => {
  const leads = useAppSelector((state) => state.leads.leads);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          My Leads <span className="text-gray-500 text-sm block lg:hidden">({leads.length})</span>
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
      <div className="flex flex-col gap-3">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            name={lead.name}
            city={lead.city}
            timeAgo={lead.timeAgo}
            image={lead.image}
          />
        ))}
      </div>
    </div>
  );
};

export default MyLeads;
