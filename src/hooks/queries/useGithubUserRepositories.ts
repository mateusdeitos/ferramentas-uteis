import {
	UseBaseQueryOptions,
	UseQueryOptions,
	useQuery,
} from "@tanstack/react-query";
import { IGithubUserRepository } from "../../types/about";

export const useGithubUserRepositories = <S = IGithubUserRepository[]>(
	options?: Omit<UseQueryOptions<IGithubUserRepository[], Error, S>, "queryKey">
) => {
	return useQuery<IGithubUserRepository[], Error, S>({
		...options,
		queryKey: ["github-profile-repositories"],
		queryFn: async () => {
			const response = await fetch(
				"https://api.github.com/users/mateusdeitos/repos"
			);
			const data = await response.json();
			return data;
		},
		staleTime: Infinity,
	});
};
