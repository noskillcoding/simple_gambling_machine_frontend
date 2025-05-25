// src/components/ClaimButton.js
"use client";

import { useState } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '@/config/contractDetails';

export default function ClaimButton({ 
  isClaimable, 
  isWalletConnected, 
  onClaimSuccess,
  prominent = false
}) {
  const [isLoading, setIsLoading] = useState(false);
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); // "success" or "error"

  const handleClaim = async () => {
    console.log("Claim button clicked");
    setIsLoading(true);
    setShowModal(false); // Close any existing modal

    if (!isWalletConnected || !window.ethereum) {
      setModalMessage("Connect Wallet First");
      setModalType("error");
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    if (!isClaimable) { // Should be caught by disabled state, but good to double check
        setModalMessage("Claim conditions not met (e.g., time not up or no last depositor).");
        setModalType("error");
        setShowModal(true);
        setIsLoading(false);
        return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const simpleGamblingContract = new ethers.Contract(contractAddress, contractABI, signer);
      
      console.log("Attempting to call claimTimeout()...");
      // No intermediate message here, modal will show outcome
      const tx = await simpleGamblingContract.claimTimeout();
      console.log("Claim transaction sent, waiting for confirmation:", tx.hash);
      
      await tx.wait(); 

      setModalMessage(`Prize claimed successfully! Game has reset. Tx: ${tx.hash.substring(0,10)}...`);
      setModalType("success");
      setShowModal(true);
      console.log("Claim transaction successful:", tx);

      if (onClaimSuccess) {
        onClaimSuccess(); 
      }

    } catch (error) {
      console.error("Claim Error:", error);
      let displayError = "Failed: ";
      if (error.code === 4001) { 
        displayError += "Transaction Rejected";
      } else if (error.reason) { 
         displayError += error.reason; // This will include "Still within timeout"
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
  } else if (!isClaimable) {
    buttonTextContent = "Claim (Available When Timer Resets)";
  } else {
    buttonTextContent = "Claim Prize";
  }
  
  // The button is disabled if loading, or if not connected, or if not claimable.
  // The modal appearing doesn't inherently disable the main button after loading is false.
  const buttonDisabled = isLoading || !isWalletConnected || !isClaimable;

  // Define styles based on 'prominent' prop
  const padding = prominent ? "px-[2vw] py-[1vh]" : "px-[1.5vw] py-[0.75vh]";
  const textSize = prominent ? "text-[1.7vh] sm:text-[2vh]" : "text-[1.4vh] sm:text-[1.6vh]";
  const marginY = prominent ? "my-[0.75vh]" : "my-[0.5vh]";
  
  return (
    <>
      <div className={`text-center flex-shrink-0 ${marginY}`}>
        <button
          onClick={handleClaim}
          disabled={buttonDisabled}
          className={`w-full ${padding} bg-orange-500 dark:bg-orange-600 text-white dark:text-gray-100 ${textSize} font-semibold rounded-md hover:bg-orange-600 dark:hover:bg-orange-700 shadow-sm disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed truncate transition-colors duration-300 ease-in-out`}
        >
          {buttonTextContent}
        </button>
      </div>

      {/* Simple Modal Implementation (same structure as in ParticipateButton) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-[2vw]"> {/* Slightly darker backdrop */}
          <div className={`p-[2vh] md:p-[3vh] bg-white dark:bg-slate-800 rounded-lg shadow-xl text-center max-w-[90vw] md:max-w-[50vw] text-[1.5vh] md:text-[1.8vh]`}>
            <h3 className={`text-[2vh] md:text-[2.5vh] font-bold mb-[1.5vh] ${modalType === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {modalType === 'success' ? 'Claim Successful' : (modalType === 'error' ? 'Claim Failed' : 'Notice')}
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