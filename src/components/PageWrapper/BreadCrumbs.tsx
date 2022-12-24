import { Anchor, Breadcrumbs, Sx, Text } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { appSections } from '../../pages';

export const BreadCrumbs = ({ title = "" }) => {
	const router = useRouter();
	const pagePath = router.asPath;
	const pageTitle = useMemo(() => {
		if (!!title)
			return title;
		if (typeof document === 'undefined') {
			return undefined;
		}

		const _title = document.querySelector("title")?.textContent ?? "";
		if (_title?.toLowerCase() == "page title") {
			return undefined;
		}

		return _title;
	}, [title]);

	const breadCrumbPaths = useMemo(() => {
		const mapHrefTitle: Record<string, string> = appSections.reduce((acc, section) => {
			return {
				...acc,
				...section.items.reduce((acc, item) => {
					return {
						...acc,
						[item.href.slice(1)]: item.title
					};
				}, {})
			};
		}, {});

		const paths = pagePath.split("/");

		const currentPath: Array<{ title: string; href: string; }> = [paths.at(0), paths.at(-1)]
			.map(path => {
				if (!path)
					return "";

				if (path.startsWith("[") && path.endsWith("]")) {
					path = path.replace("[", "").replace("]", "");
					const value = router.query[path] ?? "";
					return Array.isArray(value) ? value.join("/") : value;
				}

				return path;
			})
			.filter(Boolean)
			.reduce<Array<{ title: string; href: string; }>>((acc, currentPath, index) => {
				const title = mapHrefTitle[currentPath] ??
					pageTitle ??
					currentPath[0].toUpperCase() + currentPath.slice(1);
				if (index === 0) {
					return [{ title, href: currentPath }];
				}

				const previousPath = acc.at(-1)?.href ?? "";
				const href = `${previousPath}/${currentPath}`;

				return [...acc, { title, href }];

			}, []);

		if (!currentPath.length) {
			return [];
		}

		return [
			{ title: "Home", href: "/" },
			...currentPath
		];
	}, [pagePath, pageTitle]);

	if (!breadCrumbPaths.length) {
		return null;
	}

	return <Breadcrumbs separator=">" style={{ marginBottom: 20, alignItems: "baseline" }}>
		{breadCrumbPaths.map((path, index, self) => {
			const sx: Sx = theme => ({
				fontWeight: 600,
				[`@media (max-width: ${theme.breakpoints.md}px)`]: {
					fontSize: theme.fontSizes.md
				},
				[`@media (max-width: ${theme.breakpoints.xs}px)`]: {
					fontSize: theme.fontSizes.xs
				},
			});

			if (index === self.length - 1) {
				return (
					<Text key={index} tabIndex={-1} sx={sx}>
						{path.title}
					</Text>
				);
			}
			return (
				<Link passHref href={"/" + path.href} key={index}>
					<Anchor href={"/" + path.href} tabIndex={-1} sx={sx}>
						{path.title}
					</Anchor>
				</Link>
			);
		})}
	</Breadcrumbs>;
};
