import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { deleteVehicle } from '../../store/slices/appSlice';
import { Filter } from 'lucide-react';

export default function VehiclesTab() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(s => s);

  const handleDeleteVehicle = (id: string) => dispatch(deleteVehicle(id));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Temporary Vehicles</h3>
        <button className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"><Filter size={18}/> Show Filters</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.vehicles.map((vehicle: any) => (
          <div key={vehicle.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
            <div className="relative">
              <img src={vehicle.image} alt={vehicle.title} className="w-full h-48 object-cover" />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${vehicle.isSale === 'Sell' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>{vehicle.isSale}</span>
              </div>
            </div>
            <div className="p-5">
              <h4 className="text-lg font-bold mb-2">{vehicle.title}</h4>
              <div className="text-2xl font-bold text-blue-600 mb-3">₹{parseFloat(vehicle.carPrice || '0').toLocaleString()}</div>

              <div className="flex gap-3 pt-3 border-t">
                <button className="flex-1 text-blue-600 hover:bg-blue-50 py-2 rounded-lg font-medium transition">Edit</button>
                <button onClick={() => handleDeleteVehicle(vehicle.id || '')} className="flex-1 text-red-600 hover:bg-red-50 py-2 rounded-lg font-medium transition">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
