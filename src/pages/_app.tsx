import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

export default function App(props: AppProps) {
	const { Component, pageProps } = props;

	return (
		<>
			<Head>
				<title>🛠️ Utils</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
				<link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon.png" />
				<link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon.png" />
				<link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon.png" />
				<link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon.png" />
				<link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon.png" />
				<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon.png" />
				<link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon.png" />
				<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon.png" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />
				<meta name="msapplication-TileColor" content="#1A1B1E" />
				<meta name="theme-color" content="#1A1B1E" />

				<meta name='twitter:card' content='summary' />
				<meta name='twitter:url' content='https://utils.mateusdeitos.dev' />
				<meta name='twitter:title' content='🛠️ Utils' />
				<meta name='twitter:description' content='Tools to make your programming life easier' />
				<meta name='twitter:image' content='https://utils.mateusdeitos.dev/favicon-32x32.png' />
				<meta name='twitter:creator' content='@mcdeitos' />
				<meta property='og:type' content='website' />
				<meta property='og:title' content='🛠️ Utils' />
				<meta property='og:description' content='Tools to make your programming life easier' />
				<meta property='og:site_name' content='🛠️ Utils' />
				<meta property='og:url' content='https://utils.mateusdeitos.dev' />
				<meta property='og:image' content='https://utils.mateusdeitos.dev/favicon-32x32.png' />
			</Head>

			<QueryClientProvider client={queryClient}>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={{
						/** Put your mantine theme override here */
						colorScheme: 'dark',
					}}
				>
					<Component {...pageProps} />
				</MantineProvider>
				<ReactQueryDevtools />
			</QueryClientProvider>

		</>
	);
}