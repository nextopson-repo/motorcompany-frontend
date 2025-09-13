"use client";
import { useState, useEffect, useMemo } from "react";
import { FilterSidebar } from "../components/FilterSidebar";
import CarList from "../components/CarList";
import FindDealers from "../components/FindDealers";

export default function BuyCars() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  type CarRecord = {
    brand?: string;
    fuelType?: string;
    transmission?: string;
    bodyType?: string;
    ownership?: string;
    address?: { state?: string; city?: string };
    carPrice?: number;
    manufacturingYear?: number;
    [key: string]: unknown;
  };
  const [carsData, setCarsData] = useState<CarRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Initialize filters with null for ranges to avoid invalid slider rendering
  const [filters, setFilters] = useState({
    brand: [] as string[],
    fuel: [] as string[],
    transmission: [] as string[],
    bodyType: [] as string[],
    ownership: [] as string[],
    location: [] as string[],
    priceRange: null as [number, number] | null,
    yearRange: null as [number, number] | null,
  });

  // ✅ State to manage what user selects in the sidebar
  const [selectedFilters, setSelectedFilters] = useState({
    brand: [] as string[],
    fuel: [] as string[],
    transmission: [] as string[],
    bodyType: [] as string[],
    ownership: [] as string[],
    location: [] as string[],
    priceRange: [0, 0] as [number, number],
    yearRange: [2000, new Date().getFullYear()] as [number, number],
  });

  console.log("selectedFilters:", selectedFilters);

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/v1/car/getAll`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userType: "Dealer" }),
        });

        const data = await res.json();
        console.log("🚀 Cars fetched:", data.properties);

        if (res.ok) {
          setCarsData(data.properties || []);

          if (data.properties?.length > 0) {
            const prices = data.properties.map((c: CarRecord) => c.carPrice || 0);
            const years = data.properties.map((c: CarRecord) => c.manufacturingYear || 0);

            // ✅ Set the available filter ranges after fetching data
            setFilters((prev) => ({
              ...prev,
              priceRange: [Math.min(...prices), Math.max(...prices)],
              yearRange: [Math.min(...years), Math.max(...years)],
            }));

            // ✅ Initialize selectedFilters with actual range values
            setSelectedFilters((prev) => ({
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
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [BACKEND_URL]);

  // ✅ Unique options derived from carsData
  const brandOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.brand).filter((v): v is string => Boolean(v)))),
    [carsData]
  );
  const fuelOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.fuelType).filter((v): v is string => Boolean(v)))),
    [carsData]
  );
  const transmissionOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.transmission).filter((v): v is string => Boolean(v)))),
    [carsData]
  );
  const bodyOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.bodyType).filter((v): v is string => Boolean(v)))),
    [carsData]
  );
  const ownershipOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.ownership).filter((v): v is string => Boolean(v)))),
    [carsData]
  );
  const stateOptions = useMemo(
    () => Array.from(new Set(carsData.map((c) => c.address?.state).filter((v): v is string => Boolean(v)))),
    [carsData]
  );

  // ✅ Count helper
  const getCount = (type: string, value: string) =>
    carsData.filter((car: CarRecord) => {
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
    <main className="mt-20 min-h-screen relative">
      <div className="relative grid grid-cols-12 gap-4 px-4">
        {/* Sidebar */}
        <div className="col-span-3">
          <div className="sticky top-20">
            <FilterSidebar
              filters={filters}
              selectedFilters={selectedFilters}
              onSelectedFiltersChange={setSelectedFilters}
              getCount={getCount}
              brandOptions={brandOptions}
              fuelOptions={fuelOptions}
              transmissionOptions={transmissionOptions}
              bodyTypeOptions={bodyOptions}
              ownershipOptions={ownershipOptions}
              stateOptions={stateOptions}
            />
          </div>
        </div>

        {/* Car List */}
        <div className="col-span-9 py-4">
          {loading ? (
            <p>Loading cars...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : carsData.length > 0 ? (
            <CarList cars={carsData} filters={selectedFilters} city="" onFilterChange={() => {}} />
          ) : (
            <p>No cars available</p>
          )}
        </div>
      </div>

      {/* Optional Section like FindDealers */}
      <div className="my-6 px-4">
        <FindDealers />
      </div>
    </main>
  );
}