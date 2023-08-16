import "../globals.css";

import ThemeProvider from "../../utils/ThemeProvider";
import Navbar from "@/components/Navbar";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/utils/Toaster";

import type { Metadata } from "next";
import LoadingBar from "@/components/LoadingBar";

export const metadata: Metadata = {
	title: "Instagram",
	description:
		"Create an account or log into Instagram - A simple, fun & creative way to capture, edit & share photos, videos & messages with friends & family.",
	icons: {
		icon: "/images/instagram-logo.png",
	},
	// manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<html
				lang="en"
				suppressHydrationWarning>
				<body>
					<ThemeProvider>
						<LoadingBar />
						<Navbar />
						{children}
					</ThemeProvider>
					<Toaster />
				</body>
			</html>
		</ClerkProvider>
	);
}
