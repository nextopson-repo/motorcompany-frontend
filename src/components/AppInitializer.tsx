import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { carsData } from "../data/cars";
import { setLocations } from "../store/slices/locationSlice";
const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const cities = Array.from(new Set(carsData.map(car => car.address.city)));
    dispatch(setLocations(cities));
  }, [dispatch]);

  return null;
};

export default AppInitializer;
