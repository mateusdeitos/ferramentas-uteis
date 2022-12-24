import { Divider, Space, Title } from "@mantine/core";
import React from "react";
import { CardItem } from "../components/Home/CardItem";
import { Section } from "../components/Home/Section";
import { PageWrapper } from "../components/PageWrapper";


export default function Home() {
	return (
		<PageWrapper title="A handful of useful tools">
			<Title order={1}>A handful of useful tools to help you</Title>
			<Title order={6}>(At least I think they are useful 😁)</Title>
			<Space h="md" />
			<Divider />
			{appSections.map((section, index, self) => {
				return <React.Fragment key={section.title}>
					<Section title={section.title}>
						{section.items.map(item => {
							return <CardItem key={item.title} title={item.title} href={item.href} description={item.description} />
						})}
					</Section>
					{index !== self.length - 1 && <Divider />}
				</React.Fragment>
			})}
		</PageWrapper >
	);
}

export const appSections = [
	{
		id: "programming",
		title: "Programming 🖥️",
		items: [
			{
				title: "PHP's 'print_r' -> JSON",
				description: "Convert the output of PHP 'print_r' function to JSON",
				href: "/json-converter/php-print_r-to-json"
			},
			{
				title: "JSON -> Typescript",
				description: "Convert JSON to Typescript interfaces",
				href: "/json-converter/json-to-typescript"
			},
			{
				title: "JSON -> PHP DTO classes",
				description: "Convert JSON to PHP DTO classes",
				href: "/json-converter/json-to-php"
			},
		]
	},
	{
		id: "finance",
		title: "Finance 💰",
		items: [
			{
				title: "Interest calculator",
				description: "Calculate the final amount of a value applied to an interest rate or calculate the interest rate needed to reach a final amount",
				href: "/interest-calculator"
			},
			{
				title: "Interest rate conversion",
				description: "Convert interest rates between different periods",
				href: "/interest-rate-conversion"
			},
		]
	},
];
