import { GAMBLING_MACHINE_ABI, GAMBLING_MACHINE_ADDRESS } from "@/lib/contract";
import type { GameState, UserWalletData } from "@/lib/types";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";

export function useGameState() {
	const { address, isConnected } = useAccount();
	const [currentTime, setCurrentTime] = useState(() => Math.floor(Date.now() / 1000));

	const { data: contractBalance } = useBalance({
		address: GAMBLING_MACHINE_ADDRESS,
	});

	const { data: userBalance } = useBalance({
		address,
	});

	const { data: requiredDeposit } = useReadContract({
		address: GAMBLING_MACHINE_ADDRESS,
		abi: GAMBLING_MACHINE_ABI,
		functionName: "nextRequiredDeposit",
	});

	const { data: lastDepositor } = useReadContract({
		address: GAMBLING_MACHINE_ADDRESS,
		abi: GAMBLING_MACHINE_ABI,
		functionName: "lastDepositor",
	});

	const { data: depositCount } = useReadContract({
		address: GAMBLING_MACHINE_ADDRESS,
		abi: GAMBLING_MACHINE_ABI,
		functionName: "depositCount",
	});

	const { data: lastDepositTime } = useReadContract({
		address: GAMBLING_MACHINE_ADDRESS,
		abi: GAMBLING_MACHINE_ABI,
		functionName: "lastDepositTime",
	});

	const { data: currentTimeout } = useReadContract({
		address: GAMBLING_MACHINE_ADDRESS,
		abi: GAMBLING_MACHINE_ABI,
		functionName: "_currentTimeout",
	});

	// Update current time every second
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(Math.floor(Date.now() / 1000));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const timeLeftSeconds =
		lastDepositTime && currentTimeout
			? Math.max(0, Number(currentTimeout) - (currentTime - Number(lastDepositTime)))
			: 0;

	const isGameEnded = timeLeftSeconds === 0 && Number(depositCount || 0) > 0;

	const gameState: GameState = {
		ethInMachine: contractBalance?.value || 0n,
		timeLeftSeconds,
		requiredDepositEth: requiredDeposit || 0n,
		lastDepositorAddress:
			(lastDepositor as `0x${string}`) ||
			"0x0000000000000000000000000000000000000000",
		totalDepositsCount: Number(depositCount || 0),
		lastDepositTime: Number(lastDepositTime || 0),
		currentTimeoutSecs: Number(currentTimeout || 0),
		isGameEnded,
	};

	const canClaimReward = isGameEnded && address && address === lastDepositor;

	const userWalletData: UserWalletData = {
		userAddress: address,
		userEthBalance: userBalance?.value,
		isConnected,
		canClaimReward: Boolean(canClaimReward),
	};

	return {
		gameState,
		userWalletData,
		isLoading: !contractBalance || !requiredDeposit || !depositCount,
	};
}
