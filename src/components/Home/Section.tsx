import { Center, SimpleGrid, Divider, Text } from "@mantine/core"
import { PropsWithChildren } from "react"

export const Section = ({ children, title }: PropsWithChildren<{ title: string }>) => {
	return (
		<>
			<Center sx={{ margin: "20px 50px" }}>
				<Text weight={800} size="xl">{title}</Text>
			</Center>
			<SimpleGrid cols={3} spacing="md" sx={{ margin: "20px 50px" }} breakpoints={[
				{ maxWidth: 980, cols: 3, spacing: 'md' },
				{ maxWidth: 755, cols: 2, spacing: 'sm' },
				{ maxWidth: 600, cols: 1, spacing: 'sm' },
			]}>
				{children}
			</SimpleGrid>
			<Divider />
		</>
	)
}