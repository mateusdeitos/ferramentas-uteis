import { Anchor, Card, Divider, Text, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";
import classes from "./CardItem.module.css";
import { useThemeValue } from "../../hooks/useThemeValue";

type Props = PropsWithChildren<{
	title: string;
	href: string;
	external?: boolean;
	description: string;
}>;

export const CardItem = ({
	title,
	href,
	description,
	external = false,
}: Props) => {
	const theme = useMantineTheme();
	const v = useThemeValue();

	const bg = v(theme.colors.gray[3], theme.colors.gray[9]);
	const linkProps = external ? { target: "_blank" } : { component: Link };
	return (
		<Anchor href={href} {...linkProps}>
			<Card bg={bg} className={classes.cardItem}>
				<Text fw={500} fz="lg" c={theme.colors.gray[4]}>
					{title}
				</Text>
				<Divider style={{ marginBottom: 10 }} />
				<Text fw={300} fz="sm" c={theme.colors.gray[4]}>
					{description}
				</Text>
			</Card>
		</Anchor>
	);
};
