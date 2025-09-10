import React, { useState } from "react";
import CarCard from "./CarCard";
import CarListHeader from "./CarListHeader";
import type { Car as DataCar } from "../data/cars";

// Removed pagination; render all cars and let the page scroll

interface CarListProps {
  cars: DataCar[];
  selectedLocation: string;
  searchTerm: string;
  setSearchTerm?: (term: string) => void;
  sortOption?: string;
  setSortOption?: (option: string) => void;
  onLocationChange?: (location: string) => void;
  filters: Record<string, string[]>; // ✅ add this
  onFilterChange: (category: string, value: string) => void;
}

const CarList: React.FC<CarListProps> = ({
  cars,
  selectedLocation,
  searchTerm,
  setSearchTerm,
  sortOption: initialSortOption = "yearNewToOld",
  setSortOption,
  onLocationChange,
  filters,
  onFilterChange,
}) => {
  const [sortOption, setSortOptionLocal] = useState<string>(initialSortOption);

  const handleSortChange = (option: string) => {
    setSortOptionLocal(option);
    if (setSortOption) setSortOption(option);
  };

  const visibleCars = cars;

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <CarListHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm || (() => {})}
          sortOption={sortOption}
          setSortOption={handleSortChange}
          carCount={cars.length}
          city={selectedLocation}
          onLocationChange={onLocationChange}
          filters={filters}
          onFilterChange={onFilterChange}
        />

        {/* Car Cards Grid */}
        {visibleCars.length === 0 ? (
          <div className="text-center text-gray-800 py-20 col-span-full">
            <p className="text-2xl font-medium">No cars found</p>
            <p className="text-lg text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visibleCars.map((car, idx) => (
              <CarCard car={car} key={car.id || idx} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CarList;
