export interface DepositTier {
	tier: number;
	minDeposits: number;
	maxDeposits?: number;
	depositPercentage: number;
	timeoutHours: number;
}

export interface GameState {
	ethInMachine: bigint;
	timeLeftSeconds: number;
	requiredDepositEth: bigint;
	lastDepositorAddress: `0x${string}`;
	totalDepositsCount: number;
	lastDepositTime: number;
	currentTimeoutSecs: number;
	isGameEnded: boolean;
}

export interface UserWalletData {
	userAddress: `0x${string}` | undefined;
	userEthBalance: bigint | undefined;
	isConnected: boolean;
	canClaimReward: boolean;
}

export interface TransactionStatus {
	status: "idle" | "pending" | "success" | "error";
	hash?: string;
	error?: string;
}
