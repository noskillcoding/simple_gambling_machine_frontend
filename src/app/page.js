// src/app/page.js
"use client";

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '@/config/contractDetails';

import WalletInfo from "@/components/WalletInfo";
import ParticipateButton from "@/components/ParticipateButton";
// GitHubLink is no longer imported if we are using a DataDisplayCard for it
import DataDisplayCard from "@/components/DataDisplayCard";
import FAQ from "@/components/FAQ"; // Ensure this is the updated FAQ.js
import ClaimButton from "@/components/ClaimButton";

// Updated MainVisualDisplay (no title, no outer frame)
function MainVisualDisplay({ imageName, altText = "Main visual content" }) {
  const imagePath = `/${imageName}`;
  return (
    <div className="w-full h-full flex flex-col overflow-hidden"> {/* Takes full space from parent */}
      {/* Title h3 REMOVED */}
      <div className="relative flex-1 w-full min-h-0">
        <img
          src={imagePath}
          alt={altText}
          className="absolute top-0 left-0 w-full h-full object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
            const parent = e.target.parentElement;
            if (parent) {
              const errorMsg = parent.querySelector('.img-error-msg');
              if (errorMsg) errorMsg.style.display = 'flex';
            }
          }}
        />
        <div 
          className="img-error-msg absolute inset-0 hidden items-center justify-center text-gray-500 text-[1.1vh] sm:text-[1.3vh] p-[0.5vh]"
        >
          Image not found: {imagePath}
        </div>
      </div>
    </div>
  );
}

// Updated SchemeImagePlaceholder (no outer frame)
function SchemeImagePlaceholder() {
  return (
    <div className="bg-white rounded-md text-center flex flex-col flex-shrink-0 h-full w-full overflow-hidden p-[0.5vh]"> {/* Fill height of its container */}
      <h3 className="text-[1.3vh] sm:text-[1.5vh] font-semibold pt-[0.5vh] mb-[0.5vh] text-gray-700 shrink-0 truncate">
        SCHEME/MATH
      </h3>
      <div className="flex-1 bg-gray-200 flex items-center justify-center rounded-b-md min-h-0 mx-[0.5vh] mb-[0.5vh]"> 
        <p className="text-gray-500 text-[1.1vh] sm:text-[1.3vh] p-[0.5vh]">Visual placeholder</p>
      </div>
    </div>
  );
}


export default function HomePage() {
  const yourGitHubRepoUrl = "https://github.com/yourusername/your-repo-name"; // CHANGE THIS
  const yourDAppName = "Your dApp Name"; // CHANGE THIS for title attribute

  // --- State Variables, fetchContractUIData, useEffects, Helper Functions (remain the same) ---
  const [contractEthBalance, setContractEthBalance] = useState(null);
  const [depositCount, setDepositCount] = useState(null);
  const [requiredDepositEth, setRequiredDepositEth] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataErrorMessage, setDataErrorMessage] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [lastDepositorAddress, setLastDepositorAddress] = useState(null);
  const [lastDepositTimestamp, setLastDepositTimestamp] = useState(null);
  const [currentTimeoutPeriodSeconds, setCurrentTimeoutPeriodSeconds] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const fetchContractUIData = useCallback(async () => {
    setIsLoadingData(true); setDataErrorMessage("");
    if (!window.ethereum) { setDataErrorMessage("MetaMask not detected."); setIsLoadingData(false); setIsWalletConnected(false); return; }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length === 0) { setIsWalletConnected(false); setDataErrorMessage("Please connect wallet."); setIsLoadingData(false); return; }
      setIsWalletConnected(true);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const balanceWei = await provider.getBalance(contractAddress); setContractEthBalance(parseFloat(ethers.formatEther(balanceWei)));
      const countBigInt = await contract.depositCount(); const count = Number(countBigInt); setDepositCount(count);
      const requiredDepositWei = await contract.nextRequiredDeposit(); setRequiredDepositEth(parseFloat(ethers.formatEther(requiredDepositWei)));
      const fetchedLastDepositor = await contract.lastDepositor(); setLastDepositorAddress(fetchedLastDepositor === ethers.ZeroAddress ? null : fetchedLastDepositor);
      const fetchedLastDepositTime = await contract.lastDepositTime(); setLastDepositTimestamp(Number(fetchedLastDepositTime));
      const fetchedDepositLimits = []; for (let i = 0; i < 4; i++) fetchedDepositLimits.push(Number(await contract.depositLimits(i)));
      const fetchedTimeoutSecs = []; for (let i = 0; i < 4; i++) fetchedTimeoutSecs.push(Number(await contract.timeoutSecs(i)));
      let calculatedTimeoutPeriod = 0;
      if (fetchedDepositLimits.length === 4 && fetchedTimeoutSecs.length === 4 && count !== null) {
        if (count < fetchedDepositLimits[0]) calculatedTimeoutPeriod = fetchedTimeoutSecs[0];
        else if (count < (fetchedDepositLimits[0] + 300)) calculatedTimeoutPeriod = fetchedTimeoutSecs[1];
        else if (count < (fetchedDepositLimits[0] + 300 + 1000)) calculatedTimeoutPeriod = fetchedTimeoutSecs[2];
        else calculatedTimeoutPeriod = fetchedTimeoutSecs[3];
      }
      setCurrentTimeoutPeriodSeconds(calculatedTimeoutPeriod);
    } catch (error) { console.error("Fetch Error:", error); setDataErrorMessage("Could not fetch data."); setRequiredDepositEth(0); } 
    finally { setIsLoadingData(false); }
  }, []);

  useEffect(() => { fetchContractUIData(); }, [fetchContractUIData]);
  useEffect(() => {
    if (lastDepositTimestamp === null || currentTimeoutPeriodSeconds === null || currentTimeoutPeriodSeconds === 0 || !isWalletConnected) { setTimeLeft(null); return; }
    const calculateAndSetTimeLeft = () => { const now = Math.floor(Date.now() / 1000); const end = lastDepositTimestamp + currentTimeoutPeriodSeconds; setTimeLeft(Math.max(0, end - now)); };
    calculateAndSetTimeLeft(); const id = setInterval(calculateAndSetTimeLeft, 1000);
    return () => clearInterval(id);
  }, [lastDepositTimestamp, currentTimeoutPeriodSeconds, isWalletConnected]);

  const formatTimeLeft = (s) => { if (s === null || !isWalletConnected) return isLoadingData?"Loading...":(isWalletConnected?"Calculating...":"Connect Wallet"); if (s <= 0 && lastDepositorAddress) return "Ready!"; if (s <= 0) return "N/A"; const m = Math.floor(s/60); const secs = s%60; return `${m}m ${secs<10?'0':''}${secs}s`; };
  const isClaimable = timeLeft !== null && timeLeft <= 0 && lastDepositorAddress !== null && lastDepositorAddress !== ethers.ZeroAddress && isWalletConnected;
  
  const pageStyle = { fontSize: 'clamp(9px, 1.4vh, 15px)' };

  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden" style={pageStyle} title={yourDAppName}>
      
      <header className="relative p-[1vh] text-center border-b border-gray-200 shadow-sm shrink-0 h-[10vh] flex items-center justify-center bg-white">
        <h1 className="text-[6.5vh] sm:text-[7vh] font-extrabold text-gray-800 leading-tight truncate w-full px-[20vw] sm:px-[18vw] md:px-[15vw]">
          Simple Gambling Machine
        </h1>
        <div className="absolute top-1/2 -translate-y-1/2 right-[1vh] md:right-[1.5vh] z-10">
          <WalletInfo /> 
        </div>
      </header>

      {dataErrorMessage && (
        <p className="text-center text-red-500 py-[0.5vh] px-[1vw] shrink-0 text-[1.3vh] sm:text-[1.4vh] truncate bg-white">
          {dataErrorMessage}
        </p>
      )}

      <div className="flex-1 flex flex-col md:flex-row md:space-x-[0.5vw] overflow-hidden p-[0.5vh] min-h-0 bg-white">
        
        <div className="md:w-3/5 h-full flex flex-col space-y-[0.5vh] overflow-hidden p-[0.5vh]"> {/* Main Left */}
          {/* This div now directly controls the image area's height and appearance */}
          <div className="shrink-0 h-[45vh] rounded-md overflow-hidden bg-white"> {/* Removed border/shadow from here, image component is frameless */}
            <MainVisualDisplay imageName="SGM0.png" altText="Image is not here" />
          </div>

          <div className="flex-1 flex flex-col sm:flex-row sm:space-x-[0.5vw] overflow-hidden min-h-0">
            <div className="sm:w-1/2 h-full flex flex-col space-y-[0.5vh] p-[0.5vh] overflow-hidden"> {/* left1 */}
              <DataDisplayCard label="ETH in the Machine" value={isLoadingData?"Loading...":(contractEthBalance?.toFixed(5))} unit="ETH" prominent={true} />
              <ParticipateButton requiredAmountToDepositEth={requiredDepositEth ?? 0} onParticipationSuccess={fetchContractUIData} isWalletConnected={isWalletConnected} prominent={true} />
              <DataDisplayCard label="Required Deposit" value={isLoadingData?"Loading...":(requiredDepositEth?.toFixed(8))} unit="ETH" />
              <DataDisplayCard 
                label="Last Depositor"
                value={
                  isLoadingData ? "Loading..." : 
                  lastDepositorAddress ? (
                    <a 
                      href={`https://sepolia.etherscan.io/address/${lastDepositorAddress}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-700 hover:underline break-all"
                      title={`View on Etherscan: ${lastDepositorAddress}`}
                    >
                      {lastDepositorAddress}
                    </a>
                  ) : "N/A"
                }
              />
            </div>

            <div className="sm:w-1/2 h-full flex flex-col space-y-[0.5vh] p-[0.5vh] overflow-hidden"> {/* right1 */}
              <DataDisplayCard label="Time Left" value={formatTimeLeft(timeLeft)} prominent={true} />
              <ClaimButton isClaimable={isClaimable} isWalletConnected={isWalletConnected} onClaimSuccess={fetchContractUIData} prominent={true} />
              <DataDisplayCard label="Total Deposits" value={isLoadingData?"Loading...":(depositCount !== null ? depositCount : "N/A")} />
              <DataDisplayCard
                label="Source Code"
                value={
                  yourGitHubRepoUrl ? (
                    <a
                      href={yourGitHubRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 hover:underline break-all"
                      title="View source code on GitHub"
                    >
                      {yourGitHubRepoUrl}
                    </a>
                  ) : "N/A"
                }
              />
            </div>
          </div>
        </div>

        <div className="md:w-2/5 h-full flex flex-col space-y-[0.5vh] overflow-hidden p-[0.5vh]"> {/* Main Right */}
          {/* Wrapper for FAQ, no border/shadow, bg-white to match page */}
          <div className="flex-1 overflow-hidden min-h-0 p-[0.5vh] rounded-md bg-white flex flex-col"> 
            <FAQ /> {/* Assumes FAQ.js has been updated to remove its own border/shadow */}
          </div>
          {/* Container for SchemeImagePlaceholder - no border/shadow from here */}
          <div className="shrink-0 h-[18vh] sm:h-[20vh] rounded-md overflow-hidden bg-white"> 
             <SchemeImagePlaceholder /> {/* SchemeImagePlaceholder itself has a white bg, optional inner gray bg */}
          </div>
        </div>
      </div>
      
      <div className="text-center py-[0.5vh] md:py-[1vh] border-t border-gray-200 shrink-0 h-[7vh] flex items-center justify-center bg-white">
          <button
              onClick={fetchContractUIData}
              disabled={isLoadingData || !isWalletConnected}
              className="px-[1.5vw] py-[0.75vh] text-[1.3vh] sm:text-[1.5vh] bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300"
          >
              {isLoadingData ? "Refreshing..." : "Refresh Data"}
          </button>
      </div>
    </div>
  );
}