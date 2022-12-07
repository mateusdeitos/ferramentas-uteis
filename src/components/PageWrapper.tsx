import { ActionIcon, Anchor, AppShell, Breadcrumbs, Burger, ColorScheme, ColorSchemeProvider, Container, CSSObject, Group, Header, MantineProvider, MantineTheme, MantineThemeOverride, MediaQuery, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { appSections } from '../pages';


export const PageWrapper: React.FC<{ title: string }> = ({ children, title }) => {
	return (
		<NotificationsProvider>

			<Head>
				<title>{title}</title>
				<meta property="og:title" content={title} key="title" />
			</Head>
			<Shell>
				<BreadCrumbs title={title} />
				<Container sx={theme => ({ ...styles("dark").bg.sx(theme), paddingBottom: "2rem", paddingLeft: 0, paddingRight: 0 })}>
					{children}
				</Container>
			</Shell>
		</NotificationsProvider>
	);
}

const BreadCrumbs = ({ title = "" }) => {
	const router = useRouter();
	const pagePath = router.asPath;
	const pageTitle = useMemo(() => {
		if (!!title) return title;
		if (typeof document === 'undefined') {
			return undefined;
		}

		const _title = document.querySelector("title")?.textContent ?? "";
		if (_title?.toLowerCase() == "page title") {
			return undefined;
		}

		return _title;
	}, [title]);

	const breadCrumbPaths = useMemo(() => {
		const mapHrefTitle: Record<string, string> = appSections.reduce((acc, section) => {
			return {
				...acc,
				...section.items.reduce((acc, item) => {
					return {
						...acc,
						[item.href.slice(1)]: item.title
					}
				}, {})
			}
		}, {})

		const currentPath = pagePath.split("/")
			.map(path => {
				if (!path) return "";

				if (path.startsWith("[") && path.endsWith("]")) {
					path = path.replace("[", "").replace("]", "")
					const value = router.query[path] ?? "";
					return Array.isArray(value) ? value.join("/") : value;
				}

				return path;
			})
			.filter(Boolean)
			.reduce<Array<{ title: string; href: string }>>((acc, currentPath, index) => {
				const title = mapHrefTitle[currentPath] ??
					pageTitle ??
					currentPath[0].toUpperCase() + currentPath.slice(1);
				if (index === 0) {
					return [{ title, href: currentPath }]
				}

				const previousPath = acc.at(-1)?.href ?? "";
				const href = `${previousPath}/${currentPath}`;

				return [...acc, { title, href }]

			}, [])

		if (!currentPath.length) {
			return [];
		}

		return [
			{ title: "Home", href: "/" },
			...currentPath
		];
	}, [pagePath, pageTitle]);

	if (!breadCrumbPaths.length) {
		return null;
	}

	return <Breadcrumbs separator=">" style={{ marginBottom: 20, alignItems: "baseline" }}>
		{breadCrumbPaths.map((path, index, self) => {
			if (index === self.length - 1) {
				return (
					<Text key={index} tabIndex={-1} size="md" weight={600}>
						{path.title}
					</Text>
				)
			}
			return (
				<Link passHref href={"/" + path.href} key={index}>
					<Anchor href={"/" + path.href} tabIndex={-1} size="md" weight={600}>
						{path.title}
					</Anchor>
				</Link>
			)
		})}
	</Breadcrumbs>
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
	const [opened, setOpened] = useState(false);
	const theme = useMantineTheme();
	const { isMobile } = useBreakpoint();

	return <AppShell
		{...styles("dark").shell}
		// navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
		navbarOffsetBreakpoint="sm"
		// fixed prop on AppShell will be automatically added to Header and Navbar
		fixed
		header={
			<Header height={70} p="md" {...styles("dark").bg}>
				{/* Handle other responsive styles with MediaQuery component or createStyles function */}
				<div style={{ display: 'flex', alignItems: 'center', height: '100%', margin: "0 auto", maxWidth: 960 }}>
					<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
						<Burger
							opened={opened}
							onClick={() => setOpened((o) => !o)}
							size="sm"
							color={theme.colors.gray[6]}
							mr="xl"
						/>
					</MediaQuery>

					<Group p="md" position="apart" sx={{ width: '100%' }}>
						<Link href="/">
							<Text sx={{
								...styles("dark").header.sx(theme),
								fontSize: theme.headings.sizes[isMobile ? "h4" : "h1"].fontSize,
							}}
							>Ferramentas úteis</Text>
						</Link>
						{/* <ActionIcon
							variant="filled"
							color={colorScheme === 'dark' ? 'yellow' : 'blue'}
							onClick={() => toggleColorScheme()}
							title="Toggle color scheme"
						>
							{colorScheme === 'dark' ? '☀️' : '🌙'}
						</ActionIcon> */}
					</Group>
				</div>
			</Header>
		}
	>
		{children}
	</AppShell>
}