import { Flex, FlexProps } from "@mantine/core";

type Props = {
	children: React.ReactNode;
} & FlexProps;

export const Container = ({ children, ...props }: Props) => {
	return <Flex {...props}>{children}</Flex>;
};
