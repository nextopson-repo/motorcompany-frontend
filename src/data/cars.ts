export interface Car {
  id: number;
  brand: string;
  model: string;
  title: string;
  carPrice: number;
  address: { state: string; city: string };
  manufacturingYear: number;
  fuelType: string;
  bodyType: string;
  transmission: string;
  ownership: string;
  image: string;
  images: string[];
  discount: number;
  seats: number;
  mileage: number;
  gear: string;
  kms: number;
  views: number;
  specs: Record<string, string>;
  user: { fullName: string; userType: string };
}

const seedCarsData: Car[] = [
  {
    id: 1,
    brand: "Kia",
    model: "Seltos",
    title: "Kia Seltos",
    carPrice: 1695000,
    address: { state: "Madhya Pradesh", city: "Indore" },
    manufacturingYear: 2022,
    fuelType: "Petrol",
    bodyType: "SUV",
    transmission: "Manual",
    ownership: "First Owner",
    image: "/car-1.jpg",
    discount: 6,
    seats: 5,
    mileage: 16.8,
    kms: 500,
    images: ["/car-1.jpg", "/car-2.jpg", "/car-3.jpg", "/car-4.jpg"],
    views: 100,
    specs: {
      "Engine": "1497 cc",
      "Power": "115 bhp",
      "Transmission": "6-Speed Manual",
      "Fuel Type": "Petrol",
      "Mileage": "16.8 kmpl",
      "Seating Capacity": "5"
    },

    gear: "6-Speed Manual",
    user: { fullName: "Sana Roy", userType: "Dealer" },
  },
  {
    id: 2,
    brand: "Kia",
    model: "Carens",
    title: "Kia Carens",
    carPrice: 1590000,
    address: { state: "Madhya Pradesh", city: "Bhopal" },
    manufacturingYear: 2023,
    fuelType: "Diesel",
    bodyType: "MUV",
    transmission: "Automatic",
    ownership: "First Owner",
    image: "/car-2.jpg",
    discount: 5,
    seats: 7,
    mileage: 15.4,
    kms: 500,
    images: ["/car-2.jpg", "/car-3.jpg", "/car-4.jpg", "/car-5.jpg", "/car-3.jpg", "/car-4.jpg"],
    views: 100,
    specs: {
      "Engine": "1493 cc",
      "Power": "115 bhp",
      "Transmission": "7-Speed DCT",
      "Fuel Type": "Diesel",
      "Mileage": "15.4 kmpl",
      "Seating Capacity": "7"
    },

    gear: "7-Speed DCT",
    user: { fullName: "Hemant Roy", userType: "Owner" },
  },
  {
    id: 3,
    brand: "Kia",
    model: "Sonet",
    title: "Kia Sonet",
    carPrice: 1190000,
    address: { state: "Utter Pradesh", city: "kanpur" },
    manufacturingYear: 2021,
    fuelType: "Petrol",
    bodyType: "SUV",
    transmission: "Manual",
    ownership: "Second Owner",
    image: "/car-3.jpg",
    discount: 8,
    seats: 5,
    mileage: 18.4,
    kms: 500,
    images: ["/car-3.jpg", "/car-4.jpg", "/car-5.jpg", "/car-6.jpg"],
    views: 100,
    specs: {
      "Engine": "1197 cc",
      "Power": "83 bhp",
      "Transmission": "5-Speed Manual",
      "Fuel Type": "Petrol",
      "Mileage": "18.4 kmpl",
      "Seating Capacity": "5"
    },

    gear: "5-Speed Manual",
    user: { fullName: "Raj kumar Dangi", userType: "Owner" },
  },
  {
    id: 4,
    brand: "Hyundai",
    model: "Creta",
    title: "Hyundai Creta",
    carPrice: 1650000,
    address: { state: "Maharashtra", city: "Pune" },
    manufacturingYear: 2022,
    fuelType: "Diesel",
    bodyType: "SUV",
    transmission: "Automatic",
    ownership: "First Owner",
    image: "/car-4.jpg",
    discount: 6,
    seats: 5,
    mileage: 17.1,
    kms: 500,
    images: ["/car-4.jpg", "/car-5.jpg", "/car-6.jpg", "/car-7.jpg"],
    views: 100,
    specs: {
      "Engine": "1493 cc",
      "Power": "115 bhp",
      "Transmission": "6-Speed AT",
      "Fuel Type": "Diesel",
      "Mileage": "17.1 kmpl",
      "Seating Capacity": "5"
    },

    gear: "6-Speed AT",
    user: { fullName: "Sana Roy", userType: "Dealer" },
  },
  {
    id: 5,
    brand: "Hyundai",
    model: "i20",
    title: "Hyundai i20",
    carPrice: 950000,
    address: { state: "Maharashtra", city: "Pune" },
    manufacturingYear: 2021,
    fuelType: "Petrol",
    bodyType: "Hatchback",
    transmission: "Manual",
    ownership: "Second Owner",
    image: "/car-5.jpg",
    discount: 9,
    seats: 5,
    mileage: 20.1,
    kms: 500,
    images: ["/car-5.jpg", "/car-6.jpg", "/car-7.jpg", "/car-8.jpg"],
    views: 100,
    specs: {
      "Engine": "1197 cc",
      "Power": "83 bhp",
      "Transmission": "5-Speed Manual",
      "Fuel Type": "Petrol",
      "Mileage": "20.1 kmpl",
      "Seating Capacity": "5"
    },

    gear: "5-Speed Manual",
    user: { fullName: "Sana Roy", userType: "Dealer" },
  },
];

// Prefer brand logos when available; otherwise cycle local car photos (1-12)
const brandLogoByName: Record<string, string> = {
  Audi: "/CarsLogo/Audi.png",
  BMW: "/CarsLogo/BMW.png",
  Ferrari: "/CarsLogo/Ferrari.png",
  Lamborghini: "/CarsLogo/Lamborghini.png",
  Mercedes: "/CarsLogo/Mercedes.png",
  "Range Rover": "/CarsLogo/RangeRover.png",
};

const availableCarImages: string[] = [
  "/car-1.jpg",
  "/car-2.jpg",
  "/car-3.jpg",
  "/car-4.jpg",
  "/car-5.jpg",
  "/car-6.jpg",
  "/car-7.jpg",
  "/car-8.jpg",
  "/car-9.jpg",
  "/car-10.jpg",
  "/car-11.jpg",
  "/car-12.jpg",
];

export const carsData: Car[] = seedCarsData.map((car, index) => ({
  ...car,
  image: brandLogoByName[car.brand] ?? availableCarImages[index % availableCarImages.length],
}));
