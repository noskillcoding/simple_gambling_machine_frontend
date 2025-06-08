// src/components/FAQ.js
export default function FAQ() {
  const faqItems = [
    {
      question: "What is it about?",
      answer: "A decentralized game: deposit a small % of the pot, and if no one deposits after you — you win big. And 5 randoms win little.",
    },
    {
      question: "How to gamble?",
      answer: "Connect your wallet, hit Deposit, and send the required ETH (auto-calculated for you).",
    },
    {
      question: "How can I win?",
      answer: "Be the last depositor before the countdown hits zero. You get 80% of the pot. 5 others (randomly selected) win 2% each. 10% is reserved for the next round."
    },
    {
      question: "When will the game end?",
      answer: "When no new deposit is made before the timer expires, anyone can hit Claim to end the game. The timer shortens as more deposits are made. Check the structure below."
    },
    {
      question: "Is it safe?",
      answer: "Yes, it is fully on-chain and immutable (no admin keys, multisig control, etc.). 1. Deployed at 0x01567Fd0e93004B1af30a86DD590A591c8aA72FC on Ethereum mainnet. 2. Verified source code on Etherscan: https://etherscan.io/address/0x01567fd0e93004b1af30a86dd590a591c8aa72fc#code. 3. Frontend is open-source: https://github.com/noskillcoding/simple_gambling_machine_frontend. 4. Hosted on IPFS at: http://simplegamblingmachine.eth.link. 5. Always check the contract address in your wallet before confirming any transaction."
    },
    {
      question: "Casino wins as always, right?",
      answer: "No. Only depositors win. No fees."
    },
    {
      question: "Is the smart contract audited?",
      answer: "No. Use at your own risk. The code is pretty simple though, you can find it on https://github.com/noskillcoding/simple_gambling_machine and https://etherscan.io/address/0x01567fd0e93004b1af30a86dd590a591c8aa72fc#code"
    },
    {
      question: "No vulnerabilities, right?",
      answer: "Not quite. On-chain randomness isn’t truly random. In some cases, a malicious winner can re-roll the dice until the five “random” winners are his favourable accounts. But you have to win the game first anyway, and it’s tricky and everyone will know you’re a hacker."
    },
    {
      question: "Why is the frontend so shitty?",
      answer: "Don’t know much about coding, check the story here https://paragraph.com/@0xucs.eth/vibe-coding-simple-gambling-machine. Contributions welcome — https://github.com/noskillcoding/simple_gambling_machine_frontend."
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