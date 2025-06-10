import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
	return (
		<header className="border-b">
			<div className="container mx-auto flex items-center justify-between px-4 py-4">
				<div className="flex items-center gap-3">
					<img 
						src="/logo.png" 
						alt="Simple Gambling Machine" 
						className="h-8 w-8"
					/>
					<h1 className="font-bold text-xl">Simple Gambling Machine</h1>
				</div>
				<div className="flex items-center gap-4">
					<ConnectButton />
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
