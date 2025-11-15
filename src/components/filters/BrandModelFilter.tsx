import { useState } from "react";
import { brands } from "../../data/Data";
import type { SelectedFilters } from "../../store/slices/carSlice";

interface Props {
  onClose: () => void;
  selectedFilters: SelectedFilters;
  onSelectedFiltersChange: (filters: SelectedFilters) => void;
  getTotalCount: (field: string, value: string) => number;
}

const BrandModelFilter: React.FC<Props> = ({
  onClose,
  selectedFilters,
  onSelectedFiltersChange,
  getTotalCount,
}) => {
  // LOCAL TEMP DATA (will not apply until Show Cars)
  const [tempBrands, setTempBrands] = useState<string[]>([...selectedFilters.brand]);
  const [tempModels, setTempModels] = useState<string[]>([...selectedFilters.model]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const brandsPerSlide = 9;
  const totalSlides = Math.ceil(brands.length / brandsPerSlide);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (index: number) => setCurrentSlide(index);

  const getCurrentBrands = () => {
    const startIndex = currentSlide * brandsPerSlide;
    return brands.slice(startIndex, startIndex + brandsPerSlide);
  };

  // Toggle brand (local only)
  const toggleTempBrand = (brand: string) => {
    let updatedBrands = [...tempBrands];

    if (updatedBrands.includes(brand)) {
      // remove brand
      updatedBrands = updatedBrands.filter((b) => b !== brand);
      // also remove models under this brand
      const brandModels = brands.find((b) => b.title === brand)?.models || [];
      setTempModels((prev) => prev.filter((m) => !brandModels.includes(m)));
    } else {
      updatedBrands.push(brand);
    }

    setTempBrands(updatedBrands);
  };

  // Toggle model (local only)
  const toggleTempModel = (model: string) => {
    if (tempModels.includes(model)) {
      setTempModels(tempModels.filter((m) => m !== model));
    } else {
      setTempModels([...tempModels, model]);
    }
  };

  // APPLY FINAL SELECTION
  const handleShowCars = () => {
    onSelectedFiltersChange({
      ...selectedFilters,
      brand: tempBrands,
      model: tempModels,
    });

    onClose();
  };

  return (
    <div className="fixed left-0 bottom-0 w-full bg-white shadow-lg rounded-t-lg px-4 py-4 z-20 border border-gray-200">
      <h3 className="font-semibold mb-2">
        {selectedBrand ? "Select a Model" : "Select a Car Brand"}
      </h3>

      <div className="lg:hidden relative pt-4 pb-4 border-t border-gray-200">

        {/* --------------------- BRAND LIST --------------------- */}
        {!selectedBrand ? (
          <>
            <div className="grid grid-cols-3 mx-auto">
              {getCurrentBrands().map((brand, index) => {
                const isSelected = tempBrands.includes(brand.title);

                return (
                  <div
                    key={brand.title}
                    onClick={() => {
                      setSelectedBrand(brand.title);
                      toggleTempBrand(brand.title);
                    }}
                    className={`
                      flex flex-col items-center text-center cursor-pointer 
                      hover:scale-105 transition-transform p-2
                      ${isSelected ? "shadow-md scale-[1.05]" : ""}
                      ${(index + 1) % 3 !== 0 ? "border-r border-gray-200" : ""}
                      ${index < 6 ? "border-b border-gray-200" : ""}
                    `}
                  >
                    <div className="w-10 h-7 mb-2">
                      <img
                        src={brand.logo}
                        alt={brand.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="font-semibold text-[9px]">{brand.title}</p>
                    <p className="text-gray-500 text-[9px] mt-1">
                      {getTotalCount("brand", brand.title)} cars Available
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Brand Pagination */}
            <div className="w-full flex items-center justify-around px-24 mt-6">
              <button onClick={prevSlide} disabled={currentSlide === 0}>
                <svg
                  className={`w-5 h-5 ${
                    currentSlide === 0 ? "text-gray-200" : "text-gray-400"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
                </svg>
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full ${
                      currentSlide === index ? "bg-gray-800" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
              >
                <svg
                  className={`w-5 h-5 ${
                    currentSlide === totalSlides - 1
                      ? "text-gray-200"
                      : "text-gray-400"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59 16.09l4.58-4.59-4.58-4.59L10 5.5l6 6-6 6z" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* --------------------- MODEL LIST --------------------- */}
            <div className="grid grid-cols-3 gap-2 gap-y-4 mx-auto max-w-xs">
              {brands
                .find((b) => b.title === selectedBrand)
                ?.models.map((model) => (
                  <div
                    key={model}
                    onClick={() => toggleTempModel(model)}
                    className={`
                      flex items-center justify-center text-center border rounded p-2 text-xs cursor-pointer 
                      hover:bg-gray-100 transition
                      ${
                        tempModels.includes(model)
                          ? "bg-black text-white border-black"
                          : "border-gray-300"
                      }
                    `}
                  >
                    {model}
                  </div>
                ))}
            </div>

            {/* Model Controls */}
            <div className="grid grid-cols-2 gap-3 mt-4 border-t border-gray-200 pt-4">
              <button
                className="w-full py-1 bg-gray-200 rounded-xs text-xs"
                onClick={() => setSelectedBrand(null)}
              >
                Back to Brands
              </button>
              <button
                className="w-full py-1 bg-black text-white rounded-xs text-xs"
                onClick={handleShowCars}
              >
                Apply
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer for Brand Page */}
      {!selectedBrand && (
        <div className="grid grid-cols-2 gap-3 mt-2 border-t border-gray-200 pt-4">
          <button
            className="py-1 bg-gray-200 rounded-xs text-xs"
            onClick={() => {
              setTempBrands([]);
              setTempModels([]);
              onClose();
            }}
          >
            Clear
          </button>
          <button
            className="py-1 bg-black text-white rounded-xs text-xs"
            onClick={handleShowCars}
          >
            Show Cars
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandModelFilter;



// import { useSelector, useDispatch } from "react-redux";
// import type { RootState } from "../../store/store";
// import { toggleBrand, resetFilters } from "../../store/slices/filterSlice";
// import { useState } from "react";
// import type { SelectedFilters } from "../../store/slices/carSlice";
// import { brands } from "../../data/Data";

// interface Props {
//   onClose: () => void;
//   selectedFilters: SelectedFilters;
//   onSelectedFiltersChange: (filters: SelectedFilters) => void;
//   getTotalCount: (field: string, value: string) => number;
// }

// const BrandModelFilter: React.FC<Props> = ({
//   onClose,
//   onSelectedFiltersChange,
//   selectedFilters,
//   getTotalCount,
// }) => {
//   const selectedBrands = useSelector((state: RootState) => state.filters.brand);
//   const dispatch = useDispatch();

//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

//   const brandsPerSlide = 9;
//   const totalSlides = Math.ceil(brands.length / brandsPerSlide);

//   const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
//   const prevSlide = () =>
//     setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
//   const goToSlide = (index: number) => setCurrentSlide(index);

//   const getCurrentBrands = () => {
//     const startIndex = currentSlide * brandsPerSlide;
//     return brands.slice(startIndex, startIndex + brandsPerSlide);
//   };

//   const handleShowCars = () => {
//     onClose();
//   };

//   return (
//     <div className="fixed left-0 bottom-0 w-full bg-white shadow-lg rounded-t-lg px-4 py-4 z-20 border border-gray-200">
//       <h3 className="font-semibold mb-2">
//         {selectedBrand ? "Select a Model" : "Select a Car Brand"}
//       </h3>

//       <div className="lg:hidden relative pt-4 pb-4 border-t border-gray-200">
//         {!selectedBrand ? (
//           <>
//             {/* Brand Grid with Conditional Borders */}
//             <div className="grid grid-cols-3 mx-auto">
//               {getCurrentBrands().map((brand, index) => {
//                 const isLastCol = (index + 1) % 3 === 0; // 3rd col
//                 const isLastRow = index >= 6; // 7,8,9 indexes = 3rd row

//                 return (
//                   <div
//                     key={brand.title}
//                     onClick={() => setSelectedBrand(brand.title)}
//                     className={`
//                       flex flex-col items-center text-center cursor-pointer 
//                       hover:scale-105 transition-transform p-2
//                       ${
//                         selectedBrands.includes(brand.title)
//                           ? "shadow-md scale-[1.05]"
//                           : ""
//                       }
//                       ${!isLastCol ? "border-r border-gray-200" : ""}
//                       ${!isLastRow ? "border-b border-gray-200" : ""}
//                     `}
//                   >
//                     <div className="w-10 h-7 mb-2">
//                       <img
//                         src={brand.logo}
//                         alt={brand.title}
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                     <p className="font-semibold text-[9px]">{brand.title}</p>
//                     <p className="text-gray-500 text-[9px] mt-1">
//                        {getTotalCount("brand", brand.title)} cars Available
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Slider Navigation */}
//             <div className="w-full flex items-center justify-around px-24 mt-6">
//               <button
//                 onClick={prevSlide}
//                 className="w-6 h-6 flex items-center justify-center"
//                 disabled={currentSlide === 0}
//               >
//                 <svg
//                   className={`w-5 h-5 ${
//                     currentSlide === 0 ? "text-gray-200" : "text-gray-400"
//                   }`}
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
//                 </svg>
//               </button>
//               <div className="flex justify-center gap-2">
//                 {Array.from({ length: totalSlides }).map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => goToSlide(index)}
//                     className={`w-2 h-2 rounded-full transition-colors ${
//                       currentSlide === index ? "bg-gray-800" : "bg-gray-300"
//                     }`}
//                   />
//                 ))}
//               </div>
//               <button
//                 onClick={nextSlide}
//                 className="w-6 h-6 flex items-center justify-center"
//                 disabled={currentSlide === totalSlides - 1}
//               >
//                 <svg
//                   className={`w-5 h-5 ${
//                     currentSlide === totalSlides - 1
//                       ? "text-gray-200"
//                       : "text-gray-400"
//                   }`}
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M8.59 16.09l4.58-4.59-4.58-4.59L10 5.5l6 6-6 6z" />
//                 </svg>
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             {/* Models Grid */}
//             <div className="grid grid-cols-3 gap-2 sm:gap-4 gap-y-4 max-w-xs sm:max-w-xl mx-auto">
//               {brands
//                 .find((b) => b.title === selectedBrand)
//                 ?.models.map((model) => (
//                   <div
//                     key={model}
//                     onClick={() => {
//                       dispatch(toggleBrand(selectedBrand));
//                     }}
//                     className="flex items-center justify-center text-center border border-gray-300 rounded p-2 text-xs cursor-pointer hover:bg-gray-100"
//                   >
//                     {model}
//                   </div>
//                 ))}
//             </div>
//             {/* Slider Navigation */}
//             <div className="w-full flex items-center justify-around px-24 mt-6">
//               <button
//                 onClick={prevSlide}
//                 className="w-6 h-6 flex items-center justify-center"
//                 disabled={currentSlide === 0}
//               >
//                 <svg
//                   className={`w-5 h-5 ${
//                     currentSlide === 0 ? "text-gray-200" : "text-gray-400"
//                   }`}
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
//                 </svg>
//               </button>
//               <div className="flex justify-center gap-2">
//                 {Array.from({ length: totalSlides }).map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => goToSlide(index)}
//                     className={`w-2 h-2 rounded-full transition-colors ${
//                       currentSlide === index ? "bg-gray-800" : "bg-gray-300"
//                     }`}
//                   />
//                 ))}
//               </div>
//               <button
//                 onClick={nextSlide}
//                 className="w-6 h-6 flex items-center justify-center"
//                 disabled={currentSlide === totalSlides - 1}
//               >
//                 <svg
//                   className={`w-5 h-5 ${
//                     currentSlide === totalSlides - 1
//                       ? "text-gray-200"
//                       : "text-gray-400"
//                   }`}
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M8.59 16.09l4.58-4.59-4.58-4.59L10 5.5l6 6-6 6z" />
//                 </svg>
//               </button>
//             </div>
//           </>
//         )}

//         {/* Filter Buttons */}
//         {!selectedBrand ? (
//           <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-2 border-t border-gray-200 pt-4 sm:px-20">
//             <button
//               className="w-full py-1 bg-gray-200 rounded-xs text-xs active:scale-95"
//               onClick={() => {
//                 dispatch(resetFilters());
//                 onClose();
//               }}
//             >
//               Clear Filter
//             </button>
//             <button
//               className="w-full py-1 bg-black text-white rounded-xs text-xs active:scale-95"
//               onClick={handleShowCars}
//             >
//               Show Cars
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-2 border-t border-gray-200 pt-4 sm:px-20">
//             <button
//               className="w-full py-1 bg-gray-200 rounded-xs text-xs active:scale-95"
//               onClick={() => setSelectedBrand(null)}
//             >
//               Back to Brands
//             </button>
//             <button
//               className="w-full py-1 bg-black text-white rounded-xs text-xs active:scale-95"
//               onClick={handleShowCars}
//             >
//               Show Cars
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BrandModelFilter;