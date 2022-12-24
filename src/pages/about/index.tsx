import { Anchor, Button, Divider, Drawer, Flex, LoadingOverlay, MantineColor, Text, ThemeIcon, Title, useMantineTheme } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons";
import { isValidElement, ReactNode } from "react";
import { AuthorAvatar } from "../../components/AuthorAvatar";
import { ExternalLink } from "../../components/ExternalLink";
import { CardItem } from "../../components/Home/CardItem";
import { PageWrapper } from "../../components/PageWrapper";
import { useGithubProfile } from "../../hooks/queries/useGithubProfile";
import { useGithubUserRepositories } from "../../hooks/queries/useGithubUserRepositories";
import { IGithubProfile, IGithubUserRepository } from "../../types/about";


export default function About() {
	const { data: profile, isLoading, isSuccess, isError, error } = useGithubProfile();
	return <PageWrapper title="About">
		<LoadingOverlay visible={isLoading} />

		<Flex direction="column" gap={16} align="flex-start" sx={{ maxWidth: 600, margin: "0 auto" }}>
			{isError && (
				<>
					<Title order={3} style={{ textAlign: "center" }}>
						Failed to load profile
					</Title>
					<Title order={6} style={{ textAlign: "center" }}>
						{error?.message}
					</Title>
				</>
			)}
			{isSuccess && (
				<>
					{!!profile?.avatar_url && (
						<Flex align="center" m="0 auto" direction="column">
							<AuthorAvatar size={200} radius={200} />
						</Flex>
					)}

					<Divider w="100%" />

					{!!profile?.name && <Info label="Name" value={profile.name} />}

					<Divider w="100%" />

					{!!profile?.bio && <Info label="Bio" value={profile.bio} />}

					<Divider w="100%" />

					{!!profile?.repos_url && <Info label="My Github Repositores" value={<LinkDrawerRepositories {...profile} />} />}

					<Divider w="100%" />

					<InfoGroup>
						{!!profile?.company && <Info label="Company" value={profile.company} />}
						{!!profile?.location && <Info label="Location" value={profile.location} />}
						{!!profile?.following && <Info label="Following (Github)" value={profile.following} />}
						{!!profile?.followers && <Info label="Followers (Github)" value={profile.followers} />}
					</InfoGroup>

					<Divider w="100%" />

					<Title order={4}>Contact</Title>
					<InfoGroup>
						{!!profile?.html_url && (
							<InfoSocialMedia
								Icon={<ThemeIcon size="md" color="dark"><IconBrandGithub /></ThemeIcon>}
								label="Github"
								color="dark"
								href={profile.html_url}
							/>
						)}
						<InfoSocialMedia
							Icon={<ThemeIcon size="md" color="blue"><IconBrandLinkedin /></ThemeIcon>}
							label="LinkedIn"
							color="blue"
							href="https://www.linkedin.com/in/mateus-deitos/"
						/>
					</InfoGroup>

					<Divider w="100%" />

					<Title order={4}>Other projects</Title>
					<InfoGroup>
						<InfoProject
							name="Stravando"
							url="https://stravando.mateusdeitos.dev"
							description="Stravando is a web application that allows you to see compare your Strava milestones with known distances in order to keep your motivation in your training."
						/>
					</InfoGroup>
				</>
			)}
		</Flex>
	</PageWrapper>
}

const InfoProject = ({ name, url, description }: { name: string, url: string, description: string }) => {
	const theme = useMantineTheme();
	return (
		<Info label={<Text size="lg" weight={600}>{name}</Text>} value={(
			<Flex direction="column" gap={8}>
				<ExternalLink href={url} />
				<Text size="sm">
					{description}
				</Text>
			</Flex>
		)} />
	)
}

const LinkDrawerRepositories = ({ repos_url }: IGithubProfile) => {
	const [isOpen, toggle] = useToggle();
	const { data: repos, isLoading, isError, isSuccess } = useGithubUserRepositories({
		enabled: !!repos_url,
		select: (repos) => {
			return repos.sort((repo1, repo2) => {
				return new Date(repo2.updated_at).getTime() - new Date(repo1.updated_at).getTime();
			}).filter(repo => !repo.fork)
		}
	});

	if (!repos_url) {
		return null;
	}

	return <>
		<Anchor onClick={() => toggle(true)}>
			{repos?.length} public
		</Anchor>
		<Drawer
			padding="xl"
			position="right"
			size="xl"
			title="Public repositories"
			opened={isOpen}
			onClose={() => toggle(false)}
			styles={{
				drawer: {
					height: "100%",
					overflowY: "auto",
				}
			}}
		>
			{isLoading && <LoadingOverlay visible={isLoading} />}
			{isError && <Title order={3}>Failed to load repositories</Title>}
			{isSuccess && (
				<Flex direction="row" gap={8} wrap="wrap" align="flex-start">
					{repos?.map((repo) => {
						return <CardRepository key={repo.id} {...repo} />
					})}
				</Flex>
			)}
		</Drawer>
	</>
}

const CardRepository = ({ html_url, description, name }: IGithubUserRepository) => {
	return <CardItem
		key={html_url}
		external
		href={html_url}
		description={description}
		title={name}
	/>
}

const InfoSocialMedia = ({ Icon, label, href, color }: { Icon: ReactNode; href: string, color: MantineColor, label: string }) => {
	return <Button component="a" title={label} color={color} variant="filled" href={href} target="_blank">
		{Icon}&nbsp;{label}
	</Button>
}

const InfoGroup = ({ children }: { children: ReactNode }) => {
	return <Flex gap={36} align="center" justify="flex-start" w="100%">
		{children}
	</Flex>
}

const Info = ({ label, value }: { label: ReactNode; value: ReactNode }) => {
	return <Flex direction="column" gap={2} align="flex-start" mb={8}>
		{isValidElement(label) ? label : <Text size="sm">{label}</Text>}
		{isValidElement(value) ? value : <Text size="md" weight={600}>{value}</Text>}
	</Flex>
}

