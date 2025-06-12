import { ExternalLink } from "lucide-react";

export function Footer() {
	return (
		<footer className="mt-12 border-t">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					<div>
						<h3 className="mb-4 font-semibold">Project Links</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="https://github.com/noskillcoding/simple_gambling_machine_frontend"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
								>
									Frontend Source Code <ExternalLink className="h-3 w-3" />
								</a>
							</li>
							<li>
								<a
									href="https://github.com/noskillcoding/simple_gambling_machine"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
								>
									Contract Source Code <ExternalLink className="h-3 w-3" />
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="mb-4 font-semibold">Contract</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="https://etherscan.io/address/0x01567Fd0e93004B1af30a86DD590A591c8aA72FC"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
								>
									View on Etherscan <ExternalLink className="h-3 w-3" />
								</a>
							</li>
							<li>
								<span className="font-mono text-muted-foreground text-xs">
									0x01567Fd0e93004B1af30a86DD590A591c8aA72FC
								</span>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="mb-4 font-semibold">About</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="https://paragraph.com/@0xucs.eth/vibe-coding-simple-gambling-machine"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
								>
									Project Article <ExternalLink className="h-3 w-3" />
								</a>
							</li>
							<li>
								<a
									href="https://ipfs.io/ipfs/bafybeicrk7cx2mhhcmpkzehpaeb4vuruayt5shc2gmtk4pcnwbwa5m6kqi/"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
								>
									Classic Frontend <ExternalLink className="h-3 w-3" />
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 border-t pt-8">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<div className="flex items-center gap-2">
							<img 
								src="./logo.png" 
								alt="Simple Gambling Machine" 
								className="h-5 w-5 opacity-70"
							/>
							<p className="text-muted-foreground text-sm">
								© 2025 Simple Gambling Machine. Fully decentralized and
								open-source.
							</p>
						</div>
						<p className="text-muted-foreground text-xs">
							Use at your own risk. Not audited.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
