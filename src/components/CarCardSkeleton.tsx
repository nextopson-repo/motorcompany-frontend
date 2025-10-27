// src/components/CarCardSkeleton.tsx
import React from "react";

const CarCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-md overflow-hidden flex flex-col animate-pulse shadow-md mb-3">
      <div className="relative">
        <div className="w-full h-40 lg:h-48 bg-gray-200"></div>
        <div className="absolute top-2 right-2 w-5 h-5 bg-gray-300 rounded-full"></div>
      </div>

      <div className="py-4 px-2 flex-1 flex flex-col">
        <div className="flex justify-between items-end mb-2">
          <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-2 w-10 bg-gray-200 rounded"></div>
        </div>

        <div className="h-2 w-3/4 bg-gray-200 rounded mb-2"></div>

        <div className="flex justify-between items-end mb-4">
          <div className="space-y-2">
            <div className="h-2 w-20 bg-gray-200 rounded"></div>
            <div className="h-2 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="h-4 w-14 bg-gray-200 rounded"></div>
        </div>

        <div className="h-6 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default CarCardSkeleton;
