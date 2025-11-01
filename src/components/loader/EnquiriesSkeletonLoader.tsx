import React from "react";

const EnquiriesSkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse bg-white shadow rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-3">
        <div className="rounded-full bg-gray-300 h-10 w-10"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-16 bg-gray-200 rounded"></div>
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
    </div>
  );
};

export default EnquiriesSkeletonLoader;
