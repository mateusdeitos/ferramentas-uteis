import { Avatar, MantineNumberSize } from "@mantine/core"
import { useGithubProfile } from "../hooks/queries/useGithubProfile"

type Props = {
	size: MantineNumberSize
	radius?: MantineNumberSize
}

export const AuthorAvatar = ({ size, radius = "xl" }: Props) => {
	const { data: avatar_url } = useGithubProfile({ select: (profile) => profile.avatar_url })
	return <Avatar
		src={avatar_url}
		alt="Mateus Deitos"
		radius={radius}
		size={size}
	>
		MD
	</Avatar>
}