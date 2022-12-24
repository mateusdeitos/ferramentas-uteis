import { Anchor, ThemeIcon, useMantineTheme } from "@mantine/core"
import { IconExternalLink } from "@tabler/icons"

type Props = {
	href: string
	text?: string
}


export const ExternalLink = ({ href, text }: Props) => {
	const theme = useMantineTheme()
	return <Anchor href={href} target="_blank" display="flex" sx={{ flexDirection: "row", alignItems: "center" }}>
		<ThemeIcon size="sm" bg="transparent"><IconExternalLink color={theme.colors.blue[5]} /></ThemeIcon>&nbsp;{text ?? href}
	</Anchor>
}