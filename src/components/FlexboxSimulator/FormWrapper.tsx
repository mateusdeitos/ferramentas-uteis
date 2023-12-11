import { Flex, Text } from "@mantine/core";
import { PropsWithChildren } from "react";
import { ControlProps } from "./Control";

export const FormWrapper = ({
	children,
	label,
}: PropsWithChildren<Pick<ControlProps<any>, "label">>) => {
	return (
		<Flex gap={8} direction="column">
			<Text size="sm" fw={500} mt={3}>
				{label}
			</Text>
			{children}
		</Flex>
	);
};
