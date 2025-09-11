import React from "react";

const cities = [
  { name: "Chandigarh", cars: 2023, img: "/Cities/Chandigarh.png" },
  { name: "Ahmedabad", cars: 2023, img: "/Cities/Ahemdabad.png" },
  { name: "Pune", cars: 2023, img: "/Cities/Pune.png" },
  { name: "Hyderabad", cars: 2023, img: "/Cities/Hyderabad.png" },
  { name: "Kanpur", cars: 2023, img: "/Cities/Kanpur.png" },
  { name: "Indore", cars: 2023, img: "/Cities/Indore.png" },
  { name: "Lucknow", cars: 2023, img: "/Cities/Lucknow.png" },
  { name: "Delhi", cars: 2023, img: "/Cities/Delhi.png" },
  { name: "Bhopal", cars: 2023, img: "/Cities/Bhopal.png" },
  { name: "Jaipur", cars: 2023, img: "/Cities/Jaipur.png" },
];

const fourCards = [
  {
    title: "India's #1",
    img: "/Indias.png",
    description: "Largest Car Portal",
  },
  {
    title: "Cars Sold",
    img: "/carSold.png",
    description: "Every 4 Minute",
  },
  {
    title: "Offers",
    img: "/offers.png",
    description: "Stay Updated Pay less",
  },
  {
    title: "Compare",
    img: "/compare.png",
    description: "Decode the right car",
  },
];

const PopularCities: React.FC = () => {
  // const [search, setSearch] = useState("");
  // const [isOpen, setIsOpen] = useState(false);

  // const filteredCities = cities.filter((city) =>
  //   city.name.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <section className="w-full max-w-7xl font-montserrat pt-12">
      {/* Heading */}
      <div className="text-center">
        <p className="text-[#EE1422] font-semibold mb-4 flex items-center justify-center gap-5">
          <span className="w-10 h-[1.5px] bg-[#EE1422]"></span>
          Location based Cars
          <span className="w-10 h-[1.5px] bg-[#EE1422]"></span>
        </p>
        <h2 className="text-xl md:text-2xl font-semibold">
          Search by Popular Cities
        </h2>
      </div>

      {/* Search bar */}
      {/* <div className="flex justify-center mb-6">
        <div className="relative w-80">
          {isOpen && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <li
                    key={city.name}
                    onClick={() => {
                      setSearch(city.name);
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer "
                  >
                    {city.name}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              )}
            </ul>
          )}
        </div>
      </div> */}

      {/* Cities Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8 border-b border-gray-300 px-14 py-10">
        {cities.map((city) => (
          <div
            key={city.name}
            className="flex flex-col items-center text-center space-y-0 md:space-y-1 cursor-pointer hover:scale-105 transition-transform"
          >
            <div
              className="w-30 h-22 bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: `url(${city.img})` }}
            />
            <p className="font-semibold text-sm md:text-md">{city.name}</p>
            <span className="text-gray-400 text-[10px] md:text-xs">
              {city.cars} Cars Available
            </span>
          </div>
        ))}
      </div>

      {/* 4 cards end */}
      <div className="bg-white p-6 rounded-sm grid grid-cols-4 gap-8 my-10 px-14">
        {fourCards.map((card, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center rounded-sm shadow-xs p-4 gap-3"
          >
            <img
              src={card.img}
              alt={card.title}
              className="w-16 h-12 object-contain rounded-sm"
            />
            <div className="flex flex-col gap-3">
              <p className="text-md font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                {card.title}
              </p>
              <p className="text-xs text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis -mt-2">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularCities;
