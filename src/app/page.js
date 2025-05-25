// src/app/page.js
"use client";

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '@/config/contractDetails';

import WalletInfo from "@/components/WalletInfo";
import ParticipateButton from "@/components/ParticipateButton";
import DataDisplayCard from "@/components/DataDisplayCard";
import FAQ from "@/components/FAQ";
import ClaimButton from "@/components/ClaimButton";

// --- YOUR SEPOLIA RPC URL ---
const SEPOLIA_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/QWdawN-TQ8-4f4OQGMIRp"; // Your actual URL

// --- Image Components ---
function MainVisualDisplay({ imageName, altText = "Main visual content" }) {
  const imagePath = imageName; 
  return ( 
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="relative flex-1 w-full min-h-0">
        <img src={imagePath} alt={altText} className="absolute top-0 left-0 w-full h-full object-contain"
             onError={(e) => { e.target.style.display = 'none'; const p = e.target.parentElement?.querySelector('.img-error-msg'); if(p) p.style.display='flex';}}/>
        <div className="img-error-msg absolute inset-0 hidden items-center justify-center text-gray-500 text-[1.1vh] sm:text-[1.3vh] p-[0.5vh]">Image not found: {imagePath}</div>
      </div>
    </div>
  );
}

// MODIFIED: SchemeImagePlaceholder becomes SchemeImageDisplay
function SchemeImageDisplay({ imageName = "SGM_Table.png", title = "Deposits Structure", altText = "Table explaining deposit structure" }) {
  const imagePath = imageName; // Use relative path, assuming image is in /public
  return (
    <div className="bg-white rounded-md text-center flex flex-col flex-shrink-0 h-full w-full overflow-hidden p-[0.5vh]">
      {title && ( // Conditionally render title
        <h3 className="text-[1.3vh] sm:text-[3.5vh] font-semibold pt-[0.5vh] mb-[0.5vh] text-gray-700 shrink-0 truncate">
          {title}
        </h3>
      )}
      <div className="relative flex-1 w-full min-h-0 rounded-b-md overflow-hidden"> {/* Image container */}
        <img
          src={imagePath}
          alt={altText}
          className="absolute top-0 left-0 w-full h-full object-contain" // Fills container, maintains aspect ratio
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
          className="img-error-msg absolute inset-0 hidden items-center justify-center text-gray-500 text-[1.1vh] sm:text-[1.3vh] p-[0.5vh] bg-gray-100"
        >
          Image not found: {imagePath}
        </div>
      </div>
    </div>
  );
}


export default function HomePage() {
  const yourGitHubRepoUrl = "https://github.com/noskillcoding/simple_gambling_machine"; 
  const yourDAppName = "Simple Gambling Machine"; 

  // --- State Variables, fetchContractUIData, useEffects, Helper Functions (These remain unchanged from your version) ---
  const [contractEthBalance, setContractEthBalance] = useState(null);
  const [depositCount, setDepositCount] = useState(null);
  const [requiredDepositEth, setRequiredDepositEth] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataErrorMessage, setDataErrorMessage] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false); 
  const [lastDepositorAddress, setLastDepositorAddress] = useState(null);
  const [lastDepositTimestamp, setLastDepositTimestamp] = useState(null);
  const [currentTimeoutPeriodSeconds, setCurrentTimeoutPeriodSeconds] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const fetchContractUIData = useCallback(async () => {
    console.log("Attempting to fetch contract UI data...");
    setIsLoadingData(true); setDataErrorMessage(""); 
    let provider;
    if (isWalletConnected && isCorrectNetwork && window.ethereum) {
      console.log("Using MetaMask (BrowserProvider) for fetching data.");
      provider = new ethers.BrowserProvider(window.ethereum);
    } else if (SEPOLIA_RPC_URL && SEPOLIA_RPC_URL !== "YOUR_ALCHEMY_SEPOLIA_HTTPS_RPC_URL_HERE") {
      console.log("Using public Sepolia RPC for fetching data.");
      provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    } else {
      console.error("No provider available. Wallet not connected or RPC URL not set.");
      setDataErrorMessage("Cannot fetch data. Connect wallet or ensure RPC is configured.");
      setIsLoadingData(false);
      setContractEthBalance(null); setDepositCount(null); setRequiredDepositEth(null);
      setLastDepositorAddress(null); setLastDepositTimestamp(null); setCurrentTimeoutPeriodSeconds(null); setTimeLeft(null);
      return;
    }
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const [
        balanceWei, countBigInt, requiredDepositWei, 
        fetchedLastDepositor, fetchedLastDepositTime
      ] = await Promise.all([
        provider.getBalance(contractAddress), contract.depositCount(),
        contract.nextRequiredDeposit(), contract.lastDepositor(),
        contract.lastDepositTime()
      ]);
      setContractEthBalance(parseFloat(ethers.formatEther(balanceWei)));
      const count = Number(countBigInt);
      setDepositCount(count);
      setRequiredDepositEth(parseFloat(ethers.formatEther(requiredDepositWei)));
      setLastDepositorAddress(fetchedLastDepositor === ethers.ZeroAddress ? null : fetchedLastDepositor);
      setLastDepositTimestamp(Number(fetchedLastDepositTime));
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
      console.log("Data fetch complete.");
    } catch (error) { 
      console.error("Fetch Error in page.js:", error); 
      setDataErrorMessage("Could not fetch contract data. Refresh or check console."); 
      setContractEthBalance(null); setDepositCount(null); setRequiredDepositEth(0);
    } 
    finally { setIsLoadingData(false); }
  }, [isWalletConnected, isCorrectNetwork]);

  const handleWalletStateChange = useCallback((walletState) => {
    console.log("HomePage received wallet state change:", walletState);
    const previouslyConnected = isWalletConnected; // Not strictly needed anymore here
    setIsWalletConnected(walletState.connected);
    setIsCorrectNetwork(walletState.onSepolia);
    if (walletState.connected && walletState.onSepolia) {
      setDataErrorMessage(""); 
      fetchContractUIData(); 
    } else {
      setContractEthBalance(null); setDepositCount(null); setRequiredDepositEth(null);
      setLastDepositorAddress(null); setLastDepositTimestamp(null); 
      setCurrentTimeoutPeriodSeconds(null); setTimeLeft(null);
      setIsLoadingData(false); 
      if (!walletState.connected && !(walletState.initialCheckFailed /* This prop isn't passed from current WalletInfo */)) { 
        setDataErrorMessage("Please connect your wallet to interact.");
      } else if (!walletState.onSepolia) {
        setDataErrorMessage(`Wrong Network. Switch to Sepolia. (On ${walletState.networkName || 'unknown'})`);
      }
    }
  }, [fetchContractUIData, isWalletConnected]); // Added isWalletConnected to deps for previouslyConnected

  useEffect(() => {
    if ((isWalletConnected && isCorrectNetwork) || (!isWalletConnected && SEPOLIA_RPC_URL && SEPOLIA_RPC_URL !== "YOUR_ALCHEMY_SEPOLIA_HTTPS_RPC_URL_HERE")) {
      fetchContractUIData();
    } else if (!isWalletConnected && (!SEPOLIA_RPC_URL || SEPOLIA_RPC_URL === "YOUR_ALCHEMY_SEPOLIA_HTTPS_RPC_URL_HERE")) {
        setIsLoadingData(false);
        setDataErrorMessage("Please connect wallet to view data, or configure fallback RPC.");
    }
  }, [isWalletConnected, isCorrectNetwork, fetchContractUIData]);

  useEffect(() => {
    if (lastDepositTimestamp === null || currentTimeoutPeriodSeconds === null || currentTimeoutPeriodSeconds === 0 ) { // Removed wallet checks here to allow public countdown
        setTimeLeft(null); return;
    }
    const calculateAndSetTimeLeft = () => { const now = Math.floor(Date.now() / 1000); const end = lastDepositTimestamp + currentTimeoutPeriodSeconds; setTimeLeft(Math.max(0, end - now)); };
    calculateAndSetTimeLeft(); const id = setInterval(calculateAndSetTimeLeft, 1000);
    return () => clearInterval(id);
  }, [lastDepositTimestamp, currentTimeoutPeriodSeconds]); // Removed wallet checks here

  const formatTimeLeft = (s) => { 
    if (s === null) return isLoadingData && (!isWalletConnected || !SEPOLIA_RPC_URL) ? "Loading..." : "Calculating..."; // Show calculating if public data is available
    if (s <= 0 && lastDepositorAddress) return "Ready!"; 
    if (s <= 0) return "N/A"; 
    const m = Math.floor(s/60); const secs = s%60; return `${m}m ${secs<10?'0':''}${secs}s`; 
  };
  const isClaimable = timeLeft !== null && timeLeft <= 0 && lastDepositorAddress !== null && lastDepositorAddress !== ethers.ZeroAddress && isWalletConnected && isCorrectNetwork;
  
  const pageStyle = { fontSize: 'clamp(5px, 1.4vh, 15px)' }; // Adjusted min font size from your code

  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden" style={pageStyle} title={yourDAppName}>
      
      <header className="relative p-[1vh] text-center border-b border-gray-200 shadow-sm shrink-0 h-[10vh] flex items-center justify-center bg-white">
        {/* Using your larger title font size */}
        <h1 className="text-[6.5vh] sm:text-[7vh] font-extrabold text-gray-800 leading-tight truncate w-full px-[20vw] sm:px-[18vw] md:px-[15vw]">
          Simple Gambling Machine
        </h1>
        <div className="absolute top-1/2 -translate-y-1/2 right-[1vh] md:right-[1.5vh] z-10">
          <WalletInfo onConnectionStateChange={handleWalletStateChange} /> 
        </div>
      </header>

      {dataErrorMessage && (
        <p className="text-center text-red-500 py-[0.5vh] px-[1vw] shrink-0 text-[1.3vh] sm:text-[1.4vh] truncate bg-white">
          {dataErrorMessage}
        </p>
      )}

      <div className="flex-1 flex flex-col md:flex-row md:space-x-[0.5vw] overflow-hidden p-[0.5vh] min-h-0 bg-white">
        <div className="md:w-3/5 h-full flex flex-col space-y-[0.5vh] overflow-hidden p-[0.5vh]">
          <div className="shrink-0 h-[45vh]"> {/* User's specified height for main visual */}
            <MainVisualDisplay imageName="SGM0.png" altText="Image is not here" />
          </div>
          <div className="flex-1 flex flex-col sm:flex-row sm:space-x-[0.5vw] overflow-hidden min-h-0">
            <div className="sm:w-1/2 h-full flex flex-col space-y-[0.5vh] p-[0.5vh] overflow-hidden"> {/* left1 */}
              <DataDisplayCard label="ETH in the Machine" value={isLoadingData ? "Loading..." : (contractEthBalance !== null ? contractEthBalance.toFixed(5) : "N/A")} unit="ETH" prominent={true} />
              <ParticipateButton requiredAmountToDepositEth={requiredDepositEth ?? 0} onParticipationSuccess={fetchContractUIData} isWalletConnected={isWalletConnected && isCorrectNetwork} prominent={true} />
              <DataDisplayCard label="Required Deposit" value={isLoadingData ? "Loading..." : (requiredDepositEth !== null ? requiredDepositEth.toFixed(8) : "N/A")} unit="ETH" />
              <DataDisplayCard 
                label="Last Depositor"
                value={isLoadingData ? "Loading..." : (lastDepositorAddress ? (<a href={`https://sepolia.etherscan.io/address/${lastDepositorAddress}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline break-all" title={`View on Etherscan: ${lastDepositorAddress}`}>{lastDepositorAddress}</a>) : "N/A")}
              />
            </div>
            <div className="sm:w-1/2 h-full flex flex-col space-y-[0.5vh] p-[0.5vh] overflow-hidden"> {/* right1 */}
              <DataDisplayCard label="Time Left" value={formatTimeLeft(timeLeft)} prominent={true} />
              <ClaimButton isClaimable={isClaimable} isWalletConnected={isWalletConnected && isCorrectNetwork} onClaimSuccess={fetchContractUIData} prominent={true} />
              <DataDisplayCard label="Total Deposits" value={isLoadingData ? "Loading..." : (depositCount !== null ? depositCount : "N/A")} />
              <DataDisplayCard
                label="Source Code"
                value={yourGitHubRepoUrl ? (<a href={yourGitHubRepoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline break-all" title="View source code on GitHub">{yourGitHubRepoUrl}</a>) : "N/A"}
              />
            </div>
          </div>
        </div>
        
        {/* Main Right Column */}
        <div className="md:w-2/5 h-full flex flex-col space-y-[0.5vh] overflow-hidden p-[0.5vh]"> {/* Main Right - space-y provides minimal gap */}
          
          {/* FAQ Wrapper - Now on top. */}
          {/* It uses flex-1 to take available space primarily, allowing SchemeImageDisplay to be pushed down if FAQ is very short */}
          {/* OR, if FAQ has lots of content, its internal scroll will activate. */}
          <div className="flex-1 overflow-hidden min-h-0 p-[0.5vh] rounded-md bg-white flex flex-col"> 
            <FAQ /> {/* Ensure FAQ.js itself has appropriate max-height and overflow-y-auto if its content is long */}
          </div>

          {/* Scheme Image Container - Now below FAQ, with a defined height. */}
          <div className="shrink-0 h-[25vh] sm:h-[28vh] rounded-md overflow-hidden bg-white"> {/* Adjust vh height as needed for your image */}
             <SchemeImageDisplay 
               imageName="SGM_Table.png" 
               title="Deposits Structure" 
               altText="Table detailing deposit structure and percentages" 
             /> 
          </div>
        </div>
      </div>
      
      <div className="text-center py-[0.5vh] md:py-[1vh] border-t border-gray-200 shrink-0 h-[7vh] flex items-center justify-center bg-white">
          <button
              onClick={fetchContractUIData}
              disabled={isLoadingData} 
              className="px-[1.5vw] py-[0.75vh] text-[1.3vh] sm:text-[1.5vh] bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300"
          >
              {isLoadingData ? "Refreshing..." : "Refresh Contract Data"}
          </button>
      </div>
    </div>
  );
}