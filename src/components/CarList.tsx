import { useSelector } from "react-redux";
import CarCard from "./CarCard";
import CarCardSkeleton from "./CarCardSkeleton";
import CarListHeader from "./CarListHeader";
import type { RootState } from "../store/store";

interface CarListProps {
  loading: boolean;
  error: string | null;
}

export default function CarList({ loading, error }: CarListProps) {
  const { cars } = useSelector((state: RootState) => state.cars);

  return (
    <div className="min-h-screen w-full overflow-hidden lg:pl-1 pb-2">
      <div className="w-full lg:max-w-7xl mx-auto">
        {/* Header */}
        <CarListHeader carCount={cars.length} />

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-8 mx-4 sm:mx-0">
          {loading ? (
            // 💀 Skeletons while loading
            Array(6)
              .fill(0)
              .map((_, i) => <CarCardSkeleton key={i} />)
          ) : error ? (
            // ❌ Error message
            <p className="col-span-full text-center text-red-500 font-medium">
              {error}
            </p>
          ) : cars.length === 0 ? (
            // 🚫 No cars found
            <p className="col-span-full text-center text-gray-500">
              No cars found
            </p>
          ) : (
            // ✅ Render car cards
            cars.map((car) => <CarCard key={car.id} car={car} />)
          )}
        </div>
      </div>
    </div>
  );
}
