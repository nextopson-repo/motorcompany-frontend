import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is DhikCar.com?",
    answer:
      "DhikCar.com is an online platform where you can buy, sell, or resell cars easily. Whether you're a car owner looking to sell or a buyer searching for verified listings, DhikCar connects you with genuine users and smooth deals.",
  },
  {
    question: "How can I post my car for sale?",
    answer:
      "To post your car, simply sign in to your DhikCar account, click on 'Sell Car', and fill in all required details like brand, model, year, price, and upload high-quality images. Once submitted, your listing goes live after quick verification.",
  },
  {
    question: "How long does it take for my listing to go live?",
    answer:
      "After submission, your car listing is reviewed for quality and authenticity. Usually, it goes live within 1 to 3 hours during working hours.",
  },
  {
    question: "When will I start getting buyer enquiries?",
    answer:
      "Once your listing is live, you may start receiving enquiries within 24–48 hours. Response time depends on your car’s demand, price, and condition.",
  },
  {
    question: "How do I contact a seller or buyer on DhikCar?",
    answer:
      "You can directly contact sellers or buyers using the contact options available on each listing page. Verified users get access to direct chat or call options for smoother communication.",
  },
  {
    question: "Does DhikCar charge any commission on car sales?",
    answer:
      "No, DhikCar doesn’t take any commission. The entire transaction happens directly between the buyer and the seller.",
  },
];


export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 relative z-0 pb-10 overflow-hidden">
      {/* Heading */}
      <div className="max-w-2xl mx-auto text-center mb-4 lg:mb-8">
         <p className="text-[#EE1422] text-[10px] lg:text-xs font-semibold flex items-center justify-center gap-2 lg:gap-4">
          <span className="w-7 lg:w-10 h-px lg:h-[1.4px] bg-[#EE1422]/80"></span>
          FAQ
          <span className="w-7 lg:w-10 h-px lg:h-[1.4px] bg-[#EE1422]/80"></span>
        </p>
        <h2 className="text-sm lg:text-[23px]  lg:leading-7.5 font-bold mt-2 lg:mt-4">
          Got Questions? We've Got Answers
        </h2>
        <p className="text-[9px] md:text-[10px] lg:text-[16px] max-w-xl mx-auto mt-2 lg:mt-4 text-gray-800 leading-3 lg:leading-5.5 px-4">
          Have questions? We've gathered the most common ones to help you get
          the answers you need—fast and easy.
        </p>
      </div>

      {/* Accordion */}
      <div className="max-w-2xl mx-auto space-y-3 lg:space-y-6 z-5 relative">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white/50 rounded-md overflow-hidden transition-all"
            style={{ boxShadow: "0px 0px 10px -4px rgba(0, 0, 0, 0.12)",}}
          >
            <button
              onClick={() => toggle(i)}
              className="flex lg:items-center justify-between gap-2 w-full p-2 lg:p-5 text-left text-[11px] md:text-xs lg:text-base md:font-medium focus:outline-none"
            >
              <span className=" text-black">{faq.question}</span>
              <span className="w-fit">
                <ChevronDown
                className={`w-4 lg:w-5 h-4 lg:h-5 transform transition-transform duration-300 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
              </span>
            </button>
            
            <div
              className={`px-2 lg:px-5 pb-4 text-gray-600 text-[9px] md:text-[10px] lg:text-sm tracking-tight transition-all duration-300 ${
                openIndex === i ? "block" : "hidden"
              }`}
            >
              <div className="custom-dash mb-4" />
              <span className="text-black">{faq.answer}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Background Image */}
      <div className="hidden lg:block h-auto w-[32%] absolute bottom-[2%] left-[68%] -translateY-[10%] z-0 overflow-hidden">
        <img src="/sellPage/Faq-bg.png" alt="faq-bg"  className="w-[640px] h-[440px] object-contain object-right"/>
      </div>
    </section>
  );
}
