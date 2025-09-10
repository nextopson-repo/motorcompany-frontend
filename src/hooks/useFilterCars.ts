import { useMemo } from "react";

import type { Car } from "../data/cars";

export interface Filters {
  brand: string[];
  fuel: string[];
  transmission: string[];
  body: string[];
  ownership: string[];
  location: string[]; // can be state or city
  priceRange: [number, number];
  yearRange: [number, number];
}

export const useFilterCars = (
  cars: Car[],
  searchTerm: string,
  sortOption: string,
  filters: Filters
): Car[] => {
  const filteredCars = useMemo(() => {
    let result = [...cars];

    // 🔍 Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((car) =>
        [
          car.title,
          car.brand,
          car.model || "",
          car.location.city,
          car.location.state,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
    }

    // 🧪 Brand
    if (filters.brand.length > 0) {
      result = result.filter((car) => filters.brand.includes(car.brand));
    }

    // 🔋 Fuel
    if (filters.fuel.length > 0) {
      result = result.filter((car) => filters.fuel.includes(car.fuelTypes));
    }

    // ⚙️ Transmission
    if (filters.transmission.length > 0) {
      result = result.filter((car) =>
        filters.transmission.includes(car.transmission)
      );
    }

    // 🚗 Body Type
    if (filters.body.length > 0) {
      result = result.filter((car) => filters.body.includes(car.bodyType));
    }

    // 👤 Ownership
    if (filters.ownership.length > 0) {
      result = result.filter((car) =>
        filters.ownership.includes(car.ownership || "")
      );
    }

    // 🌍 Location (check state OR city)
    if (filters.location.length > 0) {
      result = result.filter(
        (car) =>
          filters.location.includes(car.location.state) ||
          filters.location.includes(car.location.city)
      );
    }

    // 💰 Price Range
    result = result.filter(
      (car) =>
        car.price >= filters.priceRange[0] &&
        car.price <= filters.priceRange[1]
    );

    // 📅 Year Range
    result = result.filter(
      (car) =>
        car.year >= filters.yearRange[0] && car.year <= filters.yearRange[1]
    );

    // ↕️ Sort
    switch (sortOption) {
      case "priceLowToHigh":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHighToLow":
        result.sort((a, b) => b.price - a.price);
        break;
      case "yearNewToOld":
        result.sort((a, b) => b.year - a.year);
        break;
      case "yearOldToNew":
        result.sort((a, b) => a.year - b.year);
        break;
    }

    return result;
  }, [cars, searchTerm, sortOption, filters]);

  return filteredCars;
};
