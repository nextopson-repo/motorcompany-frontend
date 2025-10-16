// components/CarList.tsx
import { useSelector } from "react-redux";
import CarCard from "./CarCard";
import CarListHeader from "./CarListHeader";
import type { RootState } from "../store/store";

interface CarListProps {
  loading: boolean;
  error: string | null;
}

export default function CarList({ loading, error }: CarListProps) {
  const { cars } = useSelector((state: RootState) => state.cars);

  // 🌀 Loading spinner
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-500 text-sm">Loading cars...</p>
      </div>
    );
  }

  // ❌ Error message
  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-red-500 text-lg font-medium">{error}</p>
      </div>
    );
  }

  // 🚗 Car list
  return (
    <div className="min-h-screen w-full overflow-hidden lg:pl-1 pb-2">
      <div className="w-full lg:max-w-7xl mx-auto">
        {/* Header */}
        <CarListHeader carCount={cars.length} />

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-8 mx-4 sm:mx-0">
          {cars.length ? (
            cars.map((car) => <CarCard key={car.id} car={car} />)
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No cars found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


// // components/CarList.tsx
// import { useSelector } from "react-redux";
// import CarCard from "./CarCard";
// import CarListHeader from "./CarListHeader";
// import type { RootState } from "../store/store";

// export default function CarList() {
//   const { cars } = useSelector((state: RootState) => state.cars);
  
//   return (
//     <div className="min-h-screen w-full overflow-hidden lg:pl-1 pb-2">
//       <div className="w-full lg:max-w-7xl mx-auto">
//         {/* Header */}
//         <CarListHeader carCount={cars.length} />

//         {/* Car Cards Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-8 mx-4 sm:mx-0">
//           {cars.length ? (
//             cars.map((car) => <CarCard key={car.id} car={car} />)
//           ) : (
//             <p className="col-span-full text-center">No cars found</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }