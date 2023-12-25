import { Card, Divider, Text } from "@mantine/core";

export const CardComponent = ({ title = "", description = "" }) => {
	return (
		<Card
			style={{
				cursor: "pointer",
				padding: 20,
				":hover": {
					boxShadow: "0 0 0 2px #3b82f6",
				},
				transition: "box-shadow 0.2s ease-in-out",
			}}
		>
			<Text fw={500} size="lg">
				{title}
			</Text>
			<Divider style={{ marginBottom: 10 }} />
			<Text fw={300} size="sm">
				{description}
			</Text>
		</Card>
	);
};
