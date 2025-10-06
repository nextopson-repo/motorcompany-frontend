import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLocations } from "../store/slices/locationSlice";
const AppInitializer = () => {
  const dispatch = useDispatch();

  const cityData = [
  { name: "Chandigarh", cars: 2023, img: "/Cities/Chandigarh.png" },
  { name: "Ahmedabad", cars: 2023, img: "/Cities/Ahemdabad.png" },
  { name: "Pune", cars: 2023, img: "/Cities/pune.png" },
  { name: "Hyderabad", cars: 2023, img: "/Cities/hyderabad.png" },
  { name: "Kanpur", cars: 2023, img: "/Cities/Kanpur.png" },
  { name: "Indore", cars: 2023, img: "/Cities/Indore.png" },
  { name: "Lucknow", cars: 2023, img: "/Cities/Lucknow.png" },
  { name: "Delhi", cars: 2023, img: "/Cities/Delhi.png" },
  { name: "Bhopal", cars: 2023, img: "/Cities/Bhopal.png" },
  { name: "Jaipur", cars: 2023, img: "/Cities/jaipur.png" },
];

  useEffect(() => {
    const cities = Array.from(new Set(cityData.map(car => car.name)));
    dispatch(setLocations(cities));
  }, [dispatch]);

  return null;
};

export default AppInitializer;
