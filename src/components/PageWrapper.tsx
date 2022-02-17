import { useState } from 'react';
import { AppShell, ColorSchemeProvider, Burger, Group, Header, MantineProvider, MediaQuery, Navbar, Text, useMantineTheme, ColorScheme, ActionIcon, useMantineColorScheme, MantineTheme, CSSObject, MantineThemeOverride } from '@mantine/core';
import Link from 'next/link'
import { useLocalStorageValue } from '@mantine/hooks';

export const PageWrapper: React.FC = ({ children }) => {
	const [persistedTheme, setPersistedTheme] = useLocalStorageValue<ColorScheme>({ key: 'theme', defaultValue: 'light' });
	const [colorScheme, setColorScheme] = useState<ColorScheme>(persistedTheme);
	const toggleColorScheme = (value?: ColorScheme) => {
		const newScheme = value || (colorScheme === 'light' ? 'dark' : 'light');
		setColorScheme(newScheme);
		setPersistedTheme(newScheme);
	};

	const theme: MantineThemeOverride = {
		fontFamily: "Poppins",
		headings: {
			fontFamily: "Poppins",
		}
	}

	return (
		<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
			<MantineProvider theme={{ colorScheme, ...theme }} withGlobalStyles withNormalizeCSS>
				<Shell>{children}</Shell>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}

export const styles = (colorScheme: ColorScheme) => ({
	bg: {
		sx: (theme: MantineTheme) => ({
			backgroundColor: colorScheme === 'light' ? theme.colors.gray[0] : theme.colors.dark[7]
		})
	},
	text: {
		sx: (theme: MantineTheme) => ({
			color: colorScheme === 'light' ? theme.colors.gray[9] : theme.colors.gray[0],
			fontSize: theme.fontSizes.sm,
			cursor: 'pointer',
			":hover": {
				color: theme.colors.blue[8]
			},
			transition: 'color 0.2s ease-in-out',
		})
	},
	header: {
		sx: (theme: MantineTheme): CSSObject => ({
			color: colorScheme === 'light' ? theme.colors.gray[9] : theme.colors.gray[0],
			fontSize: theme.headings.sizes.h1.fontSize,
			cursor: 'pointer',
			":hover": {
				color: theme.colors.blue[8]
			},
			transition: 'color 0.2s ease-in-out',
		})
	}
});

const Shell: React.FC = ({ children }) => {
	const { toggleColorScheme, colorScheme } = useMantineColorScheme();
	const [opened, setOpened] = useState(false);
	const theme = useMantineTheme();

	return <AppShell
		{...styles(colorScheme).bg}
		// navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
		navbarOffsetBreakpoint="sm"
		// fixed prop on AppShell will be automatically added to Header and Navbar
		fixed
		navbar={
			<Navbar
				padding="md"
				// Breakpoint at which navbar will be hidden if hidden prop is true
				hiddenBreakpoint="sm"
				// Hides navbar when viewport size is less than value specified in hiddenBreakpoint
				hidden={!opened}
				// when viewport size is less than theme.breakpoints.sm navbar width is 100%
				// viewport size > theme.breakpoints.sm – width is 300px
				// viewport size > theme.breakpoints.lg – width is 400px
				width={{ sm: 150, lg: 200 }}
				{...styles(colorScheme).bg}
			>
				<Link href="/emprestimo">
					<Text {...styles(colorScheme).text}>Cálculo de empréstimo</Text>
				</Link>

			</Navbar>
		}
		header={
			<Header height={70} padding="md" {...styles(colorScheme).bg}>
				{/* Handle other responsive styles with MediaQuery component or createStyles function */}
				<div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
					<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
						<Burger
							opened={opened}
							onClick={() => setOpened((o) => !o)}
							size="sm"
							color={theme.colors.gray[6]}
							mr="xl"
						/>
					</MediaQuery>

					<Group position="apart" sx={{ width: '100%' }}>
						<Link href="/">
							<MediaQuery smallerThan="md" styles={{
								fontSize: theme.headings.sizes.h4.fontSize
							}}>
								<Text {...styles(colorScheme).header}>Ferramentas úteis</Text>
							</MediaQuery>
						</Link>
						<ActionIcon
							variant="filled"
							color={colorScheme === 'dark' ? 'yellow' : 'blue'}
							onClick={() => toggleColorScheme()}
							title="Toggle color scheme"
						>
							{colorScheme === 'dark' ? '☀️' : '🌙'}
						</ActionIcon>
					</Group>
				</div>
			</Header>
		}
	>
		{children}
	</AppShell>
}