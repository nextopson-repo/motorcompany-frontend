import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SellHero from "../components/sellMyCar/sellHero";
import Testimonials from "../components/sellMyCar/Testimonals";
import WhyChooseUs from "../components/sellMyCar/WhyChooseUs";
import HowItWorks from "../components/sellMyCar/HowDhikcarWorks";
import FAQ from "../components/sellMyCar/FAQ";

const SellMyCar: React.FC = () => {
  const location = useLocation();
  const editCar = location.state?.editCar;

  // useEffect(() => {
  //   console.log("📌 Location State:", location.state);
  //   if (editCar) {
  //     console.log("✅ Editing car:", editCar);
  //   } else {
  //     console.log("🆕 Creating new car");
  //   }
  // }, [editCar, location.state]);

  return (
    <>
      {editCar ? (
        <SellHero editCar={editCar} />
      ) : (
        // New listing mode
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

// import React from "react";
// import SellHero from "../components/sellMyCar/sellHero";
// import Testimonials from "../components/sellMyCar/Testimonals";
// import WhyChooseUs from "../components/sellMyCar/WhyChooseUs";
// import HowItWorks from "../components/sellMyCar/HowDhikcarWorks";
// import FAQ from "../components/sellMyCar/FAQ";

// const SellMyCar: React.FC = () => {
//   return (
//     <>
//      <SellHero />
//      <Testimonials />
//      <WhyChooseUs />
//      <HowItWorks />
//      <FAQ />
//     </>
//   );
// };

// export default SellMyCar;
