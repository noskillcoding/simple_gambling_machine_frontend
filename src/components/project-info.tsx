import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export function ProjectInfo() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>About the Project</CardTitle>
			</CardHeader>
			<CardContent>
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="why-project">
						<AccordionTrigger>Why this project?</AccordionTrigger>
						<AccordionContent>
							<div className="space-y-4">
								<p>
									This project was created to demonstrate a fully decentralized,
									transparent gambling mechanism with no house edge. It's an
									experiment in fair, on-chain gaming where only players
									benefit.
								</p>
								<p>
									Read the full story in our{" "}
									<a
										href="https://paragraph.com/@0xucs.eth/vibe-coding-simple-gambling-machine"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 text-blue-600 hover:underline"
									>
										project article <ExternalLink className="h-3 w-3" />
									</a>
									.
								</p>
								<p className="text-muted-foreground text-sm">
									<strong>Contributions welcome!</strong> Check out our{" "}
									<a
										href="https://github.com/noskillcoding/simple_gambling_machine_frontend"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 text-blue-600 hover:underline"
									>
										GitHub repository <ExternalLink className="h-3 w-3" />
									</a>{" "}
									to get involved.
								</p>
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</CardContent>
		</Card>
	);
}
