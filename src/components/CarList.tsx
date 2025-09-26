import { useSelector } from "react-redux";
import CarCard from "./CarCard";
import CarListHeader from "./CarListHeader";
import type { RootState } from "../store/store";
import { useMemo } from "react";
// import { setSearchTerm } from "../store/slices/carSlice";


export default function CarList() {
  // const dispatch = useDispatch<AppDispatch>();

  const { cars, filters, selectedFilters, searchTerm, sortOption } = useSelector(
    (state: RootState) => state.cars
  );

  // Handler for search term change
  // const handleSearchTermChange = (term: string) => {
  //   dispatch(setSearchTerm(term));
  // };


  // Handler for location/city change
  const handleLocationChange = (newCity: string) => {
    // Update selectedFilters.location
    // You can dispatch a setSelectedFilters action if needed
    // Example: dispatch(setSelectedFilters({ location: [newCity] }))
    console.log("newCity", newCity)
  };

  const filteredAndSortedCars = useMemo(() => {
    const filtered = cars.filter((car) => {
      const { brand, fuel, transmission, bodyType, ownership, location, priceRange, yearRange } =
        selectedFilters;

      if (brand.length && !brand.includes(car.brand || "")) return false;
      if (fuel.length && !fuel.includes(car.fuelType || "")) return false;
      if (transmission.length && !transmission.includes(car.transmission || "")) return false;
      if (bodyType.length && !bodyType.includes(car.bodyType || "")) return false;
      if (ownership.length && !ownership.includes(car.ownership || "")) return false;
      if (location.length && !(location.includes(car.address?.state || "") || location.includes(car.address?.city || "")))
        return false;

      if (priceRange && (car.carPrice! < priceRange[0] || car.carPrice! > priceRange[1])) return false;
      if (yearRange && (car.manufacturingYear! < yearRange[0] || car.manufacturingYear! > yearRange[1]))
        return false;

      if (searchTerm && !`${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase()))
        return false;

      return true;
    });

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "yearNewToOld":
          return (b.manufacturingYear || 0) - (a.manufacturingYear || 0);
        case "yearOldToNew":
          return (a.manufacturingYear || 0) - (b.manufacturingYear || 0);
        case "priceLowToHigh":
          return (a.carPrice || 0) - (b.carPrice || 0);
        case "priceHighToLow":
          return (b.carPrice || 0) - (a.carPrice || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [cars, selectedFilters, searchTerm, sortOption]);

  return (
    <div className="min-h-screen w-full overflow-hidden pl-1 pb-2">
      <div className="w-full lg:max-w-7xl mx-auto">
        {/* Header */}
        <CarListHeader
          carCount={filteredAndSortedCars.length}
          filters={{
            ...filters,
            priceRange: filters.priceRange ?? [0, 10000000],
            yearRange: filters.yearRange ?? [2000, 2025],
          }}
          onFilterChange={handleLocationChange}
        />

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedCars.length ? (
            filteredAndSortedCars.map((car) => <CarCard key={car.id} car={car} />)
          ) : (
            <p className="col-span-full text-center">No cars found</p>
          )}
        </div>
      </div>
    </div>
  );
}