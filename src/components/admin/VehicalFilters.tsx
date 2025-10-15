import React, { useState } from 'react';

interface VehicleFiltersProps {
  onFilterChange: (filters: {
    brand: string;
    fuel: string;
    transmission: string;
    condition: string;
  }) => void;
}

export default function VehicleFilters({ onFilterChange }: VehicleFiltersProps) {
  const [brand, setBrand] = useState('');
  const [fuel, setFuel] = useState('');
  const [transmission, setTransmission] = useState('');
  const [condition, setCondition] = useState('');

  const handleChange = () => {
    onFilterChange({ brand, fuel, transmission, condition });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
      <h4 className="font-bold text-lg mb-2">Filters</h4>

      <input
        type="text"
        placeholder="Brand"
        value={brand}
        onChange={(e) => { setBrand(e.target.value); handleChange(); }}
        className="w-full px-3 py-2 border rounded"
      />

      <select
        value={fuel}
        onChange={(e) => { setFuel(e.target.value); handleChange(); }}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">Fuel Type</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
        <option value="CNG">CNG</option>
        <option value="Electric">Electric</option>
      </select>

      <select
        value={transmission}
        onChange={(e) => { setTransmission(e.target.value); handleChange(); }}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">Transmission</option>
        <option value="Manual">Manual</option>
        <option value="Automatic">Automatic</option>
      </select>

      <select
        value={condition}
        onChange={(e) => { setCondition(e.target.value); handleChange(); }}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">Condition</option>
        <option value="New">New</option>
        <option value="Used">Used</option>
      </select>
    </div>
  );
}
