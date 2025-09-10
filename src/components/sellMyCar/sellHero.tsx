import { useEffect, useState } from "react";
import SellHeroForm from "./SellHeroForm";
import { useNavigate, useLocation } from "react-router-dom";

export default function SellHero() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const location = useLocation();

  const [showForm, setShowForm] = useState(false);
  const [userType, setUserType] = useState<"owner" | "dealer">("owner");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [user, setUser] = useState<any>();
  const [editCar, setEditCar] = useState<any>(null);

  useEffect(() => {
    // ✅ load logged-in user from localStorage
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // ✅ if navigated with editCar data
    if (location.state?.editCar) {
      const car = location.state.editCar;
      setEditCar(car);
      setState(car?.address?.state || "");
      setCity(car?.address?.city || "");
      setLocality(car?.address?.locality || "");
      setShowForm(true); // directly open form
    }
  }, [location]);

  // const handleFinalSubmit = async (carData: any) => {
  //   const payload = {
  //     carId: editCar?.id || null, // ✅ pass carId only in edit mode
  //     userId: user?.id,
  //     carName: `${carData.brand} ${carData.model} ${carData.variant}`,
  //     brand: carData.brand,
  //     model: carData.model,
  //     variant: carData.variant,
  //     fuelType: carData.fuelType,
  //     transmission: carData.transmission,
  //     bodyType: carData.bodyType,
  //     ownership: carData.ownership,
  //     manufacturingYear: carData.manufactureYear,
  //     registrationYear: carData.registrationYear,
  //     isSale: "Sell",
  //     carPrice: Number(String(carData.price).replace(/,/g, "")),
  //     kmDriven: Number(carData.kmDriven),
  //     seats: Number(carData.seats),
  //     isSold: false,
  //     addressCity: city,
  //     addressState: state,
  //     addressLocality: locality,
  //     carImages: carData.images || [], // ✅ images from form
  //   };

  //   console.log("🚀 Final Payload:", payload);

  //   try {
  //     await fetch(`${BACKEND_URL}/api/v1/car/create-update`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     navigate("/"); // ✅ redirect after save
  //   } catch (err) {
  //     console.error("❌ Error:", err);
  //     alert("Something went wrong!");
  //   }
  // };

  const handleFinalSubmit = async (carData: any) => {
  const payload = {
    carId: editCar?.id || null, // ✅ Pass carId if editing
    userId: user?.id,
    carName: `${carData.brand || editCar?.brand} ${carData.model || editCar?.model} ${carData.variant || editCar?.variant}`,
    brand: carData.brand || editCar?.brand,
    model: carData.model || editCar?.model,
    variant: carData.variant || editCar?.variant,
    fuelType: carData.fuelType || editCar?.fuelType,
    transmission: carData.transmission || editCar?.transmission,
    bodyType: carData.bodyType || editCar?.bodyType,
    ownership: carData.ownership || editCar?.ownership,
    manufacturingYear: carData.manufactureYear || editCar?.manufacturingYear,
    registrationYear: carData.registrationYear || editCar?.registrationYear,
    isSale: "Sell",
    carPrice: Number(String(carData.price || editCar?.price).replace(/,/g, "")),
    kmDriven: Number(carData.kmDriven || editCar?.kmDriven),
    seats: Number(carData.seats || editCar?.seats),
    isSold: false,
    addressCity: city || editCar?.address?.city || "",
    addressState: state || editCar?.address?.state || "",
    addressLocality: locality || editCar?.address?.locality || "",
    carImages: carData.images?.length ? carData.images : editCar?.carImages || [], // ✅ use new images if uploaded
  };

  console.log("🚀 Final Payload:", payload);

  try {
    await fetch(`${BACKEND_URL}/api/v1/car/create-update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    navigate("/"); // ✅ redirect after save
  } catch (err) {
    console.error("❌ Error:", err);
    alert("Something went wrong!");
  }
};


  return (
    <section className="relative w-full h-[90vh] bg-black mt-10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat opacity-60 mb-1"
        style={{
          backgroundImage: "url('/sell-my-car-hero-bg.jpg')",
          backgroundPosition: "center calc(100% - 75%)",
        }}
      />

      {/* Overlay Content */}
      <div className="relative max-w-7xl h-[91vh] mx-auto px-6 grid grid-cols-9 items-center gap-10 backdrop-blur-[3px]">
        {/* Left Content */}
        <div className="text-white col-span-6 px-2 mb-10">
          <p className="text-sm mb-18">
            Home <span className="text-gray-300"> &gt; </span>{" "}
            <span className="font-medium">Sell my Car</span>
          </p>
          <h1 className="max-w-[80%] text-2xl md:text-3xl font-bold mb-5 leading-tight">
            Sell your car faster, easier and hassle-free with DhikCar.com
          </h1>
          <p className="text-gray-200 mb-7">
            India’s trusted platform for quick and profitable car sales. List
            today and watch buyers come to you!
          </p>

          <ul className="space-y-6 text-xl">
            <li className="flex items-center gap-4">
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#EE1422]">
                ✓
              </span>
              <span>Post car for Free</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#EE1422]">
                ✓
              </span>
              <span>Get Verified Buyers</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#EE1422]">
                ✓
              </span>
              <span>Get personalised assistance on selling faster</span>
            </li>
          </ul>
        </div>

        {/* Right Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 m-6 col-span-3 mt-14">
          <div className="px-2 mb-2">
            <h1 className="text-sm font-bold mb-5">
              {editCar ? "Edit Your Car" : ""}
            </h1>
          </div>

          {showForm && (
            <SellHeroForm
              onBack={() => setShowForm(false)}
              onSubmit={handleFinalSubmit}
              defaultValues={editCar} // ✅ prefill form if editing
            />
          )}

          {!showForm && !editCar && (
            <div>
              <h2 className="text-sm mb-4">
                New to <span className="font-semibold">Dhikcar</span>? Let's get
                you started
              </h2>

              {/* User Type */}
              <label htmlFor="userType" className="text-sm">
                User Type
              </label>
              <div className="grid grid-cols-3 gap-5 mb-4 text-xs mt-1">
                <button
                  onClick={() => setUserType("owner")}
                  className={`flex-1 py-[6px] rounded ${
                    userType === "owner"
                      ? "bg-green-50 text-green-700 font-medium"
                      : "bg-white border border-gray-300 text-gray-600"
                  }`}
                >
                  Owner
                </button>
                <button
                  onClick={() => setUserType("dealer")}
                  className={`flex-1 py-[6px] rounded ${
                    userType === "dealer"
                      ? "bg-green-50 text-green-700 font-medium"
                      : "bg-white border border-gray-300 text-gray-600"
                  }`}
                >
                  Dealer
                </button>
              </div>

              {/* Location Fields */}
              <div className="space-y-3">
                <label htmlFor="state" className="text-sm">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Enter your State"
                  className="w-full rounded mt-1 px-3 py-2 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-800/50 outline-none"
                />
                <label htmlFor="city" className="text-sm">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your City"
                  className="w-full rounded mt-1 px-3 py-2 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-800/50 outline-none"
                />
                <label htmlFor="locality" className="text-sm">
                  Locality
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="Select your neighbourhood"
                  className="w-full rounded mt-1 px-3 py-2 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-800/50 outline-none"
                />
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="w-full mt-6 bg-black/90 text-white py-2 rounded-sm hover:bg-black transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}



// import { useEffect, useState } from "react";
// import SellHeroForm from "./SellHeroForm";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function SellHero() {
//   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [showForm, setShowForm] = useState(false);
//   const [userType, setUserType] = useState<"owner" | "dealer">("owner");
//   const [state, setState] = useState("");
//   const [city, setCity] = useState("");
//   const [locality, setLocality] = useState("");
//   const [user, setUser] = useState();
//   const [editCar, setEditCar] = useState(null); // edit data state

//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     const savedUser = localStorage.getItem("user");
//     if (savedToken && savedUser) {
//       setUser(JSON.parse(savedUser));
//     }

//     // agar edit ke liye data aaya hai
//     if (location.state?.editCar) {
//       setEditCar(location.state.editCar);
//       setState(location.state.editCar?.address?.state || "");
//       setCity(location.state.editCar?.address?.city || "");
//       setLocality(location.state.editCar?.address?.locality || "");
//       setShowForm(true); // directly form open ho
//     }
//   }, [location]);

//   const handleFinalSubmit = async (carData: any) => {
//     const payload = {
//       carId: editCar?.id, // agar edit mode hai to carId bhejna
//       userId: user?.id,
//       carName: `${carData.brand} ${carData.model} ${carData.variant}`,
//       brand: carData.brand,
//       model: carData.model,
//       variant: carData.variant,
//       fuelType: carData.fuelType,
//       transmission: carData.transmission,
//       bodyType: carData.bodyType,
//       ownership: carData.ownership,
//       manufacturingYear: carData.manufactureYear,
//       registrationYear: carData.registrationYear,
//       isSale: "Sell",
//       carPrice: Number(carData.price.replace(/,/g, "")),
//       kmDriven: Number(carData.kmDriven),
//       seats: Number(carData.seats),
//       isSold: false,
//       addressCity: city,
//       addressState: state,
//       addressLocality: locality,
//       carImages: [],
//     };

//     console.log("🚀 Final Payload:", payload);

//     try {
//       await fetch(`${BACKEND_URL}/api/v1/car/create-update`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       navigate("/"); // save hone ke baad redirect
//     } catch (err) {
//       console.error("❌ Error:", err);
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <section className="relative w-full h-[90vh] bg-black mt-10">
//       {/* Background Image */}
//       <div
//         className=" absolute inset-0 bg-cover bg-no-repeat opacity-60 mb-1"
//         style={{
//           backgroundImage: "url('/sell-my-car-hero-bg.jpg')",
//           backgroundPosition: "center calc(100% - 75%)",
//         }}
//       />

//       {/* Overlay Content */}
//       <div className="relative max-w-7xl h-[91vh] mx-auto px-6 grid grid-cols-9 items-center gap-10 backdrop-blur-[3px]">
//         {/* Left Content */}
//         <div className="text-white col-span-6 px-2 mb-10">
//           <p className="text-sm mb-18">
//             Home <span className="text-gray-300"> &gt; </span>{" "}
//             <span className="font-medium">Sell my Car</span>
//           </p>
//           <h1 className="max-w-[80%] text-2xl md:text-3xl font-bold mb-5 leading-tight">
//             Sell your car faster, easier and hassle-free with DhikCar.com
//           </h1>
//           <p className="text-gray-200 mb-7">
//             India’s trusted platform for quick and profitable car sales. List
//             today and watch buyers come to you!
//           </p>

//           <ul className="space-y-6 text-xl">
//             <li className="flex items-center gap-4">
//               <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#EE1422]">
//                 ✓
//               </span>
//               <span>Post car for Free</span>
//             </li>
//             <li className="flex items-center gap-4">
//               <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#EE1422]">
//                 ✓
//               </span>
//               <span>Get Verified Buyers</span>
//             </li>
//             <li className="flex items-center gap-4">
//               <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#EE1422]">
//                 ✓
//               </span>
//               <span>Get personalised assistance on selling faster</span>
//             </li>
//           </ul>
//         </div>

//         {/* Right Form Card with toggle to multi steps form */}
//         <div className="bg-white rounded-lg shadow-lg p-6 m-6 col-span-3 mt-14">
//           <div className="px-2 mb-10">
//             <h1 className="text-xl font-bold mb-5">
//               {editCar ? "Edit Your Car" : ""}
//             </h1>
//           </div>
//           {showForm && (
//             <SellHeroForm
//               onBack={() => setShowForm(false)}
//               onSubmit={handleFinalSubmit}
//               defaultValues={editCar} 
//             />
//           )}
//           { !showForm && !editCar && (
//             <div>
//               <h2 className="text-sm mb-4">
//                 New to <span className="font-semibold">Dhikcar</span>? Let's get
//                 you started
//               </h2>

//               {/* User Type */}
//               <label htmlFor="userType" className="text-sm">
//                 User Type
//               </label>
//               <div className="grid grid-cols-3 gap-5 mb-4 text-xs mt-1">
//                 <button
//                   onClick={() => setUserType("owner")}
//                   className={`flex-1 py-[6px] rounded ${
//                     userType === "owner"
//                       ? "bg-green-50 text-green-700 font-medium"
//                       : "bg-white border border-gray-300 text-gray-600"
//                   }`}
//                 >
//                   Owner
//                 </button>
//                 <button
//                   onClick={() => setUserType("dealer")}
//                   className={`flex-1 py-[6px] rounded ${
//                     userType === "dealer"
//                       ? "bg-green-50 text-green-700 font-medium"
//                       : "bg-white border border-gray-300 text-gray-600"
//                   }`}
//                 >
//                   Dealer
//                 </button>
//               </div>

//               {/* Form Fields */}
//               <div className="space-y-3">
//                 <label htmlFor="state" className="text-sm">
//                   State
//                 </label>
//                 <input
//                   type="text"
//                   value={state}
//                   onChange={(e) => setState(e.target.value)}
//                   placeholder="Enter your State"
//                   className="w-full rounded mt-1 px-3 py-2 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-800/50 outline-none"
//                 />
//                 <label htmlFor="city" className="text-sm">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                   placeholder="Enter your City"
//                   className="w-full rounded mt-1 px-3 py-2 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-800/50 outline-none"
//                 />
//                 <label htmlFor="locality" className="text-sm">
//                   Locality
//                 </label>
//                 <input
//                   type="text"
//                   value={locality}
//                   onChange={(e) => setLocality(e.target.value)}
//                   placeholder="Select your neighbourhood"
//                   className="w-full rounded mt-1 px-3 py-2 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-800/50 outline-none"
//                 />
//               </div>

//               <button
//                 onClick={() => setShowForm(true)}
//                 className="w-full mt-6 bg-black/90 text-white py-2 rounded-sm hover:bg-black transition"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

// import { useEffect, useState } from "react";
// import SellHeroForm from "./SellHeroForm";
// import { useNavigate } from "react-router-dom";

// export default function SellHero() {
//   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
//   const navigate = useNavigate();
//   const [showForm, setShowForm] = useState(false);
//   const [userType, setUserType] = useState<"owner" | "dealer">("owner");

//   // location form states
//   const [state, setState] = useState("");
//   const [city, setCity] = useState("");
//   const [locality, setLocality] = useState("");
//   const [user, setUser] = useState();

//       useEffect(() => {
//         const savedToken = localStorage.getItem("token");
//         const savedUser = localStorage.getItem("user");
//         if (savedToken && savedUser) {
//           setUser(JSON.parse(savedUser));
//         }
//       }, []);

//   const handleFinalSubmit = async (carData: any) => {
//     const payload = {
//       userId: user?.id,
//       carName: `${carData.brand} ${carData.model} ${carData.variant}`,
//       brand: carData.brand,
//       model: carData.model,
//       variant: carData.variant,
//       fuelType: carData.fuelType,
//       transmission: carData.transmission,
//       bodyType: carData.bodyType,
//       ownership: carData.ownership,
//       manufacturingYear: carData.manufactureYear,
//       registrationYear: carData.registrationYear,
//       isSale: "Sell", //manualy send
//       carPrice: Number(carData.price.replace(/,/g, "")), // remove commas
//       kmDriven: Number(carData.kmDriven),
//       seats: Number(carData.seats),
//       isSold: false,
//       addressCity: city,
//       addressState: state,
//       addressLocality: locality,
//       carImages: [], // abhi upload se empty bhejna
//     };

//     console.log("🚀 Final Payload:", payload);

//     try {
//       await fetch(`${BACKEND_URL}/api/v1/car/create-update`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       setTimeout(() => {
//         navigate("/");
//       }, 3000);

//     } catch (err) {
//       console.error("❌ Error:", err);
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <section className="relative w-full h-[90vh] bg-black mt-10">
//       {/* Background Image */}
//       <div
//         className=" absolute inset-0 bg-cover bg-no-repeat opacity-60 mb-1"
//         style={{
//           backgroundImage: "url('/sell-my-car-hero-bg.jpg')",
//           backgroundPosition: "center calc(100% - 75%)",
//         }}
//       />

//       {/* Overlay Content */}
//       <div className="relative max-w-7xl h-[91vh] mx-auto px-6 grid grid-cols-9 items-center gap-10 backdrop-blur-[3px]">
//         {/* Left Content */}
//         <div className="text-white col-span-6 px-2 mb-10">
//           <p className="text-sm mb-18">
//             Home <span className="text-gray-300"> &gt; </span>{" "}
//             <span className="font-medium">Sell my Car</span>
//           </p>
//           <h1 className="max-w-[80%] text-2xl md:text-3xl font-bold mb-5 leading-tight">
//             Sell your car faster, easier and hassle-free with DhikCar.com
//           </h1>
//           <p className="text-gray-200 mb-7">
//             India’s trusted platform for quick and profitable car sales. List
//             today and watch buyers come to you!
//           </p>

//           <ul className="space-y-6 text-xl">
//             <li className="flex items-center gap-4">
//               <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#EE1422]">
//                 ✓
//               </span>
//               <span>Post car for Free</span>
//             </li>
//             <li className="flex items-center gap-4">
//               <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#EE1422]">
//                 ✓
//               </span>
//               <span>Get Verified Buyers</span>
//             </li>
//             <li className="flex items-center gap-4">
//               <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#EE1422]">
//                 ✓
//               </span>
//               <span>Get personalised assistance on selling faster</span>
//             </li>
//           </ul>
//         </div>

//         {/* Right Form Card with toggle to multi steps form */}
//         <div className="bg-white rounded-lg shadow-lg p-6 m-6 col-span-3 mt-14">
//           {showForm ? (
//             <SellHeroForm
//               onBack={() => setShowForm(false)}
//               onSubmit={handleFinalSubmit}
//             />
//           ) : (
//             <div>
//               <h2 className="text-sm mb-4">
//                 New to <span className="font-semibold">Dhikcar</span>? Let's get
//                 you started
//               </h2>

//               {/* User Type */}
//               <label htmlFor="userType" className="text-sm">
//                 User Type
//               </label>
//               <div className="grid grid-cols-3 gap-5 mb-4 text-xs mt-1">
//                 <button
//                   onClick={() => setUserType("owner")}
//                   className={`flex-1 py-[6px] rounded ${
//                     userType === "owner"
//                       ? "bg-green-50 text-green-700 font-medium"
//                       : "bg-white border border-gray-300 text-gray-600"
//                   }`}
//                 >
//                   Owner
//                 </button>
//                 <button
//                   onClick={() => setUserType("dealer")}
//                   className={`flex-1 py-[6px] rounded ${
//                     userType === "dealer"
//                       ? "bg-green-50 text-green-700 font-medium"
//                       : "bg-white border border-gray-300 text-gray-600"
//                   }`}
//                 >
//                   Dealer
//                 </button>
//               </div>

//               {/* Form Fields */}
//               <div className="space-y-3">
//                 <label htmlFor="state" className="text-sm">
//                   State
//                 </label>
//                 <input
//                   type="text"
//                   value={state}
//                   onChange={(e) => setState(e.target.value)}
//                   placeholder="Enter your State"
//                   className="w-full rounded mt-1 px-3 py-2 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-800/50 outline-none"
//                 />
//                 <label htmlFor="city" className="text-sm">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                   placeholder="Enter your City"
//                   className="w-full rounded mt-1 px-3 py-2 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-800/50 outline-none"
//                 />
//                 <label htmlFor="locality" className="text-sm">
//                   Locality
//                 </label>
//                 <input
//                   type="text"
//                   value={locality}
//                   onChange={(e) => setLocality(e.target.value)}
//                   placeholder="Select your neighbourhood"
//                   className="w-full rounded mt-1 px-3 py-2 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-800/50 outline-none"
//                 />
//               </div>

//               <button
//                 onClick={() => setShowForm(true)}
//                 className="w-full mt-6 bg-black/90 text-white py-2 rounded-sm hover:bg-black transition"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }
