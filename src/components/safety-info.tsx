import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ExternalLink } from "lucide-react";

export function SafetyInfo() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Transparency & Safety</CardTitle>
			</CardHeader>
			<CardContent>
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="is-it-safe">
						<AccordionTrigger>Is it safe?</AccordionTrigger>
						<AccordionContent>
							<div className="space-y-4">
								<p>
									The game is <strong>fully on-chain and immutable</strong>.
									Here's what makes it transparent:
								</p>
								<ul className="ml-4 list-inside list-disc space-y-2">
									<li>
										<a
											href="https://etherscan.io/address/0x01567Fd0e93004B1af30a86DD590A591c8aA72FC"
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 text-blue-600 hover:underline"
										>
											Deployed contract address{" "}
											<ExternalLink className="h-3 w-3" />
										</a>
									</li>
									<li>
										<a
											href="https://etherscan.io/address/0x01567Fd0e93004B1af30a86DD590A591c8aA72FC#code"
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 text-blue-600 hover:underline"
										>
											Verified source code on Etherscan{" "}
											<ExternalLink className="h-3 w-3" />
										</a>
									</li>
									<li>Frontend is open-source</li>
									<li>Hosted on IPFS</li>
								</ul>
								<Alert>
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription>
										<strong>
											Always check the contract address in your wallet before
											confirming any transaction.
										</strong>
									</AlertDescription>
								</Alert>
							</div>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="casino-wins">
						<AccordionTrigger>Casino wins as always, right?</AccordionTrigger>
						<AccordionContent>
							<p>
								<strong>No. Only depositors win. No fees.</strong>
							</p>
							<p className="mt-2 text-muted-foreground">
								This is not a traditional casino. There is no house edge, no
								fees, and no profit for anyone except the players. The smart
								contract simply redistributes the funds according to the game
								rules.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="audited">
						<AccordionTrigger>Is the smart contract audited?</AccordionTrigger>
						<AccordionContent>
							<div className="space-y-4">
								<Alert>
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription>
										<strong>No. Use at your own risk.</strong>
									</AlertDescription>
								</Alert>
								<p>
									The code is pretty simple though, you can find it on{" "}
									<a
										href="https://github.com/noskillcoding/simple_gambling_machine"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 text-blue-600 hover:underline"
									>
										GitHub <ExternalLink className="h-3 w-3" />
									</a>{" "}
									and{" "}
									<a
										href="https://etherscan.io/address/0x01567Fd0e93004B1af30a86DD590A591c8aA72FC#code"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 text-blue-600 hover:underline"
									>
										Etherscan <ExternalLink className="h-3 w-3" />
									</a>
									.
								</p>
							</div>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="vulnerabilities">
						<AccordionTrigger>No vulnerabilities, right?</AccordionTrigger>
						<AccordionContent>
							<div className="space-y-4">
								<p>
									There is a known limitation with{" "}
									<strong>on-chain randomness</strong>. The random winner
									selection uses block hash as a source of randomness, which can
									theoretically be manipulated by the last depositor.
								</p>
								<p className="text-muted-foreground">
									But you have to win the game first anyway, and it's tricky and
									everyone will know you're a hacker.
								</p>
								<Alert>
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription>
										<strong>On-chain randomness isn't truly random.</strong>{" "}
										However, exploiting this would require significant intelligence
										and would be publicly visible on the blockchain.
									</AlertDescription>
								</Alert>
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</CardContent>
		</Card>
	);
}
