import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const depositTiers = [
	{ tier: 1, deposits: "1-5", percentage: "2%", timeout: "24h" },
	{ tier: 2, deposits: "6-15", percentage: "3%", timeout: "18h" },
	{ tier: 3, deposits: "16-30", percentage: "4%", timeout: "12h" },
	{ tier: 4, deposits: "31-50", percentage: "5%", timeout: "8h" },
	{ tier: 5, deposits: "51-75", percentage: "6%", timeout: "6h" },
	{ tier: 6, deposits: "76-100", percentage: "8%", timeout: "4h" },
];

export function GameRules() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>How It Works</CardTitle>
			</CardHeader>
			<CardContent>
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="what-is-it">
						<AccordionTrigger>What is it about?</AccordionTrigger>
						<AccordionContent>
							Simple Gambling Machine is a fully decentralized, on-chain
							gambling game where players make deposits to win the entire pot.
							The game operates with transparent rules and no house edge - only
							players win.
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="how-to-gamble">
						<AccordionTrigger>How to gamble?</AccordionTrigger>
						<AccordionContent>
							<ol className="list-inside list-decimal space-y-2">
								<li>Connect your wallet</li>
								<li>
									Make a deposit of the required amount (shown in the game
									state)
								</li>
								<li>
									Each deposit resets the timer and increases the required
									amount for the next deposit
								</li>
								<li>
									Wait for other players to deposit or for the timer to run out
								</li>
							</ol>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="how-to-win">
						<AccordionTrigger>How can I win?</AccordionTrigger>
						<AccordionContent>
							<div className="space-y-2">
								<p>There are two ways to win:</p>
								<ul className="ml-4 list-inside list-disc space-y-1">
									<li>
										<strong>Main Winner (80%):</strong> Be the last depositor
										when the timer runs out
									</li>
									<li>
										<strong>Random Winners (10%):</strong> 5 random depositors
										share 10% of the pot
									</li>
								</ul>
								<p className="text-muted-foreground text-sm">
									The remaining 10% stays in the contract as the initial balance
									for the next round.
								</p>
							</div>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="when-game-ends">
						<AccordionTrigger>When will the game end?</AccordionTrigger>
						<AccordionContent>
							The game ends when the timer reaches zero. The timer duration
							depends on the number of deposits made and gets shorter as more
							players join. See the deposits structure below for exact timeouts.
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="deposits-structure">
						<AccordionTrigger>Deposits Structure</AccordionTrigger>
						<AccordionContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Tier</TableHead>
										<TableHead>Deposits Range</TableHead>
										<TableHead>Deposit %</TableHead>
										<TableHead>Timeout</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{depositTiers.map((tier) => (
										<TableRow key={tier.tier}>
											<TableCell>{tier.tier}</TableCell>
											<TableCell>{tier.deposits}</TableCell>
											<TableCell>{tier.percentage}</TableCell>
											<TableCell>{tier.timeout}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<p className="mt-2 text-muted-foreground text-sm">
								Each deposit must be a percentage of the current pot size, and
								the timeout decreases with more participants.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</CardContent>
		</Card>
	);
}
