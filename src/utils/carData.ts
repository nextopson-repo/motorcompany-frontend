import carData from '../../indian-cars.json';

export interface CarDataItem {
  car_brand: string;
  car_model: string;
  car_variants: string[];
}

// Get unique brands
export const getBrands = (): string[] => {
  const brands = new Set<string>();
  carData.forEach((item: CarDataItem) => {
    brands.add(item.car_brand);
  });
  return Array.from(brands).sort();
};

// Get models for a specific brand
export const getModels = (brand: string): string[] => {
  if (!brand) return [];
  const models = new Set<string>();
  carData.forEach((item: CarDataItem) => {
    if (item.car_brand === brand) {
      models.add(item.car_model);
    }
  });
  return Array.from(models).sort();
};

// Get variants for a specific brand and model
export const getVariants = (brand: string, model: string): string[] => {
  if (!brand || !model) return [];
  const variants = new Set<string>();
  carData.forEach((item: CarDataItem) => {
    if (item.car_brand === brand && item.car_model === model) {
      item.car_variants.forEach((variant) => variants.add(variant));
    }
  });
  return Array.from(variants).sort();
};

// Export car data for reference
export { carData };