import { Anchor, ThemeIcon, useMantineTheme } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

type Props = {
	href: string;
	text?: string;
};

export const ExternalLink = ({ href, text }: Props) => {
	const theme = useMantineTheme();
	return (
		<Anchor
			href={href}
			target="_blank"
			display="flex"
			style={{ flexDirection: "row", alignItems: "center" }}
		>
			<ThemeIcon size="sm" bg="transparent" color={theme.colors.blue[5]}>
				<IconExternalLink />
			</ThemeIcon>
			&nbsp;{text ?? href}
		</Anchor>
	);
};
