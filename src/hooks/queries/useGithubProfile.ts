import { UseBaseQueryOptions, useQuery } from "@tanstack/react-query"
import { IGithubProfile } from "../../types/about"


export const useGithubProfile = <S = IGithubProfile>(options?: UseBaseQueryOptions<IGithubProfile, Error, S>) => {
	return useQuery<IGithubProfile, Error, S>({
		...options,
		queryKey: ["github-profile"],
		queryFn: async () => {
			const response = await fetch("https://api.github.com/users/mateusdeitos")
			const data = await response.json()
			return data
		},
		staleTime: Infinity,
	})
}
