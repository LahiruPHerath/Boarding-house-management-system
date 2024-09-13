import React, { useState } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Transition } from "@headlessui/react"; // Assuming you're using TailwindCSS
const FAQ = () => {
  return (
    <div>
      <Header />
      <Faq />
      <Footer />
    </div>
  );
};

const faqs = [
  {
    question: "Who can use the boarding management system?",
    answer:
      "The boarding management system is available for students to manage their boarding house payments and for boarding house owners to track payments and manage tenants.",
  },
  {
    question: "How do I register as a student or owner?",
    answer:
      "To register, click on the 'Sign Up' link on our website. During registration, you will need to select your role as either a student or a boarding house owner. Once registered, you can immediately start using the system based on your role.",
  },
  {
    question: "How do I contact the boarding house owner?",
    answer:
      "When you click on the relevant boarding house, there will be an option to chat directly with the boarding house owner.",
  },
  {
    question: "What if I have an issue with my boarding payment?",
    answer:
      "If you encounter an issue with your payment, you can contact the boarding house owner through the chat feature or reach out to the system admin for assistance.",
  },
  {
    question: "Is my personal information secure on this platform?",
    answer:
      "Yes, we take your security and privacy seriously. Your information is not shared with third parties without your consent, except as required by law.",
  },
  {
    question: "Can I schedule a visit to a boarding house?",
    answer:
      "Yes, you can schedule a visit for a particular boarding house. Once your request is submitted, the boarding house owner will review and approve it.",
  },
];

const FaqItem = ({ faq, index, activeTab, toggleTab }) => {
  const isOpen = activeTab === index;
  return (
    <div className="container border-b border-gray-200 p-8 ">
      <button
        className="flex items-center justify-between w-full"
        onClick={() => toggleTab(index)}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-gray-900">
          {faq.question}
        </span>
        <svg
          className={`h-6 w-6 text-gray-500 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <Transition
        show={isOpen}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="mt-4">
          <p className="text-base text-gray-500">{faq.answer}</p>
        </div>
      </Transition>
    </div>
  );
};

const Faq = () => {
  const [activeTab, setActiveTab] = useState(null);

  const toggleTab = (index) => {
    setActiveTab(activeTab === index ? null : index);
  };

  return (
    <div className="my-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 justify-center items-center text-center">
        Frequently Asked Questions
        <h2 className="text align-center color-storm text-lg ember font-normal text-[#6C7778]">
          Get answers to the frequently asked questions about Helacraft
          products.
        </h2>
      </h2>

      <div className="mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <FaqItem
            key={index}
            faq={faq}
            index={index}
            activeTab={activeTab}
            toggleTab={toggleTab}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
