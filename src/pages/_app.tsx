import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/code-highlight/styles.css";
import "../../styles/mantine-overrides.css";
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import { AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { Anchor, MantineProvider, Text, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const theme = createTheme({
	components: {
		Text: Text.extend({
			styles(theme, props, ctx) {
				let color = theme.colors.gray[0];
				return {
					root: {
						color,
						fontSize: theme.fontSizes.sm,
						fontWeight: "bold",
						cursor: "pointer",
						":hover": {
							color: theme.colors.blue[8],
						},
						":active": {
							color: theme.colors.blue[8],
						},
						transition: "color 0.2s ease-in-out",
					},
				};
			},
		}),
		Anchor: Anchor.extend({
			styles(theme, props, ctx) {
				return {
					root: {
						color: theme.colors.blue[8],
						textDecoration: "none",
					},
				};
			},
		}),
	},
	colors: {
		gray: [
			"#FFFFFF",
			"#F9FAFB",
			"#F3F4F6",
			"#E5E7EB",
			"#D1D5DB",
			"#9CA3AF",
			"#6B7280",
			"#1A1B1E",
			"#374151",
			"#25262b",
		],
	},
});

export default function App(props: AppProps) {
	const { Component, pageProps } = props;

	return (
		<>
			<Head>
				<title>Utils</title>

				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
				<link
					rel="apple-touch-icon"
					sizes="57x57"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="60x60"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="72x72"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="76x76"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="114x114"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="120x120"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="144x144"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="152x152"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="192x192"
					href="/android-chrome-192x192.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<meta name="msapplication-TileColor" content="#1A1B1E" />
				<meta name="theme-color" content="#1A1B1E" />

				<meta name="twitter:card" content="summary" />
				<meta name="twitter:url" content="https://utils.mateusdeitos.dev" />
				<meta name="twitter:title" content="🛠️ Utils" />
				<meta
					name="twitter:description"
					content="Tools to make your programming life easier"
				/>
				<meta
					name="twitter:image"
					content="https://utils.mateusdeitos.dev/favicon-32x32.png"
				/>
				<meta name="twitter:creator" content="@mcdeitos" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="🛠️ Utils" />
				<meta
					property="og:description"
					content="Tools to make your programming life easier"
				/>
				<meta property="og:site_name" content="🛠️ Utils" />
				<meta property="og:url" content="https://utils.mateusdeitos.dev" />
				<meta
					property="og:image"
					content="https://utils.mateusdeitos.dev/favicon-32x32.png"
				/>
			</Head>

			<MantineProvider defaultColorScheme="dark" theme={theme}>
				<Notifications />
				<QueryClientProvider client={queryClient}>
					<Component {...pageProps} />
					<Analytics />
					<ReactQueryDevtools />
				</QueryClientProvider>
			</MantineProvider>
		</>
	);
}
