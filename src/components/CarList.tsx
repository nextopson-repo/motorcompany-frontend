import CarCard from "./CarCard";

interface CarCardProps{
  
}

export default function CarList({ cars, filters }) {
  // 🔹 Apply filters before rendering
  const filteredCars = cars.filter((car: any) => {
    const {
      brand,
      fuel,
      transmission,
      body,
      ownership,
      location,
      priceRange,
      yearRange,
    } = filters;

    // brand filter
    if (brand.length > 0 && !brand.includes(car.brand)) return false;

    // fuel filter
    if (fuel.length > 0 && !fuel.includes(car.fuelType)) return false;

    // transmission filter
    if (transmission.length > 0 && !transmission.includes(car.transmission))
      return false;

    // body type filter
    if (body.length > 0 && !body.includes(car.bodyType)) return false;

    // ownership filter
    if (ownership.length > 0 && !ownership.includes(car.ownership))
      return false;

    // location filter (state/city)
    if (
      location.length > 0 &&
      !location.includes(car.address?.state) &&
      !location.includes(car.address?.city)
    ) {
      return false;
    }

    // price range filter
    if (
      car.carPrice < priceRange[0] ||
      car.carPrice > priceRange[1]
    ) {
      return false;
    }

    // year range filter
    if (
      car.manufacturingYear < yearRange[0] ||
      car.manufacturingYear > yearRange[1]
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCars.length > 0 ? (
        filteredCars.map((car: any) => (
          <CarCard key={car.id} car={car} />
        ))
      ) : (
        <p className="col-span-full text-center">No cars found</p>
      )}
    </div>
  );
}


// import React, { useState } from "react";
// import CarCard from "./CarCard";
// import CarListHeader from "./CarListHeader";
// import type { Car as DataCar } from "../data/cars";

// // Removed pagination; render all cars and let the page scroll

// interface CarListProps {
//   cars: DataCar[];
//   selectedLocation: string;
//   searchTerm: string;
//   setSearchTerm?: (term: string) => void;
//   sortOption?: string;
//   setSortOption?: (option: string) => void;
//   onLocationChange?: (location: string) => void;
//   filters: Record<string, string[]>; // ✅ add this
//   onFilterChange: (category: string, value: string) => void;
// }

// const CarList: React.FC<CarListProps> = ({
//   cars,
//   selectedLocation,
//   searchTerm,
//   setSearchTerm,
//   sortOption: initialSortOption = "yearNewToOld",
//   setSortOption,
//   onLocationChange,
//   filters,
//   onFilterChange,
// }) => {
//   const [sortOption, setSortOptionLocal] = useState<string>(initialSortOption);

//   const handleSortChange = (option: string) => {
//     setSortOptionLocal(option);
//     if (setSortOption) setSortOption(option);
//   };

//   const visibleCars = cars;

//   return (
//     <div className="min-h-screen w-full">
//       <div className="max-w-6xl mx-auto px-2">
//         {/* Header */}
//         <CarListHeader
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm || (() => {})}
//           sortOption={sortOption}
//           setSortOption={handleSortChange}
//           carCount={cars.length}
//           city={selectedLocation}
//           onLocationChange={onLocationChange}
//           filters={filters}
//           onFilterChange={onFilterChange}
//         />

//         {/* Car Cards Grid */}
//         {visibleCars.length === 0 ? (
//           <div className="text-center text-gray-800 py-20 col-span-full">
//             <p className="text-2xl font-medium">No cars found</p>
//             <p className="text-lg text-gray-500">
//               Try adjusting your search or filter criteria.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//             {visibleCars.map((car, idx) => (
//               <CarCard car={car} key={car.id || idx} />
//             ))}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default CarList;
