import { ArrowRight } from "lucide-react";

export default function FindDealers() {
  return (
    <section className=" w-full md:max-w-7xl h-[170px] md:h-[310px] flex items-center relative overflow-hidden">
      {/* Left Text Section */}
      <div className="md:w-[58%] h-full px-2 md:px-8 py-4 md:py-12 flex flex-col justify-between bg-gradient-to-r from-sky-100 via-sky-200/60 to-pink-50/5 z-5">
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-2 md:gap-4 text-[9px] md:text-xs text-black">
            <div className="w-8 md:w-10 h-[1px] bg-gray-600"></div>
            <span className="font-semibold">Find Dealers</span>
            <div className="w-8 md:w-10 h-[1px] bg-gray-600"></div>
          </div>

          {/* <h2 className="text-[0.70rem] md:text-[1.6rem] font-bold text-gray-800 relative">
            Can't find your Desired Car! Don't Worry <span className="absolute -top-[35%] md:-top-2 lg:-top-4 left-[66%] md:left-[77%] lg:left-[70%] -translateX-1/2"><img src="/find-dealer-heading-top.png" alt="design" className="h-3 md:h-6 w-4 md:w-8"/></span>
          </h2> */}
          <h2 className="text-[0.70rem] md:text-[1.6rem] font-bold text-gray-800">
            Can't find your Desired Car! Don't {" "} 
            <span className="relative inline-block">
              Worry
              <img
                src="/find-dealer-heading-top.png"
                alt="design"
                className="absolute -top-[6px] lg:-top-2 left-8 lg:left-20 w-4 lg:w-8"
              />
            </span>
          </h2>

          <p className="text-gray-800 max-w-[75%] lg:max-w-[85%] md:max-w-auto text-[9px] md:text-sm leading-[1.3] md:leading-4 tracking-tight">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
            <span className="hidden md:inline">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </span>
          </p>
        </div>

        <div className="mb-4 md:mb-0">
          <a
            href="/top-dealer"
            className="inline-flex items-center text-black text-[0.65rem] md:text-xl font-semibold tracking-wide underline underline-offset-2 group hover-scale-[1.05]"
          >
            Talk to the Dealers Now{" "}
            <ArrowRight className="ml-2 h-3 w-3 md:h-7 md:w-9 group-hover:ml-6 transition-all duration-300 ease-in-out" />
          </a>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="absolute top-[25%] md:top-0 -right-[7%] md:right-0 z-0 w-1/2 h-full bg-[radial-gradient(closest-side,theme(colors.rose.50),theme(colors.pink.200),rgba(253,242,248,0.1))]">
        <img
          src="/find-dealer-bg-img-1.png"
          alt="Dealers discussion illustration"
          className="h-full w-full object-contain object-center pr-5"
        />
      </div>
    </section>
  );
}
