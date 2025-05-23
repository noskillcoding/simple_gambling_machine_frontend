// src/components/WalletInfo.js
"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function WalletInfo() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  // --- Functions (connectWalletHandler, accountChangedHandler, disconnectWalletHandler) ---
  // These remain the same as the last working version. For brevity, I'm not repeating them here.
  // Please ensure you have the full working logic for these functions from our previous steps.
  // For example:
  const connectWalletHandler = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      setErrorMessage(null);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          accountChangedHandler(accounts[0]);
        } else {
          setErrorMessage("No accounts found.");
        }
      } catch (error) {
        if (error.code === 4001) {
          setErrorMessage("Connection rejected.");
        } else {
          setErrorMessage("Connection error.");
        }
        console.error(error);
      }
    } else {
      setErrorMessage("Install MetaMask.");
    }
  };

  const accountChangedHandler = async (newAccount) => {
    setAccount(newAccount);
    if (newAccount) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balanceWei = await provider.getBalance(newAccount); // Get balance for the newAccount
        setBalance(ethers.formatEther(balanceWei));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
        setErrorMessage("Balance error.");
      }
    }
  };

  const disconnectWalletHandler = () => {
    setAccount(null);
    setBalance(null);
    setErrorMessage(null);
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          accountChangedHandler(accounts[0]);
        } else {
          disconnectWalletHandler();
          setErrorMessage("MetaMask disconnected.");
        }
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      // Initial check if already connected (optional, good for UX)
      const checkInitialConnection = async () => {
        try {
            if(window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    accountChangedHandler(accounts[0]);
                }
            }
        } catch (e) { console.log("Error checking initial connection", e)}
      };
      checkInitialConnection();
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []); // Re-added empty dependency array for mount/unmount logic


  // --- Compact JSX ---
  if (account) {
    return (
      <div className="p-[0.5vh] md:p-[0.8vh] border border-gray-300 rounded-md bg-white/80 backdrop-blur-sm shadow-md text-[1.2vh] md:text-[1.4vh] whitespace-nowrap max-w-[180px] md:max-w-[220px]"> {/* Max width to prevent overflow */}
        <p 
          className="mb-[0.2vh] font-medium truncate" 
          title={account} // Show full address on hover
        >
          {`${account.substring(0, 5)}...${account.substring(account.length - 4)}`}
        </p>
        <p className="mb-[0.5vh] text-gray-700">
          {balance ? `${parseFloat(balance).toFixed(3)} ETH` : "Loading..."}
        </p>
        <button
          onClick={disconnectWalletHandler}
          className="w-full px-[1vw] py-[0.4vh] text-[1.1vh] md:text-[1.3vh] bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-colors text-center"
        >
          Disconnect
        </button>
        {errorMessage && !errorMessage.includes("MetaMask disconnected") && ( // Don't show disconnect message here
             <p className="mt-[0.5vh] text-[1vh] text-red-500 truncate" title={errorMessage}>{errorMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div className="text-[1.2vh] md:text-[1.4vh] whitespace-nowrap">
      <button
        onClick={connectWalletHandler}
        className="px-[1.5vh] py-[0.75vh] md:px-[1.2vh] md:py-[0.6vh] bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors shadow-sm"
      >
        Connect Wallet
      </button>
      {errorMessage && <p className="mt-[0.5vh] text-[1vh] text-red-500 absolute bg-white p-1 rounded shadow-md -ml-2" title={errorMessage}>{errorMessage}</p>}
    </div>
  );
}