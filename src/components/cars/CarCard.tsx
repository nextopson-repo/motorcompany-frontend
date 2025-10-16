import React, { useState, useEffect, useRef } from 'react';
import { Trash2, MapPin, Calendar, Fuel, Gauge, Settings, Car, Edit2, MoreVertical } from 'lucide-react';
import type { Vehicle } from '../../types';

interface CarCardProps {
  vehicle: Vehicle;
  onDelete: (id: string) => void;
  onEdit: (vehicle: Vehicle) => void;
  // onView: (vehicle: Vehicle) => void;
}

const CarCard: React.FC<CarCardProps> = ({ vehicle, onDelete, onEdit }) => {
  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const carPrice = Number(vehicle.carPrice);

  // Close menu on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        {!imageError ? (
          <img
            src={vehicle.image || "/fallback-car-img.png"}
            alt={vehicle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Image not available</p>
            </div>
          </div>
        )}
        
        {/* Condition Badge */}
        {/* <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            vehicle.condition === 'New' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {vehicle.condition}
          </span>
        </div> */}

        {/* Action Menu */}
        <div className="absolute top-3 right-3 transition-opacity duration-300 cursor-pointer">
          <div className="relative cursor-pointer" ref={menuRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(prev => !prev); }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              title="Actions"
            >
              <MoreVertical className="w-4 h-4 text-gray-700" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(vehicle); }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4 text-blue-600" />
                  Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(vehicle.id || ''); }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5">
        {/* Title and Brand */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-sm text-gray-600">
            {vehicle.brand} • {vehicle.model}
          </p>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-blue-600">
            {formatPrice(carPrice)}
          </p>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{vehicle.manufacturingYear}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Gauge className="w-4 h-4 mr-2 text-gray-400" />
            <span>{parseFloat(vehicle.kmDriven || '0').toLocaleString()} km</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Fuel className="w-4 h-4 mr-2 text-gray-400" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Settings className="w-4 h-4 mr-2 text-gray-400" />
            <span>{vehicle.transmission}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{vehicle.address?.city}, {vehicle.address?.state}</span>
        </div>

        {/* Owner Info */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Owner:</span> {vehicle.owner}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
