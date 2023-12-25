"use client";
import { Flex } from "@mantine/core";
import Head from "next/head";
import { PropsWithChildren } from "react";
import { BreadCrumbs } from "./BreadCrumbs";
import { Shell } from "./Shell";

export const PageWrapper = ({
	children,
	title,
}: PropsWithChildren<{ title: string }>) => {
	return (
		<>
			<Head>
				<title>{title}</title>
				<meta property="og:title" content={title} key="title" />
			</Head>
			<Shell>
				<Flex
					direction="column"
					mx="md"
					px={0}
					w="100%"
					maw={960}
					justify="start"
				>
					<BreadCrumbs title={title} />
					{children}
				</Flex>
			</Shell>
		</>
	);
};
