// src/components/WalletInfo.js
"use client";

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const MAINNET_CHAIN_ID = 1n; // Mainnet chain ID

export default function WalletInfo({ onConnectionStateChange }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [isOnMainnet, setIsOnMainnet] = useState(false);

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
      if (network.chainId === MAINNET_CHAIN_ID) {
        networkInfo.isOnCorrectNetwork = true;
        setIsOnMainnet(true);
        setNetworkName(network.name);
        setErrorMessage(null);

        const balanceWei = await provider.getBalance(currentAccount);
        setBalance(ethers.formatEther(balanceWei));
      } else {
        setIsOnMainnet(false);
        setNetworkName(network.name);
        setErrorMessage(`Wrong Network! Switch to Mainnet. You are on ${network.name}.`);
        setBalance(null);
      }
    } catch (error) {
      console.error("Error in checkNetworkAndGetBalance:", error);
      setErrorMessage("Could not verify network or get balance.");
      setIsOnMainnet(false);
      setBalance(null);
    }
    return networkInfo;
  }, []);

  const accountChangedHandler = useCallback(async (newAccount) => {
    setAccount(newAccount);
    let currentConnectionState = { connected: !!newAccount, account: newAccount, onMainnet: false, networkName: null };

    if (newAccount && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const networkInfo = await checkNetworkAndGetBalance(provider, newAccount);
      currentConnectionState.onMainnet = networkInfo.isOnCorrectNetwork;
      currentConnectionState.networkName = networkInfo.networkName;
    } else {
      setBalance(null);
      setNetworkName(null);
      setIsOnMainnet(false);
      setErrorMessage(null);
      currentConnectionState = { connected: false, account: null, onMainnet: false, networkName: null };
    }
    informParent(currentConnectionState);
  }, [checkNetworkAndGetBalance, informParent]);

  const connectWalletHandler = async () => {
    // --- FIX: 1. Clear disconnect flag on explicit connect action ---
    localStorage.removeItem('isDisconnected');

    if (window.ethereum && window.ethereum.isMetaMask) {
      setErrorMessage(null);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          await accountChangedHandler(accounts[0]);
        } else {
          setErrorMessage("No accounts found.");
          informParent({ connected: false, account: null, onMainnet: false, networkName: null });
        }
      } catch (error) {
        if (error.code === 4001) {
          setErrorMessage("Connection rejected.");
        } else {
          setErrorMessage("Connection error.");
        }
        console.error(error);
        informParent({ connected: false, account: null, onMainnet: false, networkName: null });
      }
    } else {
      setErrorMessage("Install MetaMask.");
      informParent({ connected: false, account: null, onMainnet: false, networkName: null });
    }
  };

  const disconnectWalletHandler = useCallback(() => {
    setAccount(null);
    setBalance(null);
    setNetworkName(null);
    setIsOnMainnet(false);
    setErrorMessage(null);

    // --- FIX: 2. Set disconnect flag on explicit disconnect action ---
    localStorage.setItem('isDisconnected', 'true');

    console.log("Wallet disconnected by user action.");
    informParent({ connected: false, account: null, onMainnet: false, networkName: null });
  }, [informParent]);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      console.log("MetaMask accounts changed:", accounts);
      if (accounts.length > 0) {
        // If accounts change, it's a new connection action, so clear the flag
        localStorage.removeItem('isDisconnected');
        accountChangedHandler(accounts[0]);
      } else {
        // This is triggered when the user disconnects from MetaMask itself
        disconnectWalletHandler();
      }
    };

    const handleChainChanged = (_chainId) => {
      window.location.reload();
    };

    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      const attemptInitialState = async () => {
        // --- FIX: 3. Check for the disconnect flag before auto-connecting ---
        if (localStorage.getItem('isDisconnected') === 'true') {
          console.log("WalletInfo: User is explicitly disconnected.");
          informParent({ connected: false, account: null, onMainnet: false, networkName: null });
          return;
        }

        try {
          console.log("WalletInfo: Attempting initial state check.");
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            console.log("WalletInfo: Found initially connected account:", accounts[0]);
            await accountChangedHandler(accounts[0]);
          } else {
            console.log("WalletInfo: No accounts initially connected.");
            informParent({ connected: false, account: null, onMainnet: false, networkName: null });
          }
        } catch (e) {
          console.warn("WalletInfo: Initial account check failed:", e.message);
          informParent({ connected: false, account: null, onMainnet: false, networkName: null });
        }
      };
      attemptInitialState();
    } else {
        console.log("WalletInfo: No ethereum provider found on mount.");
        informParent({ connected: false, account: null, onMainnet: false, networkName: null });
    }

    return () => {
      if (window.ethereum && typeof window.ethereum.removeListener === 'function') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [accountChangedHandler, disconnectWalletHandler, informParent]);


  let statusContent;
  if (account) {
    statusContent = (
      <>
        <p className="mb-[0.2vh] font-medium truncate" title={account}>
          {`${account.substring(0, 5)}...${account.substring(account.length - 4)}`}
        </p>
        {isOnMainnet ? (
          <p className="mb-[0.5vh] text-gray-700">
            {balance ? `${parseFloat(balance).toFixed(3)} ETH` : "Loading..."} <span className="text-xs">({networkName || 'Mainnet'})</span>
          </p>
        ) : (
          <p className="mb-[0.5vh] text-red-600 font-semibold">
             On {networkName || 'Unknown Network'}
          </p>
        )}
        <button
          onClick={disconnectWalletHandler}
          className="w-full px-[1vw] py-[0.4vh] text-[1.1vh] md:text-[1.3vh] bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-colors text-center"
        >
          Disconnect
        </button>
      </>
    );
  } else {
    statusContent = (
      <button
        onClick={connectWalletHandler}
        className="px-[1.5vh] py-[0.75vh] md:px-[1.2vh] md:py-[0.6vh] bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors shadow-sm"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="p-[0.5vh] md:p-[0.8vh] border border-gray-300 rounded-md bg-white/80 backdrop-blur-sm shadow-md text-[1.2vh] md:text-[1.4vh] whitespace-nowrap min-w-[150px] md:min-w-[180px] max-w-[180px] md:max-w-[220px]">
      {statusContent}
      {!isOnMainnet && account && (
        <p className="mt-[0.5vh] text-[1.1vh] font-semibold text-red-700 bg-red-100 p-[0.5vh] rounded">
            Switch to Mainnet!
        </p>
      )}
      {errorMessage && (
         <p className={`mt-[0.5vh] text-[1vh] ${!isOnMainnet && account ? "hidden" : "text-red-600"} truncate`} title={errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
}