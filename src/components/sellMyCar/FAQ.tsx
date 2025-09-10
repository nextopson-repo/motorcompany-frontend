import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How to post a car on Dhikcar.com?",
    answer:
      "Yes. You can post the property for free on DhikCar.com. However, there is a limit on the number of cars you can post for free depending on your profile type. Free listings also have limited access to buyer enquiries.",
  },
  {
    question: "Can I post a car for free?",
    answer:
      "Yes, you can post cars for free depending on your account type. Free accounts have certain limitations compared to premium ones.",
  },
  {
    question: "What are the benefits of posting a property on Housing.com?",
    answer:
      "You get maximum visibility, verified leads, and better chances of selling your property faster with premium tools.",
  },
  {
    question: "When do I start getting enquiries on my property?",
    answer:
      "Once your listing is live, enquiries typically start within 24-48 hours depending on demand and location.",
  },
  {
    question: "When do I start getting enquiries on my property?",
    answer:
      "Once your listing is live, enquiries typically start within 24-48 hours depending on demand and location.",
  },
  {
    question: "When do I start getting enquiries on my property?",
    answer:
      "Once your listing is live, enquiries typically start within 24-48 hours depending on demand and location.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-10 relative -z-0">
      {/* Heading */}
      <div className="max-w-2xl mx-auto text-center mb-8">
         <p className="text-[#EE1422] font-semibold flex items-center justify-center gap-4">
          <span className="w-10 h-[1.4px] bg-[#EE1422]/80"></span>
          FAQ's
          <span className="w-10 h-[1.4px] bg-[#EE1422]/80"></span>
        </p>
        <h2 className="text-xl md:text-[23px] leading-7.5 font-bold mt-4">
          Got Questions? We’ve Got Answers
        </h2>
        <p className="text-[16px] max-w-2xl mx-auto mt-4 text-gray-800 leading-5.5 px-4">
          Have questions? We’ve gathered the most common ones to help you get
          the answers you need—fast and easy.
        </p>
      </div>

      {/* Accordion */}
      <div className="max-w-3xl mx-auto space-y-4 z-5 relative">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white/50 rounded-xl shadow-sm overflow-hidden transition-all"
          >
            <button
              onClick={() => toggle(i)}
              className="flex justify-between items-center w-full px-5 py-4 text-left text-base font-medium focus:outline-none"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`px-5 pb-4 text-gray-600 text-sm md:text-base transition-all duration-300 ${
                openIndex === i ? "block" : "hidden"
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>

      {/* Background Image */}
      <div className="absolute bottom-[10%] left-[73%] -translateY-[10%] z-0">
        <img src="/sellPage/Faq-bg.png" alt="faq-bg"  className="w-[100%] h-[100%] object-contain object-right"/>
      </div>
    </section>
  );
}
