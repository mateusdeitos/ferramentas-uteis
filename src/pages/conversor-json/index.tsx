import { Divider, SimpleGrid } from "@mantine/core";
import { JSONToPHPClasses } from "../../components/ConversorJSON/JSONToPHPClasses";
import { JSONToTypescript } from "../../components/ConversorJSON/JSONToTypescript";
import { PhpPrintRToJson } from "../../components/ConversorJSON/PhpPrintRToJson";
import { CardItem } from "../../components/Home/CardItem";
import { PageWrapper } from "../../components/PageWrapper";

type TMap = Record<string, {
	title: string,
	description: string,
	Component: React.FC
}>

export const mapComponentsConversaoJson: TMap = {
	"php-print_r-to-json": {
		title: "Converter print_r output para JSON",
		description: "Ferramenta para converter o retorno do comando 'print_r' do PHP para JSON",
		Component: PhpPrintRToJson
	},
	"json-to-typescript": {
		title: "Converter JSON para TypeScript",
		description: "Ferramenta para converter um objeto JSON para tipagens em TypeScript",
		Component: JSONToTypescript
	},
	"json-to-php": {
		title: "Converter JSON para Classes em PHP",
		description: "Ferramenta para converter um objeto JSON para classes em PHP",
		Component: JSONToPHPClasses
	}
}

export default function ConversorJson() {

	return <PageWrapper title="Conversor de JSON em diversos formatos">
		<Divider sx={{ margin: "10px 0" }} />
		<SimpleGrid cols={3} spacing="md" sx={{ margin: "20px 0px" }} breakpoints={[
			{ maxWidth: 980, cols: 3, spacing: 'md' },
			{ maxWidth: 755, cols: 2, spacing: 'sm' },
			{ maxWidth: 600, cols: 1, spacing: 'sm' },
		]}>
			{Object.entries(mapComponentsConversaoJson).map(([href, { title, description }]) =>
				<CardItem
					key={href}
					title={title}
					description={description}
					href={`conversor-json/${href}`}
				/>
			)}
		</SimpleGrid>
	</PageWrapper>
}