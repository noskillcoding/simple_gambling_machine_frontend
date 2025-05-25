// src/components/FAQ.js
export default function FAQ() {
  const faqItems = [
    {
      question: "What is it about?",
      answer: "A decentralized game: deposit a small % of the pot, and if no one deposits after you — you win big. And 5 randoms win little. Check the structure below",
    },
    {
      question: "How to gamble?",
      answer: "Connect your wallet, hit Deposit, and send the required ETH (auto-calculated for you).",
    },
    {
      question: "How can I win?",
      answer: "Be the last depositor before the countdown hits zero. You get 80% of the pot. 5 others (randomly selected) win 2% each."
    },
    {
      question: "When will the game end?",
      answer: "When no new deposit is made before the timer expires, anyone can hit Claim to end the game — the last depositor gets 80% of the pot, 5 others get 2% each. The timer shortens as more deposits are made."
    },
    {
      question: "Is it safe?",
      answer: "Yes, it’s fully on-chain and immutable. 1. deployed at 0xYourOfficialVerifiedAddress on Ethereum mainnet. 2.verified source code on Etherscan: [link]. 3. frontend is open-source: [GitHub link]. 4. hosted on IPFS at: [link].eth. 5.always check the contract address in your wallet before confirming any transaction."
    },
    {
      question: "Is the smart contract audited?",
      answer: "No. Use at your own risk. The code is pretty simple though, go to GitHub/Etherscan, copy it and send to your favourite LLM to check it."
    },
    {
      question: "Why is the frontend so shitty?",
      answer: "I focused on the game, not the looks. Contributions welcome — [GitHub link]."
    },
  ];

  return (
    // Removed border, shadow, my-6. Adjusted padding to use vh.
    // Added overflow-y-auto here if FAQ content is long and its parent has overflow-hidden.
    // This ensures the FAQ content itself can scroll if it's too long for the space allocated to it by page.js
    <div className="p-[1vh] bg-white max-h-[50vh] overflow-y-auto"> 
      <h2 className="text-[1.8vh] sm:text-[4vh] font-bold mb-[1.5vh] text-center text-gray-700">
        WTF IS THIS GAME
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