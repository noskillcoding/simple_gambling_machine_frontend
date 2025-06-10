import { createFileRoute } from "@tanstack/react-router";
import { GameRules } from "../components/game-rules";
import { GameState } from "../components/game-state";
import { ProjectInfo } from "../components/project-info";
import { SafetyInfo } from "../components/safety-info";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			<div className="space-y-8">
				{/* Hero Section - Game State takes center stage */}
				<GameState />
				
				{/* Secondary Info in tabs/accordion format below */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<GameRules />
					<SafetyInfo />
					<ProjectInfo />
				</div>
			</div>
		</div>
	);
}
