"use client";
import { useState, useEffect, useMemo } from "react";
import { FilterSidebar } from "../components/FilterSidebar";
import CarList from "../components/CarList";

export default function BuyCars() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [carsData, setCarsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    brand: [] as string[],
    fuel: [] as string[],
    transmission: [] as string[],
    body: [] as string[],
    ownership: [] as string[],
    location: [] as string[],
    priceRange: [0, 0] as [number, number],
    yearRange: [2000, new Date().getFullYear()] as [number, number],
  });

  // 🔹 Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/v1/car/getAll`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userType: "Dealer" }), // optional
        });

        const data = await res.json();
        console.log("🚀 Cars fetched:", data.properties);

        if (res.ok) {
          setCarsData(data.properties || []);

          // update filter ranges dynamically
          if (data.properties?.length > 0) {
            const prices = data.properties.map((c: any) => c.carPrice || 0);
            const years = data.properties.map((c: any) => c.manufacturingYear || 0);

            setFilters((prev) => ({
              ...prev,
              priceRange: [Math.min(...prices), Math.max(...prices)],
              yearRange: [Math.min(...years), Math.max(...years)],
            }));
          }
        } else {
          setError(data.message || "Failed to fetch cars");
        }
      } catch (err) {
        setError("Something went wrong");
        console.log("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // 🔹 Unique options
  const brandOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.brand))),
    [carsData]
  );

  const fuelOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.fuelType))),
    [carsData]
  );

  const transmissionOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.transmission))),
    [carsData]
  );

  const bodyOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.bodyType))),
    [carsData]
  );

  const ownershipOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.ownership))),
    [carsData]
  );

  const stateOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.address?.state))),
    [carsData]
  );

  const cityOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.address?.city))),
    [carsData]
  );

  // 🔹 Count helper
  const getCount = (type: string, value: string) =>
    carsData.filter((car: any) => {
      switch (type) {
        case "brand":
          return car.brand === value;
        case "fuel":
          return car.fuelType === value;
        case "transmission":
          return car.transmission === value;
        case "body":
          return car.bodyType === value;
        case "ownership":
          return car.ownership === value;
        case "location":
          return car.address?.state === value || car.address?.city === value;
        default:
          return false;
      }
    }).length;

  return (
    <div className="flex">
      {/* Sidebar */}
      <FilterSidebar
        filters={filters}
        setFilters={setFilters}
        brandOptions={brandOptions}
        fuelOptions={fuelOptions}
        transmissionOptions={transmissionOptions}
        bodyOptions={bodyOptions}
        ownershipOptions={ownershipOptions}
        stateOptions={stateOptions}
        cityOptions={cityOptions}
        getCount={getCount}
      />

      {/* Car List */}
      <div className="flex-1 p-4">
        {loading ? (
          <p>Loading cars...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : carsData.length > 0 ? (
          <CarList cars={carsData} filters={filters} />
        ) : (
          <p>No cars available</p>
        )}
      </div>
    </div>
  );
}



// import { useState, useMemo } from "react";
// import { useFilterCars, type Filters } from "../hooks/useFilterCars";
// import { carsData, type Car } from "../data/cars";
// import { FilterSidebar } from "../components/FilterSidebar";
// import CarList from "../components/CarList";
// import FindDealers from "../components/FindDealers";

// const BuyCars = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOption, setSortOption] = useState("yearNewToOld");
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const minPrice = useMemo(() => Math.min(...carsData.map((c) => c.price)), []);
//   const maxPrice = useMemo(() => Math.max(...carsData.map((c) => c.price)), []);
//   const minYear = useMemo(() => Math.min(...carsData.map((c) => c.year)), []);
//   const maxYear = useMemo(() => Math.max(...carsData.map((c) => c.year)), []);
//   const [filters, setFilters] = useState<Filters>({
//     brand: [],
//     fuel: [],
//     transmission: [],
//     ownership: [],
//     body: [],
//     location: [],
//     priceRange: [minPrice, maxPrice],
//     yearRange: [minYear, maxYear],
//   });

//   // Generate dynamic filter options from dataset
//   const brandOptions = useMemo(
//     () => Array.from(new Set(carsData.map((c) => c.brand))),
//     []
//   );
//   const modelOptions = useMemo(
//     () => Array.from(new Set(carsData.map((c) => c.model))),
//     []
//   );
//   const stateOptions = useMemo(
//     () => Array.from(new Set(carsData.map((c) => c.location.state))),
//     []
//   );
//   const cityOptions = useMemo(
//     () => Array.from(new Set(carsData.map((c) => c.location.city))),
//     []
//   );

//   // Update filters for non-location filters
//   const onFilterChange = (type: string, value: string) => {
//     setFilters((prev) => {
//       const prevArr = prev[type as keyof Filters] as string[];

//       let newArr;
//       if (prevArr.includes(value)) {
//         newArr = prevArr.filter((v) => v !== value);
//       } else {
//         newArr = [...prevArr, value];
//       }

//       return {
//         ...prev,
//         [type]: newArr,
//       };
//     });
//   };

//   // Update location separately (can be state or city)
//   const onLocationChange = (location: string) => {
//     setSelectedLocation(location);
//     setFilters((prev) => ({
//       ...prev,
//       location: location ? [location] : [],
//     }));
//   };

//   // Count cars for sidebar filters
//   const getCount = (type: string, value: string) =>
//     carsData.filter((car: Car) => {
//       switch (type) {
//         case "brand":
//           return car.brand === value;
//         case "fuel":
//           return car.fuelTypes === value;
//         case "transmission":
//           return car.transmission === value;
//         case "body":
//           return car.bodyType === value;
//         case "ownership":
//           return car.ownership === value;
//         case "location":
//           return car.location.state === value || car.location.city === value;
//         default:
//           return false;
//       }
//     }).length;

//   // Apply all filters & sorting
//   const filteredCars = useFilterCars(carsData, searchTerm, sortOption, filters);

//   return (
//     <main className="mt-20 min-h-screen relative">
//       <div className="relative grid grid-cols-12">
//         <div className="col-span-3 ">
//           <div className="sticky top-20">
//             <FilterSidebar
//               filters={filters}
//               onFilterChange={onFilterChange}
//               getCount={getCount}
//               selectedLocation={selectedLocation}
//               onLocationChange={onLocationChange}
//               priceRange={filters.priceRange}
//               setPriceRange={(range) =>
//                 setFilters((prev) => ({ ...prev, priceRange: range }))
//               }
//               yearRange={filters.yearRange}
//               setYearRange={(range) =>
//                 setFilters((prev) => ({ ...prev, yearRange: range }))
//               }
//               brandOptions={brandOptions}
//               modelOptions={modelOptions}
//               stateOptions={stateOptions}
//               cityOptions={cityOptions}
//             />
//           </div>
//         </div>

//         <div className="py-4 col-span-9">
//           <CarList
//             cars={filteredCars}
//             selectedLocation={selectedLocation}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             sortOption={sortOption}
//             setSortOption={setSortOption}
//             onLocationChange={onLocationChange}
//             filters={filters}
//             onFilterChange={onFilterChange}
//           />
//         </div>
//       </div>
//       <div className="my-6">
//         <FindDealers />
//       </div>
//     </main>
//   );
// };

// export default BuyCars;