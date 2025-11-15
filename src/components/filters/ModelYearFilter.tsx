import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { setModelYearRange, resetFilters } from "../../store/slices/filterSlice";
import { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import type { SelectedFilters } from "../../store/slices/carSlice";

interface Props {
  onClose: () => void;
  selectedFilters: SelectedFilters;
  onSelectedFiltersChange: (filters: SelectedFilters) => void;
}

const ModelYearFilter: React.FC<Props> = ({ onClose, onSelectedFiltersChange, selectedFilters }) => {
  const dispatch = useDispatch();
  const selectedYearRange = useSelector(
    (state: RootState) => state.filters.yearRange
  );

  const currentYear = new Date().getFullYear();
  const minYear = 2000;

  const [values, setValues] = useState<[number, number]>(selectedYearRange);

  useEffect(() => {
    setValues(selectedYearRange);
  }, [selectedYearRange]);

  const handleShowCars = () => {
    dispatch(setModelYearRange(values));
    onSelectedFiltersChange({
        ...selectedFilters,
        yearRange: { min: minYear, max: currentYear }
      });
    onClose();
  };

  return (
    <div className="fixed left-0 bottom-0 w-full bg-white shadow-lg rounded-t-lg px-4 py-4 z-20 border border-gray-200">
      <h3 className="font-semibold mb-4">Select Model Year Range</h3>

      <div className="flex flex-col space-y-4 sm:px-16">
        {/* Display selected years */}
        <div className="flex justify-between text-xs">
          <span>{values[0]}</span>
          <span>{values[1]}</span>
        </div>

        {/* Range Slider */}
        <Range
          values={values}
          step={1}
          min={minYear}
          max={currentYear}
          onChange={(vals) => setValues([vals[0], vals[1]])}
          renderTrack={({ props, children }) => {
            const { key, ...rest } =
              (props as { key?: React.Key } & React.HTMLAttributes<HTMLDivElement>) || {};

            return (
              <div
                key={key}
                {...rest}
                className="h-[3px] w-full rounded relative"
                style={{
                  background: getTrackBackground({
                    values,
                    colors: ["#D1D5DB", "#EF4444", "#D1D5DB"], // grey - red - grey
                    min: minYear,
                    max: currentYear,
                  }),
                }}
              >
                {children}
              </div>
            );
          }}
          renderThumb={({ props }) => {
            const { key, ...rest } =
              (props as { key?: React.Key } & React.HTMLAttributes<HTMLDivElement>) || {};
            return (
              <div
                key={key}
                {...rest}
                className="h-4 w-4 bg-red-600 border border-white rounded-full cursor-pointer"
              />
            );
          }}
        />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-6 sm:px-20">
        <button
          className="w-full py-1 bg-gray-200 rounded-xs text-xs active:scale-95"
          onClick={() => {
            dispatch(resetFilters());
            onClose();
          }}
        >
          Clear Filter
        </button>
        <button
          className="w-full py-1 bg-black text-white rounded-xs text-xs active:scale-95"
          onClick={handleShowCars}
        >
          Show Cars
        </button>
      </div>
    </div>
  );
};

export default ModelYearFilter;
