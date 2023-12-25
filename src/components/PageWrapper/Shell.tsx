import {
	Anchor,
	AppShell,
	Flex,
	Group,
	Text,
	useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { AuthorAvatar } from "../AuthorAvatar";
import { PropsWithChildren } from "react";
import { useThemeValue } from "../../hooks/useThemeValue";

export const Shell = ({ children }: PropsWithChildren<{}>) => {
	const theme = useMantineTheme();
	const { isMobile } = useBreakpoint();
	const v = useThemeValue();

	const bg = v(theme.colors.gray[1], theme.colors.gray[7]);

	return (
		<AppShell
			header={{ height: 70, collapsed: false, offset: true }}
			padding="lg"
			bg={bg}
		>
			<AppShell.Header bg={bg}>
				<Group
					justify="space-between"
					align="center"
					maw={960}
					h="100%"
					m="0 auto"
				>
					<Anchor component={Link} href="/">
						<Text
							style={{
								fontSize: theme.headings.sizes[isMobile ? "h3" : "h1"].fontSize,
							}}
						>
							🛠️ Utils
						</Text>
					</Anchor>
					<Anchor component={Link} href="/about">
						<Flex
							direction="row"
							align="center"
							gap={16}
							style={{ cursor: "pointer" }}
						>
							<AuthorAvatar size={isMobile ? "sm" : "md"} />
							<Text
								style={{
									fontWeight: 400,
								}}
							>
								About me
							</Text>
						</Flex>
					</Anchor>
				</Group>
			</AppShell.Header>
			<AppShell.Main
				bg={bg}
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					margin: "0 auto",
					width: "100%",
				}}
			>
				{children}
			</AppShell.Main>
		</AppShell>
	);
};
