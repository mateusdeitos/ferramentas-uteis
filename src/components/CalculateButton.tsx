import { Button, ButtonProps, Divider, Group, Space } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import React, { PropsWithChildren } from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";

type Props = ButtonProps & {
	onClick: (e: any) => void;
	withHotkey?: true;
};

export const CalculateButton = ({
	children,
	withHotkey,
	...props
}: PropsWithChildren<Props>) => {
	const { isMobile } = useBreakpoint();
	const { onClick = () => {} } = props;

	useHotkeys([
		[
			"mod+Enter",
			() => {
				withHotkey && onClick({} as React.MouseEvent<HTMLButtonElement>);
			},
		],
	]);

	return (
		<>
			<Space h="md" />
			<Divider />
			<Space h="md" />
			<Group>
				<Button {...props}>
					{children}
					{!isMobile && withHotkey ? " (Ctrl+Enter)" : ""}
				</Button>
			</Group>
		</>
	);
};
