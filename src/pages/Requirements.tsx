import React from "react";
import { useSelector } from "react-redux";
import RequirementCard from "../components/RequirementCard";
import type { RootState } from "../store/store";
import { Calendar1, ChevronDown } from "lucide-react";

const Requirements: React.FC = () => {
  const { data } = useSelector((state: RootState) => state.requirements);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto my-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Requirements</h2>
          <p className="text-sm text-gray-500">Total: {data.length}</p>
        </div>
        <button className="text-sm border rounded-md px-4 py-2 hover:bg-gray-100 transition flex items-center justify-between">
          <span className="flex items-center"><Calendar1 className="w-4 h-4" /> Date</span> <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Responsive Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((item) => (
          <RequirementCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Requirements;