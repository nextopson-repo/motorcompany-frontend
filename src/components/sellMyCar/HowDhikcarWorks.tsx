
export default function HowItWorks() {
  const steps = [
    {
      icon: "/sellPage/Vehicle_information 1.png",
      title: "List your car for Free",
      desc: "Our team verifies your vehicle details to ensure accuracy. Once approved, your car is listed on our platform for free and shared with interested buyers and verified channel partners.",
    },
    {
      icon: "/sellPage/connect-with-buyer.png",
      title: "Connect with Buyers",
      desc: "Engage with potential buyers and verified channel partners directly to negotiate a price and finalise the sale.",
    },
    {
      icon: "/sellPage/sell-your-car.png",
      title: "Sell your car with Ease",
      desc: "Complete the sale of your car at the agreed price—CarDekho charges no commission fees.",
    },
  ];

  return (
    <section className="w-full py-8 bg-white">
      <div className="max-w-6xl mx-auto text-center px-6 relative">
        {/* Section Header */}
        {/* Small title */}
        <p className="text-xs text-[#EE1422] font-semibold flex items-center justify-center gap-5 mb-4">
          <span className="w-10 h-[1.25px] bg-[#EE1422]/80"></span>
          How Dhikcar Works
          <span className="w-10 h-[1.25px] bg-[#EE1422]/80"></span>
        </p>
        <h2 className="text-2xl md:text-2xl font-bold">
          From Search to Sale – Here’s How It Works
        </h2>
        <p className="text-gray-800 mt-4 max-w-xl mx-auto">
          DhikCar makes car buying and selling easy. Search, compare, and
          connect with trusted sellers or buyers—all in one place.
        </p>

        {/* Steps */}
        <div className="relative mt-6 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 items-start">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="bg-gray-200 w-36 h-36 flex items-center justify-center rounded-2xl shadow-sm">
                <img src={step.icon} alt="step images" className="h-18" />
              </div>
              <h3 className="text-2xl text-gray-800 font-semibold mt-6">
                {step.title}
              </h3>
              <p className="text-gray-800 mt-4 text-[14px] leading-[1.2] max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}

          <div className="absolute top-[30%] right-[28.5%] w-[150px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="53"
              viewBox="0 0 303 53"
              fill="none"
            >
              <path
                d="M2.25098 2.53809C52.3321 38.9498 182.173 89.9261 300.888 2.53809"
                stroke="#969696"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="19 19"
              />
            </svg>
          </div>
          <div className="absolute top-[8%] left-[28.5%] w-[150px] rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="53"
              viewBox="0 0 303 53"
              fill="none"
            >
              <path
                d="M2.25098 2.53809C52.3321 38.9498 182.173 89.9261 300.888 2.53809"
                stroke="#969696"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="19 19"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
