import { ArrowRight } from "lucide-react";

export default function FindDealers() {
  return (
    <section className=" w-full lg:max-w-7xl h-[170px] sm:h-[200px] lg:h-[310px] flex items-center relative overflow-hidden">
      {/* Left Text Section */}
      <div className="lg:w-[58%] h-full px-2 lg:px-8 py-4 lg:py-12 flex flex-col justify-between bg-gradient-to-r from-sky-100 via-sky-200/60 to-pink-50/5 z-5">
        <div className="space-y-2 lg:space-y-3">
          <div className="flex items-center gap-2 sm:gap-4 text-[9px] sm:text-xs text-black">
            <div className="w-8 sm:w-10 h-[1px] bg-gray-600"></div>
            <span className="font-semibold">Find Dealers</span>
            <div className="w-8 sm:w-10 h-[1px] bg-gray-600"></div>
          </div>

          {/* <h2 className="text-[0.70rem] md:text-[1.6rem] font-bold text-gray-800 relative">
            Can't find your Desired Car! Don't Worry <span className="absolute -top-[35%] md:-top-2 lg:-top-4 left-[66%] md:left-[77%] lg:left-[70%] -translateX-1/2"><img src="/find-dealer-heading-top.png" alt="design" className="h-3 md:h-6 w-4 md:w-8"/></span>
          </h2> */}
          <h2 className="text-[0.70rem] sm:text-[1.1rem] lg:text-[1.6rem] font-bold text-gray-800">
            Can't find your Desired Car! Don't{" "}
            <span className="relative inline-block">
              Worry
              <img
                src="/find-dealer-heading-top.png"
                alt="design"
                className="absolute -top-[6px] sm:-top-1 lg:-top-2 left-8 sm:left-14 lg:left-20 w-4 lg:w-8"
              />
            </span>
          </h2>

          <p className="text-gray-800 max-w-[75%] sm:max-w-[60%] lg:max-w-[85%] lg:max-w-auto text-[9px] sm:text-xs lg:text-sm leading-[1.3] lg:leading-4 tracking-tight">
            Struggling to find the perfect car? DhikCar connects you with
            trusted dealers so you can explore a wide range of vehicles, compare
            prices,
            <span className="hidden lg:inline">
              and get expert guidance to make your car buying or selling
              experience smooth, fast, and reliable.
            </span>
          </p>
        </div>

        <div className="mb-4 lg:mb-0">
          <a
            href="/top-dealer"
            className="inline-flex items-center text-black text-[0.65rem] lg:text-xl font-semibold tracking-wide underline underline-offset-2 group hover-scale-[1.05]"
          >
            Talk to the Dealers Now{" "}
            <ArrowRight className="ml-2 h-3 w-3 lg:h-7 lg:w-9 group-hover:ml-6 transition-all duration-300 ease-in-out" />
          </a>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="absolute top-[25%] lg:top-0 -right-[7%] lg:right-0 z-0 w-1/2 h-full bg-[radial-gradient(closest-side,theme(colors.rose.50),theme(colors.pink.200),rgba(253,242,248,0.1))]">
        <img
          src="/find-dealer-bg-img-1.png"
          alt="Dealers discussion illustration"
          className="h-full w-full object-contain object-center pr-5"
        />
      </div>
    </section>
  );
}
