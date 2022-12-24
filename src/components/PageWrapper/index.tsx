import { Container } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import Head from 'next/head';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { BreadCrumbs } from './BreadCrumbs';
import { Shell } from './Shell';
import { styles } from './styles';

export const PageWrapper: React.FC<{ title: string }> = ({ children, title }) => {
	const { isMobile } = useBreakpoint();
	return (
		<NotificationsProvider>

			<Head>
				<title>{title}</title>
				<meta property="og:title" content={title} key="title" />
			</Head>
			<Shell>
				<BreadCrumbs title={title} />
				<Container sx={theme => ({ ...styles("dark", isMobile).bg.sx(theme), paddingBottom: "2rem", paddingLeft: 0, paddingRight: 0 })}>
					{children}
				</Container>
			</Shell>
		</NotificationsProvider>
	);
}


