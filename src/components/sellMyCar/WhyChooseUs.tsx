const features = [
  {
    icon: "/sellPage/verified buyers.png",
    title: (
      <p>
        Verified <br className="hidden lg:block" /> Buyers
      </p>
    ),
    description:
      "Documentation and RC transfers can take months! We’ll handle it all",
  },
  {
    icon: "/sellPage/instant-down-pyment.png",
    title: (
      <p>
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
      "Documentation and RC transfers can take months! We’ll handle it all",
  },
  {
    icon: "/sellPage/map-pinned.png",
    title: (
      <p>
        Sell From <br className="hidden lg:block" /> Anywhere
      </p>
    ),
    description:
      "From inspection to payment, everything right from your doorstep!",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="pb-12 pt-6 bg-white font-montserrat">
      <div className="max-w-6xl mx-auto text-center">
        {/* Small title */}
        <p className="text-xs text-[#EE1422] font-semibold flex items-center justify-center gap-5 mb-6">
          <span className="w-10 h-[1.25px] bg-[#EE1422]/80"></span>
          Why Choose Us
          <span className="w-10 h-[1.25px] bg-[#EE1422]/80"></span>
        </p>

        {/* Main title */}
        <h2 className="text-2xl md:text-[23px] font-bold mb-5">
          Why sell car to DhikCar?
        </h2>

        {/* Sub text */}
        <p className="text-gray-900 max-w-xl mx-auto mb-8 leading-5.5">
          Discover what sets us apart — trusted expertise, exceptional service,
          and a commitment to your success.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-4 py-12 text-left hover:shadow-lg transition"
            >
              {/* <feature.icon size={256} strokeWidth={1.} className="h-24 w-16 font-thin text-red-500 mb-4" /> */}
              <div>
                <img
                  src={feature.icon}
                  alt="feature icon"
                  className="h-18 w-18 mb-4"
                />
              </div>
              <h3 className="font-[600] text-2xl text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-[15px] leading-5.5">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
