// src/components/FAQ.js
export default function FAQ() {
  const faqItems = [
    {
      question: "What is this project?",
      answer: "This is a simple gambling machine dApp built on Ethereum for educational purposes.",
    },
    {
      question: "How do I participate?",
      answer: "Connect your wallet and click the 'Participate' button to deposit a fixed amount of ETH.",
    },
    {
      question: "Is it safe?",
      answer: "While the smart contract is designed to be simple, always exercise caution with dApps. This is primarily a learning project."
    },
    // Add more Q&A objects here
  ];

  return (
    // Removed border, shadow, my-6. Adjusted padding to use vh.
    // Added overflow-y-auto here if FAQ content is long and its parent has overflow-hidden.
    // This ensures the FAQ content itself can scroll if it's too long for the space allocated to it by page.js
    <div className="p-[1vh] bg-white h-full overflow-y-auto"> 
      <h2 className="text-[1.8vh] sm:text-[2vh] font-bold mb-[1.5vh] text-center text-gray-700">
        Frequently Asked Questions
      </h2>
      <div className="space-y-[1vh]">
        {faqItems.map((item, index) => (
          <div key={index}>
            <h3 className="text-[1.3vh] sm:text-[1.5vh] font-semibold text-gray-800">{item.question}</h3>
            <p className="text-gray-600 text-[1.2vh] sm:text-[1.4vh]">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}