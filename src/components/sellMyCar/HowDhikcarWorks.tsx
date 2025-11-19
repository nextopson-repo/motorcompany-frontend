export default function HowItWorks() {
  const steps = [
    {
      icon: "/sellPage/Vehicle_information 1.png",
      title: (
        <p className="tracking-tight md:tracking-normal">
          List your <br className="block lg:hidden" /> car for Free
        </p>
      ),
      desc: "Our team verifies your vehicle details to ensure accuracy. Once approved, your car is listed on our platform for free and shared with interested buyers and verified channel partners.",
    },
    {
      icon: "/sellPage/connect-with-buyer.png",
      title: (
        <p className="tracking-tight md:tracking-normal">
          Connect with <br className="block lg:hidden" /> Buyers
        </p>
      ),
      desc: "Engage with potential buyers and verified channel partners directly to negotiate a price and finalize the sale.",
    },
    {
      icon: "/sellPage/sell-your-car.png",
      title: "Sell your car with Ease",
      desc: "Complete the sale of your car at the agreed price—Dhikcar charges no commission fees.",
    },
  ];

  return (
    <section className="w-full py-12 lg:py-8 bg-white">
      <div className="max-w-7xl mx-auto text-center relative px-4 lg:px-6">
        {/* Section Header */}
        <p className="text-xs lg:text-xs text-[#EE1422] font-semibold flex items-center justify-center gap-3 lg:gap-5">
          <span className="w-8 lg:w-10 h-px lg:h-[1.25px] bg-[#EE1422]/80"></span>
          How Dhikcar Works
          <span className="w-8 lg:w-10 h-px lg:h-[1.25px] bg-[#EE1422]/80"></span>
        </p>
        <h2 className="text-lg lg:text-2xl font-bold mt-3.5 lg:mt-4 leading-6 lg:leading-normal">
          From Search to Sale - Here's How It Works
        </h2>
        <p className="text-xs md:text-xs lg:text-base text-gray-800 mt-3.5 lg:mt-4 max-w-xl mx-auto leading-tight tracking-tight md:tracking-normal">
          DhikCar makes car buying and selling easy. Search, compare, and
          connect with trusted sellers or buyers—all in one place.
        </p>

        {/* Steps */}
        <div className="relative mt-7 lg:mt-5 grid grid-cols-3 gap-10 lg:gap-6 items-start">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="bg-[#EDEDED] w-12 sm:w-26 lg:w-38 h-12 sm:h-24 lg:h-38 flex items-center justify-center rounded-md shadow-sm">
                <img
                  src={step.icon}
                  alt="step images"
                  className="h-8 sm:h-16 lg:h-22"
                />
              </div>
              <h3 className="text-xs lg:text-2xl text-gray-800 font-semibold mt-2 lg:mt-4">
                {step.title}
              </h3>
              <p className="hidden lg:block text-gray-800 mt-4 text-[16px] leading-[1.2] tracking-tight max-w-sm px-6">
                {step.desc}
              </p>
            </div>
          ))}

          <div className="absolute top-[8%] sm:top-[5%] left-[20.5%] lg:left-[23.5%] rotate-182 sm:rotate-180 lg:rotate- ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[85px] sm:w-[150px] lg:w-[230px] lg:h-[53px]"
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

          <div className="absolute top-[38%] sm:top-[32%] right-[20.5%] lg:right-[23.5%] rotate-2 sm:rotate-0 lg:-rotate-5 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[85px] sm:w-[150px] lg:w-[230px] lg:h-[53px]"
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
