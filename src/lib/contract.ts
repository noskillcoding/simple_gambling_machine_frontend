export const GAMBLING_MACHINE_ADDRESS =
	"0x01567Fd0e93004B1af30a86DD590A591c8aA72FC" as const;

export const GAMBLING_MACHINE_ABI = [
	{
		type: "function",
		name: "deposit",
		inputs: [],
		outputs: [],
		stateMutability: "payable",
	},
	{
		type: "function",
		name: "claimTimeout",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "nextRequiredDeposit",
		inputs: [],
		outputs: [{ name: "", type: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "lastDepositor",
		inputs: [],
		outputs: [{ name: "", type: "address" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "depositCount",
		inputs: [],
		outputs: [{ name: "", type: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "lastDepositTime",
		inputs: [],
		outputs: [{ name: "", type: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "_currentTimeout",
		inputs: [],
		outputs: [{ name: "", type: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "depositLimits",
		inputs: [{ name: "", type: "uint256" }],
		outputs: [{ name: "", type: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "depositBps",
		inputs: [{ name: "", type: "uint256" }],
		outputs: [{ name: "", type: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "timeoutSecs",
		inputs: [{ name: "", type: "uint256" }],
		outputs: [{ name: "", type: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "event",
		name: "DepositMade",
		inputs: [
			{ name: "depositor", type: "address", indexed: true },
			{ name: "amount", type: "uint256", indexed: false },
			{ name: "totalDeposits", type: "uint256", indexed: false },
		],
	},
	{
		type: "event",
		name: "GameWon",
		inputs: [
			{ name: "winner", type: "address", indexed: true },
			{ name: "amount", type: "uint256", indexed: false },
		],
	},
	{
		type: "event",
		name: "RandomReward",
		inputs: [
			{ name: "winner", type: "address", indexed: true },
			{ name: "amount", type: "uint256", indexed: false },
		],
	},
] as const;
