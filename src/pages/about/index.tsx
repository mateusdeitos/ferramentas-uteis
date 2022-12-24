import { Anchor, Button, Divider, Drawer, Flex, LoadingOverlay, Text, ThemeIcon, Title } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons";
import { isValidElement, ReactNode } from "react";
import { AuthorAvatar } from "../../components/AuthorAvatar";
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
					<InfoGroup>
						{!!profile?.html_url && (
							<InfoSocialMedia
								Icon={<ThemeIcon size="md" color="dark"><IconBrandGithub /></ThemeIcon>}
								label="Github"
								href={profile.html_url}
							/>
						)}
						<InfoSocialMedia
							Icon={<ThemeIcon size="md" color="blue"><IconBrandLinkedin /></ThemeIcon>}
							label="Linkedin"
							href="https://www.linkedin.com/in/mateus-deitos/"
						/>
					</InfoGroup>
					{!!profile?.repos_url && <Info label="My Github Repositores" value={<LinkDrawerRepositories {...profile} />} />}
					<Divider w="100%" />
					<InfoGroup>
						{!!profile?.company && <Info label="Company" value={profile.company} />}
						{!!profile?.location && <Info label="Location" value={profile.location} />}
					</InfoGroup>
					<Divider w="100%" />
					{!!profile?.bio && <Info label="Bio" value={profile.bio} />}
					<Divider w="100%" />
					<InfoGroup>
						{!!profile?.following && <Info label="Following" value={profile.following} />}
						{!!profile?.followers && <Info label="Followers" value={profile.followers} />}
					</InfoGroup>
				</>
			)}
		</Flex>
	</PageWrapper>
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
		<Button variant="subtle" color="blue" radius="xs" compact onClick={() => toggle(true)}>
			{repos?.length} public
		</Button>
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
						return <CardRepository {...repo} />
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

const InfoSocialMedia = ({ Icon, label, href }: { Icon: ReactNode; label: string; href: string }) => {
	return <Info label={(
		<Flex direction="row">
			{Icon}&nbsp;{label}
		</Flex>
	)} value={(
		<Anchor href={href} target="_blank">
			{href}
		</Anchor>
	)} />
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

