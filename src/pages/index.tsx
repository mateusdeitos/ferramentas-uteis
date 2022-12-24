import { Divider } from "@mantine/core";
import { CardItem } from "../components/Home/CardItem";
import { Section } from "../components/Home/Section";
import { PageWrapper } from "../components/PageWrapper";
import React from "react";
import { JSONToPHPClasses } from "../components/ConversorJSON/JSONToPHPClasses";
import { JSONToTypescript } from "../components/ConversorJSON/JSONToTypescript";
import { PhpPrintRToJson } from "../components/ConversorJSON/PhpPrintRToJson";


export default function Home() {
	return (
		<PageWrapper title="Ferramentas úteis de diversas áreas">
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

type TMap = Record<string, {
	title: string,
	Component: React.FC
}>

export const appSections = [
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
	}
];
