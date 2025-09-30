const features = [
  {
    icon: "/sellPage/verified buyers.png",
    title: (
      <p>
        Verified <br className="hidden lg:block" /> Buyers
      </p>
    ),
    description:
      "Documentation and RC transfers can take months! We'll handle it all",
  },
  {
    icon: "/sellPage/instant-down-pyment.png",
    title: (
      <p className="tracking-tight md:tracking-normal">
        Instant <br className="hidden lg:block" /> Down Payment
      </p>
    ),
    description:
      "The amount is transferred directly to your bank account within minutes",
  },
  {
    icon: "/sellPage/doc.png",
    title: (
      <p>
        Hassle-free <br className="hidden lg:block" /> Documentation
      </p>
    ),
    description:
      `Documentation and RC transfers can take months! We'll handle it all`,
  },
  {
    icon: "/sellPage/map-pinned.png",
    title: (
      <p>
        Sell From <br className="block" /> Anywhere
      </p>
    ),
    description:
      "From inspection to payment, everything right from your doorstep!",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="lg:py-6 bg-white px-4 lg:px-0">
      <div className="max-w-6xl mx-auto text-center">
        {/* Small title */}
        <p className="text-[10px] lg:text-xs text-[#EE1422] font-semibold flex items-center justify-center gap-3 lg:gap-5 mb-2 lg:mb-4">
          <span className="w-7 lg:w-10 h-[1px] lg:h-[1.25px] bg-[#EE1422]/80"></span>
          Why Choose Us
          <span className="w-7 lg:w-10 h-[1px] lg:h-[1.25px] bg-[#EE1422]/80"></span>
        </p>

        {/* Main title */}
        <h2 className="text-sm lg:text-2xl font-bold mb-2 lg:mb-4">
          Why sell car to DhikCar?
        </h2>

        {/* Sub text */}
        <p className="text-[9px] lg:text-base text-gray-900 max-w-xl mx-auto mb-4 lg:mb-8 leading-3 lg:leading-5.5">
          Discover what sets us apart — trusted expertise, exceptional service,
          and a commitment to your success.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 sm:mx-16 lg:mx-0">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xs lg:rounded-md shadow-md p-2 lg:p-4 py-4 lg:py-12 text-left hover:shadow-lg active:scale-95 transition"
            >
              {/* <feature.icon size={256} strokeWidth={1} className="h-24 w-16 font-thin text-red-500 mb-4" /> */}
              <div>
                <img
                  src={feature.icon}
                  alt="feature icon"
                  className="h-10 lg:h-18 w-10 lg:w-18 mb-2 lg:mb-4"
                />
              </div>
              <h3 className="font-[600] text-xs lg:text-2xl text-gray-900 mb-2 lg:mb-4 leading-tight">
                {feature.title}
              </h3>
              <p className="sm:max-w-[75%] lg:max-w-full text-black text-[9px] md:text-[10px] lg:text-[16px] leading-3 lg:leading-5.5">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
