import { useState, useMemo } from "react";
import { useFilterCars, type Filters } from "../hooks/useFilterCars";
import { carsData, type Car } from "../data/cars";
import  { FilterSidebar }  from "../components/FilterSidebar";
import CarList from "../components/CarList";

const BuyCars = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("yearNewToOld");
  const [selectedLocation, setSelectedLocation] = useState("");
  const minPrice = useMemo(() => Math.min(...carsData.map((c) => c.price)), []);
  const maxPrice = useMemo(() => Math.max(...carsData.map((c) => c.price)), []);
  const minYear = useMemo(() => Math.min(...carsData.map((c) => c.year)), []);
  const maxYear = useMemo(() => Math.max(...carsData.map((c) => c.year)), []);
  const [filters, setFilters] = useState<Filters>({
    brand: [],
    fuel: [],
    transmission: [],
    ownership: [],
    body: [],
    location: [],
    priceRange: [minPrice, maxPrice],
    yearRange: [minYear, maxYear],
  });

  // Generate dynamic filter options from dataset
  const brandOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.brand))),
    []
  );
  const modelOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.model))),
    []
  );
  const stateOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.location.state))),
    []
  );
  const cityOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.location.city))),
    []
  );

  // Update filters for non-location filters
  const onFilterChange = (type: string, value: string) => {
    setFilters((prev) => {
      const prevArr = prev[type as keyof Filters] as string[];

      let newArr;
      if (prevArr.includes(value)) {
        newArr = prevArr.filter((v) => v !== value);
      } else {
        newArr = [...prevArr, value];
      }

      return {
        ...prev,
        [type]: newArr,
      };
    });
  };

  // Update location separately (can be state or city)
  const onLocationChange = (location: string) => {
    setSelectedLocation(location);
    setFilters((prev) => ({
      ...prev,
      location: location ? [location] : [],
    }));
  };

  // Count cars for sidebar filters
  const getCount = (type: string, value: string) =>
    carsData.filter((car: Car) => {
      switch (type) {
        case "brand":
          return car.brand === value;
        case "fuel":
          return car.fuelTypes === value;
        case "transmission":
          return car.transmission === value;
        case "body":
          return car.bodyType === value;
        case "ownership":
          return car.ownership === value;
        case "location":
          return car.location.state === value || car.location.city === value;
        default:
          return false;
      }
    }).length;

  // Apply all filters & sorting
  const filteredCars = useFilterCars(carsData, searchTerm, sortOption, filters);

  return (
    <main className="flex mt-20 min-h-screen relative">
      <div className="sticky top-0">
        <FilterSidebar 
        filters={filters}
        onFilterChange={onFilterChange}
        getCount={getCount}
        selectedLocation={selectedLocation}
        onLocationChange={onLocationChange}
        priceRange={filters.priceRange}
        setPriceRange={(range) =>
          setFilters((prev) => ({ ...prev, priceRange: range }))
        }
        yearRange={filters.yearRange}
        setYearRange={(range) =>
          setFilters((prev) => ({ ...prev, yearRange: range }))
        }
        brandOptions={brandOptions}
        modelOptions={modelOptions}
        stateOptions={stateOptions}
        cityOptions={cityOptions}
      />
      </div>
      <div className="flex-1 p-4">
        <CarList
          cars={filteredCars}
          selectedLocation={selectedLocation}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
          onLocationChange={onLocationChange}
          filters={filters}
          onFilterChange={onFilterChange} 
        />
      </div>
    </main>
  );
};

export default BuyCars;
