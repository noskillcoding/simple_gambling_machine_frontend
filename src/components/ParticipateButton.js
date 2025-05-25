// src/components/ParticipateButton.js
"use client";

import { useState } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '@/config/contractDetails';

export default function ParticipateButton({ 
  requiredAmountToDepositEth, 
  onParticipationSuccess, 
  isWalletConnected,
  prominent = false 
}) {
  const [isLoading, setIsLoading] = useState(false);
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); // "success" or "error"

  const handleParticipate = async () => {
    console.log("Deposit button clicked. Required ETH:", requiredAmountToDepositEth);
    setIsLoading(true);
    setShowModal(false); // Close any existing modal

    if (!isWalletConnected || !window.ethereum) {
      setModalMessage("Connect Wallet First");
      setModalType("error");
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    if (requiredAmountToDepositEth === null || typeof requiredAmountToDepositEth === 'undefined' || requiredAmountToDepositEth <= 0) {
      setModalMessage("Deposit Amount Error or Not Loaded. Please refresh data.");
      setModalType("error");
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const simpleGamblingContract = new ethers.Contract(contractAddress, contractABI, signer);
      const amountToDepositString = requiredAmountToDepositEth.toString();
      const amountInWei = ethers.parseEther(amountToDepositString);

      // No intermediate message state needed as modal will show result
      const tx = await simpleGamblingContract.deposit({ value: amountInWei });
      console.log("Transaction sent, waiting for confirmation:", tx.hash);
      
      await tx.wait(); // Wait for transaction to be mined

      setModalMessage(`Success: ${amountToDepositString} ETH Deposited! Tx: ${tx.hash.substring(0,10)}...`);
      setModalType("success");
      setShowModal(true);
      console.log("Transaction successful:", tx);
      if (onParticipationSuccess) {
        onParticipationSuccess(); 
      }
    } catch (error) {
      console.error("Deposit Error:", error);
      let displayError = "Failed: ";
      if (error.code === 4001) {
        displayError += "Transaction Rejected";
      } else if (error.reason) {
         displayError += error.reason;
      } else {
         displayError += "Unknown Error";
      }
      setModalMessage(displayError);
      setModalType("error");
      setShowModal(true);
    } finally {
      setIsLoading(false); 
    }
  };

  // Determine button's text content
  let buttonTextContent;
  if (isLoading) {
    buttonTextContent = "Processing...";
  } else if (!isWalletConnected) {
    buttonTextContent = "Connect Wallet";
  } else if (!(requiredAmountToDepositEth > 0)) {
    buttonTextContent = "Amount N/A";
  } else {
    const participationAmountDisplay = (requiredAmountToDepositEth !== null && requiredAmountToDepositEth > 0)
      ? requiredAmountToDepositEth.toFixed(prominent ? 5 : 6)
      : "N/A";
    buttonTextContent = `Deposit (${participationAmountDisplay} ETH)`;
  }

  const padding = prominent ? "px-[2vw] py-[1vh]" : "px-[1.5vw] py-[0.75vh]";
  const textSize = prominent ? "text-[1.7vh] sm:text-[2vh]" : "text-[1.4vh] sm:text-[1.6vh]";
  const marginY = prominent ? "my-[0.75vh]" : "my-[0.5vh]";
  
  return (
    <>
      <div className={`text-center flex-shrink-0 ${marginY}`}>
        <button
          onClick={handleParticipate}
          disabled={isLoading} 
          className={`w-full ${padding} bg-green-500 dark:bg-green-600 text-white dark:text-gray-100 ${textSize} font-semibold rounded-md hover:bg-green-600 dark:hover:bg-green-700 shadow-sm disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed truncate transition-colors duration-300 ease-in-out`}
        >
          {buttonTextContent}
        </button>
      </div>

      {/* Simple Modal Implementation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-[2vw]">
          <div className={`p-[2vh] md:p-[3vh] bg-white dark:bg-slate-800 rounded-lg shadow-xl text-center max-w-[90vw] md:max-w-[50vw] text-[1.5vh] md:text-[1.8vh]`}>
            <h3 className={`text-[2vh] md:text-[2.5vh] font-bold mb-[1.5vh] ${modalType === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {modalType === 'success' ? 'Transaction Successful' : 'Transaction Failed'}
            </h3>
            <p className="mb-[2vh] text-gray-700 dark:text-slate-300 break-words">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className={`px-[2vw] py-[1vh] text-[1.5vh] md:text-[1.7vh] rounded-md text-white dark:text-gray-100 ${modalType === 'success' ? 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700' : 'bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700'}`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}