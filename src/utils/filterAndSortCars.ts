import type { CarRecord, FiltersState } from "../types/car";

export function filterAndSortCars(
  cars: CarRecord[],
  selectedFilters: Partial<FiltersState>,
  searchTerm: string,
  sortOption: string
): CarRecord[] {
  const filtered = cars.filter((car) => {
    const {
      brand = [],
      fuel = [],
      transmission = [],
      bodyType = [],
      ownership = [],
      location = [],
      priceRange,
      yearRange,
    } = selectedFilters;

    if (brand.length && !brand.includes(car.brand || "")) return false;
    if (fuel.length && !fuel.includes(car.fuelType || "")) return false;
    if (transmission.length && !transmission.includes(car.transmission || "")) return false;
    if (bodyType.length && !bodyType.includes(car.bodyType || "")) return false;
    if (ownership.length && !ownership.includes(car.ownership || "")) return false;
    if (
      location.length &&
      !(location.includes(car.address?.state || "") || location.includes(car.address?.city || ""))
    )
      return false;

    if (priceRange && (car.carPrice! < priceRange[0] || car.carPrice! > priceRange[1])) return false;
    if (yearRange && (car.manufacturingYear! < yearRange[0] || car.manufacturingYear! > yearRange[1])) return false;

    if (searchTerm && !`${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;

    return true;
  });

  return filtered.sort((a, b) => {
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
}
