import { Center, SimpleGrid, Text, useMantineTheme } from "@mantine/core";
import { PropsWithChildren } from "react";

export const Section = ({
	children,
	title,
}: PropsWithChildren<{ title: string }>) => {
	const theme = useMantineTheme();
	return (
		<>
			<Center mt={20}>
				<Text fw={800} fz="xl" c={theme.colors.gray[4]}>
					{title}
				</Text>
			</Center>
			<SimpleGrid
				cols={{ base: 1, md: 2, lg: 3 }}
				spacing={{ base: "md", md: "lg" }}
				verticalSpacing={{ base: "md", md: "lg" }}
				style={{ margin: "20px 0px", alignItems: "stretch" }}
				maw={{ base: 960, md: 960, lg: 960 }}
			>
				{children}
			</SimpleGrid>
		</>
	);
};
