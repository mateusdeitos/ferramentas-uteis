import { Button, ButtonProps, Divider, Group, Space } from '@mantine/core';
import { useHotkeys } from "@mantine/hooks";
import React from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";

export const CalculateButton: React.FC<ButtonProps<'button'>> = ({ children, ...props }) => {
	const { isMobile } = useBreakpoint();
	const { onClick = () => { } } = props;

	useHotkeys([
		['mod+Enter', () => onClick({} as React.MouseEvent<HTMLButtonElement>)],
	]);
	return <>
		<Space h="md" />
		<Divider />
		<Space h="md" />
		<Group>
			<Button {...props}>
				Calcular{!isMobile ? " (Ctrl+Enter)" : ""}
				{children}
			</Button>
		</Group>
	</>;
};
