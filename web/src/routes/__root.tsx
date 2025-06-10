import { Footer } from "@/components/footer";
import Header from "@/components/header";
import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import {
	HeadContent,
	Outlet,
	createRootRouteWithContext,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../index.css";

export type RouterAppContext = {};

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title: "Simple Gambling Machine",
			},
			{
				name: "description",
				content:
					"A fully decentralized, transparent gambling game with no house edge. Only players win.",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/logo.png",
			},
			{
				rel: "apple-touch-icon",
				href: "/logo.png",
			},
		],
	}),
});

function RootComponent() {
	const isFetching = useRouterState({
		select: (s) => s.isLoading,
	});

	return (
		<>
			<HeadContent />
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<div className="flex min-h-screen flex-col">
					<Header />
					<main className="flex-1">{isFetching ? <Loader /> : <Outlet />}</main>
					<Footer />
				</div>
				<Toaster richColors />
			</ThemeProvider>
			<TanStackRouterDevtools position="bottom-left" />
		</>
	);
}
