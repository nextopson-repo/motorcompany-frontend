import React from "react";
import { useLocation } from "react-router-dom";
import SellHero from "../components/sellMyCar/sellHero";
import Testimonials from "../components/sellMyCar/Testimonals";
import WhyChooseUs from "../components/sellMyCar/WhyChooseUs";
import HowItWorks from "../components/sellMyCar/HowDhikcarWorks";
import FAQ from "../components/sellMyCar/FAQ";

const SellMyCar: React.FC = () => {
  const location = useLocation();
  const editCar = location.state?.editCar;

  return (
    <>
      {editCar ? (
        <SellHero/>
      ) : (
        <>
          <SellHero />
          <Testimonials />
          <WhyChooseUs />
          <HowItWorks />
          <FAQ />
        </>
      )}
    </>
  );
};

export default SellMyCar;