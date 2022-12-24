export interface IGithubProfile {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: number;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
	name: string;
	company: string;
	blog: number;
	location: string;
	email?: number;
	hireable?: number;
	bio: string;
	twitter_username?: number;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
}