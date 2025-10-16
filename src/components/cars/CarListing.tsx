import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Vehicle } from "../../types";
import CarCard from "./CarCard";
import CarModal from "./CarModal";
import { useVehicleOperations, useVehiclesInfinite } from "../../hooks/useApi";

const CarListing: React.FC = () => {
  const { vehicles, loading, error, hasMore, fetchMore } =
    useVehiclesInfinite();
  const { uploadCar, deleteVehicle } = useVehicleOperations();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    brand: "",
    fuelType: "",
    transmission: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
  });
  const [sortBy, setSortBy] = useState<"carPrice" | "registrationYear" | "kmDriven" | "title">(
    "carPrice"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [deleteCarId, setDeleteCarId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit" | "view";
    vehicle: Vehicle | null;
  }>({
    isOpen: false,
    mode: "create",
    vehicle: null,
  });

  // Get unique brands for filter
  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(vehicles.map((v) => v.brand)));
    return uniqueBrands.sort();
  }, [vehicles]);

  // Filter and sort vehicles
  const filteredAndSortedVehicles = useMemo(() => {
    const filtered = vehicles.filter((vehicle) => {
      // Search term filter
      const matchesSearch =
        !searchTerm ||
        vehicle.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.address?.city
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        vehicle.bodyType?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter conditions
      const matchesBrand = !filters.brand || vehicle.brand === filters.brand;
      const matchesFuel =
        !filters.fuelType || vehicle.fuelType === filters.fuelType;
      const matchesTransmission =
        !filters.transmission || vehicle.transmission === filters.transmission;
      const matchesMinPrice =
        !filters.minPrice || vehicle.carPrice >= filters.minPrice;
      const matchesMaxPrice =
        !filters.maxPrice || vehicle.carPrice <= filters.maxPrice;
      const matchesMinYear =
        !filters.minYear ||
        vehicle.registrationYear >= parseInt(filters.minYear);
      const matchesMaxYear =
        !filters.maxYear ||
        vehicle.registrationYear <= parseInt(filters.maxYear);

      return (
        matchesSearch &&
        matchesBrand &&
        matchesFuel &&
        matchesTransmission &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinYear &&
        matchesMaxYear
      );
    });

    // Sort vehicles
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy] || '';
      let bValue: string | number = b[sortBy] || '';

      if (sortBy === "title") {
        aValue = (aValue as string).toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [vehicles, searchTerm, filters, sortBy, sortOrder]);

  const handleCreateVehicle = () => {
    setModalState({ isOpen: true, mode: "create", vehicle: null });
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setModalState({ isOpen: true, mode: "edit", vehicle });
  };

  // const handleViewVehicle = (vehicle: Vehicle) => {
  //   setModalState({ isOpen: true, mode: 'view', vehicle });
  // };

    const handleDeleteVehicle = (id: string) => {
    
        deleteVehicle(id);
        toast.success("Vehicle deleted successfully!");
      setDeleteCarId(id);
    };

  const handleSaveVehicle = async (formDataToSend: FormData) => {
    formDataToSend.forEach((value, key) => {
      console.log("in carListing FormData:", key, value, typeof value);
    });

    try {
      const result = await uploadCar(formDataToSend);

      if (result && result.car) {
        toast.success("Vehicle uploaded successfully!");
        console.log("Uploaded vehicle:", result.car);
        // Refresh the vehicle list to show the new car
        fetchMore(); // Use the proper refetch function from the hook
      } else {
        const errorMessage = "Failed to upload vehicle. Please check the console for details.";
        toast.error(errorMessage);
        console.error("Upload failed:", result);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong while uploading. Please try again.");
    } finally {
      setModalState({ isOpen: false, mode: "create", vehicle: null });
    }
  };

  const clearFilters = () => {
    setFilters({
      brand: "",
      fuelType: "",
      transmission: "",
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
    });
    setSearchTerm("");
  };

  const hasActiveFilters =
    Object.values(filters).some((value) => value !== "") || searchTerm !== "";

  return (
    <div className="space-y-6 mt-4 lg:mt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Vehicle Management
          </h1>
          <p className="text-gray-600">
            {filteredAndSortedVehicles.length} of {vehicles.length} vehicles
          </p>
        </div>
        <button
          onClick={handleCreateVehicle}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </button>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-none"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "carPrice" | "registrationYear" | "kmDriven" | "title"
                )
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="carPrice">Price</option>
              <option value="registrationYear">Year</option>
              <option value="kmDriven">Kilometers</option>
              <option value="title">Name</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              {sortOrder === "asc" ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
            </button>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, brand: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      fuelType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Fuel Types</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Transmission Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      transmission: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Transmissions</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="CVT">CVT</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
              </div>

              {/* Condition Filter */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Conditions</option>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </select>
              </div> */}

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: e.target.value,
                    }))
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: e.target.value,
                    }))
                  }
                  placeholder="No limit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Year Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Year
                </label>
                <input
                  type="number"
                  value={filters.minYear}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, minYear: e.target.value }))
                  }
                  placeholder="1900"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Year
                </label>
                <input
                  type="number"
                  value={filters.maxYear}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxYear: e.target.value }))
                  }
                  placeholder={new Date().getFullYear().toString()}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center py-12 text-gray-600">
          Loading vehicles...
        </div>
      )}
      {error && !loading && (
        <div className="text-center py-12 text-red-600">{error}</div>
      )}

      {/* Vehicle Grid/List */}
      {!loading && !error && filteredAndSortedVehicles.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredAndSortedVehicles.filter((vehicle) => vehicle.id !== deleteCarId).map((vehicle) => (
            <CarCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={handleEditVehicle}
              onDelete={handleDeleteVehicle}
              // onView={handleViewVehicle}
            />
          ))}
          {!loading && hasMore && (
            <div className="col-span-full flex justify-center mt-2">
              <button
                onClick={fetchMore}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No vehicles found
          </h3>
          <p className="text-gray-500 mb-4">
            {hasActiveFilters
              ? "Try adjusting your filters or search terms"
              : "Get started by adding your first vehicle"}
          </p>
          {!hasActiveFilters && (
            <button
              onClick={handleCreateVehicle}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Vehicle
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <CarModal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({ isOpen: false, mode: "create", vehicle: null })
        }
        onSave={handleSaveVehicle}
        vehicle={modalState.vehicle}
        mode={modalState.mode}
      />
    </div>
  );
};

export default CarListing;
