import { getTrackBackground, Range } from "react-range";
 export const renderRange = (
    values: [number, number],
    setValues: (range: [number, number]) => void,
    min: number,
    max: number,
    step: number,
    prefix?: string
  ) => (
    <div className="px-2">
      <div className="flex justify-between text-sm font-medium mb-2">
        <span className="text-[10px] font-semibold xl:text-xs text-red-600">
          {prefix}
          {values[0].toLocaleString()}
        </span>
        <span className="text-[10px] font-semibold xl:text-xs text-red-600">
          {prefix}
          {values[1].toLocaleString()}
        </span>
      </div>

      <Range
        values={values}
        step={step}
        min={min || 0}
        max={max}
        onChange={(vals) => setValues([vals[0], vals[1]])}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-0.5 rounded relative w-full"
            style={{
              background: getTrackBackground({
                values,
                colors: ["#D1D5DB", "#EF4444", "#D1D5DB"],
                min,
                max,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => {
          const { key, ...rest } = props || {};
          return (
            <div
              key={key}
              {...rest}
              className="h-2.5 w-2.5 bg-red-600 border border-white rounded-full cursor-pointer"
            />
          );
        }}
      />
    </div>
  );