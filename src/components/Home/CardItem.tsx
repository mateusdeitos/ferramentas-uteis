import { Card, Divider, Text } from "@mantine/core"
import Link from "next/link"
import { PropsWithChildren } from "react"

export const CardItem = ({ title, href, description }: PropsWithChildren<{ title: string, href: string, description: string }>) => {
	return <Link href={href}>
		<Card sx={{
			cursor: "pointer",
			padding: 20,
			":hover": {
				boxShadow: "0 0 0 2px #3b82f6",
			},
			transition: "box-shadow 0.2s ease-in-out",
		}}>
			<Text weight={500} size="lg">{title}</Text>
			<Divider sx={{ marginBottom: 10 }} />
			<Text weight={300} size="sm">{description}</Text>
		</Card>
	</Link>
}