import { Card, Divider, Space, Group, Text, Flex } from "@mantine/core";
import { PropsWithChildren } from "react";

export interface IResult {
	[key: string]: {
		descricao: string;
		valor: number | string;
	};
}

interface ResultSectionProps {
	result: IResult;
	title?: string;
}

export const ResultSection = ({
	title = "Result",
	result,
}: PropsWithChildren<ResultSectionProps>) => {
	return (
		<Card>
			<Card.Section sx={{ padding: "1rem 1rem 0 1rem" }}>
				<Text weight={500} size="xl">
					{title}
				</Text>
				<Divider />
				<Space h="md" />
			</Card.Section>
			<Card.Section>
				<Flex direction="column" sx={{ padding: "0 1rem 0.5rem 1rem" }}>
					{result &&
						Object.entries(result).map(([key, { descricao, valor }]) => {
							return (
								<Group key={key}>
									<Text size="md" weight={300}>
										{descricao}:
									</Text>
									<Text size="sm">{valor}</Text>
								</Group>
							);
						})}
				</Flex>
			</Card.Section>
		</Card>
	);
};
