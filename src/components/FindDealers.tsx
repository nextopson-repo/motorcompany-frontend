import { ArrowRight } from "lucide-react";

export default function FindDealers() {
  return (
    <section className="max-w-7xl h-[350px] flex items-center relative">
      {/* Left Text Section */}
      <div className="md:w-[60%] h-full px-8 py-12 flex flex-col justify-between bg-gradient-to-r from-sky-100 via-sky-200/60 to-pink-50/5 z-5">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-xs text-black">
            <div className="w-10 h-[1px] bg-gray-600"></div>
            <span className="font-semibold">Find Dealers</span>
            <div className="w-10 h-[1px] bg-gray-600"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 relative">
            Can’t find your Desired Car! Don’t Worry <span className="absolute -top-4 left-[63%] -translateX-[60%]"><img src="/find-dealer-heading-top.png" alt="design" className="h-6 w-8"/></span>
          </h2>

          <p className="text-gray-800 text-sm leading-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>

        <div>
            <a
          href="/top-dealer"
          className="inline-flex items-center text-black text-xl font-semibold underline underline-offset-2 group hover-scale-[1.05]"
        >
          Talk to the Dealers Now{" "}
          <ArrowRight className="ml-2 h-7 w-7 group-hover:ml-6 transition-all duration-300 ease-in-out" />
        </a>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="absolute top-0 right-0 z-0 md:w-[50%] h-full mt-6 md:mt-0 flex justify-center items-center bg-[radial-gradient(closest-side,theme(colors.rose.50),theme(colors.pink.200),rgba(253,242,248,0.5))]">
        <img
          src="/find-dealer-bg-img-1.png"
          alt="Dealers discussion illustration"
          className="w-full h-[85%] max-w-md object-cover"
        />
      </div>
    </section>
  );
}
