import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGameState } from "@/hooks/useGameState";
import { GAMBLING_MACHINE_ABI, GAMBLING_MACHINE_ADDRESS } from "@/lib/contract";
import { toast } from "sonner";
import { formatEther, parseEther } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

function formatTimeLeft(seconds: number): string {
	if (seconds <= 0) return "Game Ended";

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	if (hours > 0) {
		return `${hours}h ${minutes}m ${secs}s`;
	}
	return `${minutes}m ${secs}s`;
}

export function GameState() {
	const { gameState, userWalletData, isLoading } = useGameState();

	const {
		writeContract: deposit,
		data: depositHash,
		isPending: isDepositPending,
	} = useWriteContract();
	const {
		writeContract: claimTimeout,
		data: claimHash,
		isPending: isClaimPending,
	} = useWriteContract();

	const { isLoading: isDepositConfirming } = useWaitForTransactionReceipt({
		hash: depositHash,
	});

	const { isLoading: isClaimConfirming } = useWaitForTransactionReceipt({
		hash: claimHash,
	});

	const handleDeposit = () => {
		if (!userWalletData.isConnected) {
			toast.error("Please connect your wallet");
			return;
		}

		if (gameState.isGameEnded) {
			toast.error("Game has ended");
			return;
		}

		deposit(
			{
				address: GAMBLING_MACHINE_ADDRESS,
				abi: GAMBLING_MACHINE_ABI,
				functionName: "deposit",
				value: gameState.requiredDepositEth,
			},
			{
				onSuccess: () => {
					toast.success("Deposit transaction sent!");
				},
				onError: (error) => {
					toast.error(`Deposit failed: ${error.message}`);
				},
			},
		);
	};

	const handleClaimTimeout = () => {
		if (!userWalletData.isConnected) {
			toast.error("Please connect your wallet");
			return;
		}

		if (!gameState.isGameEnded) {
			toast.error("Game is still active");
			return;
		}

		claimTimeout(
			{
				address: GAMBLING_MACHINE_ADDRESS,
				abi: GAMBLING_MACHINE_ABI,
				functionName: "claimTimeout",
			},
			{
				onSuccess: () => {
					toast.success("Claim transaction sent!");
				},
				onError: (error) => {
					toast.error(`Claim failed: ${error.message}`);
				},
			},
		);
	};

	const progressValue =
		gameState.currentTimeoutSecs > 0
			? (gameState.timeLeftSeconds / gameState.currentTimeoutSecs) * 100
			: 0;

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Game State</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
			<CardHeader className="text-center pb-4">
				<CardTitle className="text-3xl font-bold">Simple Gambling Machine</CardTitle>
				<p className="text-muted-foreground">Fully decentralized • No house edge • Only players win</p>
			</CardHeader>
			<CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-8">
				{/* Main Stats - Hero Display */}
				<div className="text-center space-y-4">
					<div>
						<p className="text-muted-foreground text-sm uppercase tracking-wide">Total Pot</p>
						<p className="font-bold text-4xl md:text-5xl text-primary">
							{formatEther(gameState.ethInMachine)} ETH
						</p>
					</div>
					
					{/* Timer - Most Important */}
					<div className="bg-card/50 rounded-lg p-4 border">
						<div className="mb-3 flex items-center justify-between">
							<p className="text-muted-foreground text-sm font-medium">Time Remaining</p>
							<p className="font-mono text-lg font-bold">
								{formatTimeLeft(gameState.timeLeftSeconds)}
							</p>
						</div>
						<Progress
							value={progressValue}
							className={`h-4 ${gameState.timeLeftSeconds < 3600 ? "bg-red-100" : ""}`}
						/>
						{gameState.isGameEnded && (
							<p className="text-center text-destructive font-bold mt-2">🎉 Game Ended! Claim rewards!</p>
						)}
					</div>
				</div>

				{/* Action Zone - Most Important */}
				<div className="space-y-4">
					<div className="bg-card/30 rounded-lg p-4 border">
						<p className="text-center text-muted-foreground text-sm mb-2">Next Deposit Required</p>
						<p className="text-center font-bold text-2xl">
							{formatEther(gameState.requiredDepositEth)} ETH
						</p>
					</div>
					
					<div className="grid grid-cols-2 gap-4">
						<Button
							onClick={handleDeposit}
							disabled={
								!userWalletData.isConnected ||
								gameState.isGameEnded ||
								isDepositPending ||
								isDepositConfirming
							}
							className="h-14 text-lg font-bold"
							size="lg"
						>
							{isDepositPending || isDepositConfirming
								? "Depositing..."
								: "🎲 DEPOSIT"}
						</Button>

						<Button
							onClick={handleClaimTimeout}
							disabled={
								!userWalletData.isConnected ||
								!gameState.isGameEnded ||
								isClaimPending ||
								isClaimConfirming
							}
							variant={userWalletData.canClaimReward ? "default" : "secondary"}
							className="h-14 text-lg font-bold"
							size="lg"
						>
							{isClaimPending || isClaimConfirming
								? "Processing..."
								: userWalletData.canClaimReward
									? "💰 CLAIM"
									: "⏰ END GAME"}
						</Button>
					</div>
				</div>

				{/* Secondary Stats */}
				<div className="grid grid-cols-2 gap-4 pt-4 border-t">
					<div className="text-center">
						<p className="text-muted-foreground text-xs uppercase tracking-wide">Total Deposits</p>
						<p className="font-bold text-xl">{gameState.totalDepositsCount}</p>
					</div>
					<div className="text-center">
						<p className="text-muted-foreground text-xs uppercase tracking-wide">Last Depositor</p>
						{gameState.lastDepositorAddress ===
						"0x0000000000000000000000000000000000000000" ? (
							<p className="font-mono text-sm">None</p>
						) : (
							<a
								href={`https://etherscan.io/address/${gameState.lastDepositorAddress}`}
								target="_blank"
								rel="noopener noreferrer"
								className="font-mono text-sm text-blue-600 hover:underline block"
							>
								{`${gameState.lastDepositorAddress.slice(0, 6)}...${gameState.lastDepositorAddress.slice(-4)}`}
							</a>
						)}
					</div>
				</div>
			</div>
			
			{/* Logo Section */}
			<div className="hidden lg:flex items-center justify-center">
				<img 
					src="/logo.png" 
					alt="Simple Gambling Machine" 
					className="w-full max-w-[200px] h-auto opacity-80 hover:opacity-100 transition-opacity"
				/>
			</div>
		</CardContent>
		</Card>
	);
}
