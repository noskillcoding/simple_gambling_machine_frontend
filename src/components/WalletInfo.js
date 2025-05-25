// src/components/WalletInfo.js
"use client";

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const SEPOLIA_CHAIN_ID = 11155111n;

export default function WalletInfo({ onConnectionStateChange }) { 
  const [errorMessage, setErrorMessage] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [isOnSepolia, setIsOnSepolia] = useState(false); // Default to false until verified

  // Memoized callback to inform parent
  const informParent = useCallback((state) => {
    if (onConnectionStateChange) {
      onConnectionStateChange(state);
    }
  }, [onConnectionStateChange]);

  const checkNetworkAndGetBalance = useCallback(async (provider, currentAccount) => {
    let networkInfo = { isOnCorrectNetwork: false, networkName: "Unknown" };
    try {
      const network = await provider.getNetwork();
      networkInfo.networkName = network.name;
      if (network.chainId === SEPOLIA_CHAIN_ID) {
        networkInfo.isOnCorrectNetwork = true;
        setIsOnSepolia(true);
        setNetworkName(network.name);
        setErrorMessage(prev => (prev && (prev.toLowerCase().includes("network") || prev.toLowerCase().includes("connect wallet")) ? null : prev));
        
        const balanceWei = await provider.getBalance(currentAccount);
        setBalance(ethers.formatEther(balanceWei));
      } else {
        setIsOnSepolia(false);
        setNetworkName(network.name);
        setErrorMessage(`Wrong Network! Switch to Sepolia. You are on ${network.name}.`);
        setBalance(null);
      }
    } catch (error) {
      console.error("Error in checkNetworkAndGetBalance:", error);
      setErrorMessage("Could not verify network or get balance.");
      setIsOnSepolia(false);
      setBalance(null);
    }
    return networkInfo;
  }, []); // Removed errorMessage as dep, handle clearing it inside

  const accountChangedHandler = useCallback(async (newAccount) => {
    const wasConnected = !!account; // Check previous connection state
    setAccount(newAccount); 
    let currentConnectionState = { connected: !!newAccount, account: newAccount, onSepolia: false, networkName: null };

    if (newAccount && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const networkInfo = await checkNetworkAndGetBalance(provider, newAccount);
      currentConnectionState.onSepolia = networkInfo.isOnCorrectNetwork;
      currentConnectionState.networkName = networkInfo.networkName;
    } else { 
      setBalance(null);
      setNetworkName(null);
      setIsOnSepolia(false); // If no account, not on Sepolia for dApp purposes
      if (wasConnected && !newAccount) { // If it was a disconnect event
         // Error message for disconnection might be set by accountsChanged listener
      }
      currentConnectionState = { connected: false, account: null, onSepolia: false, networkName: null };
    }
    informParent(currentConnectionState);
  }, [account, checkNetworkAndGetBalance, informParent]);

  const connectWalletHandler = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      setErrorMessage(null);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          await accountChangedHandler(accounts[0]); 
        } else {
          setErrorMessage("No accounts found.");
          informParent({ connected: false, account: null, onSepolia: false, networkName: null });
        }
      } catch (error) { 
        if (error.code === 4001) { setErrorMessage("Connection rejected."); } 
        else { setErrorMessage("Connection error.");}
        console.error(error);
        informParent({ connected: false, account: null, onSepolia: false, networkName: null });
      }
    } else { 
        setErrorMessage("Install MetaMask.");
        informParent({ connected: false, account: null, onSepolia: false, networkName: null });
    }
  };

  const disconnectWalletHandler = () => {
    setAccount(null); setBalance(null); setNetworkName(null); setIsOnSepolia(false); 
    setErrorMessage(null); 
    console.log("Wallet disconnected by user action.");
    informParent({ connected: false, account: null, onSepolia: false, networkName: null });
  };

  useEffect(() => {
    const attemptInitialState = async () => {
        if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
            const handleAccountsChanged = (accounts) => {
                console.log("MetaMask accounts changed:", accounts);
                if (accounts.length > 0) {
                    accountChangedHandler(accounts[0]);
                } else {
                    setErrorMessage("Wallet disconnected via MetaMask."); 
                    disconnectWalletHandler(); 
                }
            };
            const handleChainChanged = (_chainId) => { window.location.reload(); };

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            try {
                console.log("WalletInfo: Attempting initial state check.");
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    console.log("WalletInfo: Found initially connected account:", accounts[0]);
                    await accountChangedHandler(accounts[0]);
                } else {
                    console.log("WalletInfo: No accounts initially connected.");
                    informParent({ connected: false, account: null, onSepolia: false, networkName: null });
                }
            } catch (e) { 
                console.warn("WalletInfo: Initial account check failed:", e.message);
                informParent({ connected: false, account: null, onSepolia: false, networkName: null });
            }
            // Cleanup function for listeners
            return () => {
                if (window.ethereum && typeof window.ethereum.removeListener === 'function') {
                    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                    window.ethereum.removeListener('chainChanged', handleChainChanged);
                }
            };
        } else {
            console.log("WalletInfo: No ethereum provider found on mount.");
            informParent({ connected: false, account: null, onSepolia: false, networkName: null });
            // No listeners to clean up if ethereum is not defined
            return () => {}; 
        }
    };

    attemptInitialState();
    
  }, [accountChangedHandler, informParent]); // informParent is stable, accountChangedHandler needs to be stable or include its deps

  // --- JSX for WalletInfo (same as before) ---
  let statusContent;
  if (account) {
    statusContent = ( 
      <>
        <p className="mb-[0.2vh] font-medium truncate dark:text-slate-200" title={account}>
          {`${account.substring(0, 5)}...${account.substring(account.length - 4)}`}
        </p>
        {isOnSepolia ? (
          <p className="mb-[0.5vh] text-gray-700 dark:text-slate-300">
            {balance ? `${parseFloat(balance).toFixed(3)} ETH` : "Loading..."} <span className="text-xs">({networkName || 'Sepolia'})</span>
          </p>
        ) : (
          <p className="mb-[0.5vh] text-red-600 dark:text-red-400 font-semibold">
             On {networkName || 'Unknown Network'}
          </p>
        )}
        <button
          onClick={disconnectWalletHandler}
          className="w-full px-[1vw] py-[0.4vh] text-[1.1vh] md:text-[1.3vh] bg-red-500 dark:bg-red-600 text-white dark:text-gray-100 rounded hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500 focus:ring-opacity-50 transition-colors text-center"
        >
          Disconnect
        </button>
      </>
    );
  } else { 
    statusContent = (
      <button
        onClick={connectWalletHandler}
        className="px-[1.5vh] py-[0.75vh] md:px-[1.2vh] md:py-[0.6vh] bg-blue-500 dark:bg-blue-600 text-white dark:text-gray-100 rounded hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-opacity-50 transition-colors shadow-sm"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="p-[0.5vh] md:p-[0.8vh] border border-gray-300 dark:border-gray-700 rounded-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md text-[1.2vh] md:text-[1.4vh] whitespace-nowrap min-w-[150px] md:min-w-[180px] max-w-[180px] md:max-w-[220px]">
      {statusContent}
      {!isOnSepolia && account && (
        <p className="mt-[0.5vh] text-[1.1vh] font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-[0.5vh] rounded">
            Switch to Sepolia!
        </p>
      )}
      {errorMessage && ( // General error messages, not related to wrong network if already handled by isOnSepolia
         <p className={`mt-[0.5vh] text-[1vh] ${errorMessage.toLowerCase().includes("network") && !isOnSepolia ? "hidden" : "text-red-600 dark:text-red-400"} truncate`} title={errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
}