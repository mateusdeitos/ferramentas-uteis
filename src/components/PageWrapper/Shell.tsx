import {
	AppShell,
	Flex,
	Group,
	Header,
	Text,
	useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { AuthorAvatar } from "../AuthorAvatar";
import { styles } from "./styles";
import { PropsWithChildren } from "react";

export const Shell = ({ children }: PropsWithChildren<{}>) => {
	const theme = useMantineTheme();
	const { isMobile } = useBreakpoint();

	return (
		<AppShell
			{...styles("dark", isMobile).shell}
			// navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
			navbarOffsetBreakpoint="sm"
			// fixed prop on AppShell will be automatically added to Header and Navbar
			fixed
			header={
				<Header height={70} p="md" {...styles("dark", isMobile).bg}>
					{/* Handle other responsive styles with MediaQuery component or createStyles function */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							height: "100%",
							margin: "0 auto",
							maxWidth: 960,
						}}
					>
						<Group
							p="md"
							position="apart"
							sx={{ width: "100%", alignItems: "center" }}
						>
							<Link href="/">
								<Text
									sx={{
										...styles("dark", isMobile).header.sx(theme),
										fontSize:
											theme.headings.sizes[isMobile ? "h3" : "h1"].fontSize,
									}}
								>
									🛠️ Utils
								</Text>
							</Link>
							<Link href="/about">
								<Flex
									direction="row"
									align="center"
									gap={16}
									sx={{ cursor: "pointer" }}
								>
									<AuthorAvatar size={isMobile ? "sm" : "md"} />
									<Text
										sx={{
											...styles("dark", isMobile).text.sx(theme),
											fontWeight: 400,
										}}
									>
										About me
									</Text>
								</Flex>
							</Link>
						</Group>
					</div>
				</Header>
			}
		>
			{children}
		</AppShell>
	);
};
