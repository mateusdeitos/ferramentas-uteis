import { useMemo, useState } from 'react';
import { AppShell, ColorSchemeProvider, Burger, Group, Header, MantineProvider, MediaQuery, Navbar, Text, useMantineTheme, ColorScheme, ActionIcon, useMantineColorScheme, MantineTheme, CSSObject, MantineThemeOverride, Breadcrumbs, Container } from '@mantine/core';
import Link from 'next/link'
import { useLocalStorageValue } from '@mantine/hooks';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useRouter } from 'next/router';
import { appSections } from '../pages';


export const PageWrapper: React.FC = ({ children }) => {
	const [persistedTheme, setPersistedTheme] = useLocalStorageValue<ColorScheme>({ key: 'theme', defaultValue: 'light' });
	const [colorScheme, setColorScheme] = useState<ColorScheme>(persistedTheme);
	const router = useRouter();
	const breadCrumbPaths = useMemo(() => {
		const currentPath = router.asPath.split("/").filter((path) => !!path);
		if (!currentPath.length) {
			return [];
		}


		return [
			{
				title: "Home",
				href: "/",
			},
			...currentPath.map((path, index) => {
				let title = path[0].toUpperCase() + path.slice(1);
				appSections.forEach(section => {
					section.items.forEach(item => {
						if (item.href === `/${path}`) {
							title = item.title;
						}
					})
				});

				return {
					title,
					href: `/${currentPath}`
				}
			})
		]
	}, [])
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
				<Shell>
					{!!breadCrumbPaths.length && (
						<Breadcrumbs separator=">" style={{ marginBottom: 20, alignItems: "baseline" }}>
							{breadCrumbPaths.map((path, index, self) => {
								if (index === self.length - 1) {
									return (
										<Text key={path.href} size="md" weight={600}>
											{path.title}
										</Text>
									)
								}
								return (
									<Link href={path.href} key={index}>{path.title}</Link>
								)
							})}
						</Breadcrumbs>
					)}
					<Container sx={theme => ({ ...styles(colorScheme).bg.sx(theme), paddingBottom: "2rem", paddingLeft: 0, paddingRight: 0 })}>
						{children}
					</Container>
				</Shell>
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
	shell: {
		sx: (theme: MantineTheme) => ({
			...styles(colorScheme).bg.sx(theme),
			maxWidth: 960,
			margin: "0 auto",
		}),
	},
	text: {
		sx: (theme: MantineTheme, isActive = false) => {

			let color = colorScheme === 'light' ? theme.colors.gray[9] : theme.colors.gray[0];
			if (isActive) {
				color = theme.colors.blue[8];
			}
			return {
				color,
				fontSize: theme.fontSizes.sm,
				fontWeight: "bold",
				cursor: 'pointer',
				":hover": {
					color: theme.colors.blue[8]
				},
				transition: 'color 0.2s ease-in-out',
			}
		}
	},
	header: {
		sx: (theme: MantineTheme): CSSObject => {
			return {
				color: colorScheme === 'light' ? theme.colors.gray[9] : theme.colors.gray[0],
				fontSize: theme.headings.sizes.h1.fontSize,
				cursor: 'pointer',
				":hover": {
					color: theme.colors.blue[8]
				},
				transition: 'color 0.2s ease-in-out',
			}
		}
	}
});

const Shell: React.FC = ({ children }) => {
	const { toggleColorScheme, colorScheme } = useMantineColorScheme();
	const [opened, setOpened] = useState(false);
	const theme = useMantineTheme();
	const { isMobile } = useBreakpoint();

	return <AppShell
		{...styles(colorScheme).shell}
		// navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
		navbarOffsetBreakpoint="sm"
		// fixed prop on AppShell will be automatically added to Header and Navbar
		fixed
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
							<Text sx={{
								...styles(colorScheme).header.sx(theme),
								fontSize: theme.headings.sizes[isMobile ? "h4" : "h1"].fontSize,
							}}
							>Ferramentas úteis</Text>
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