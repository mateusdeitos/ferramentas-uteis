import { Divider, SimpleGrid } from "@mantine/core";
import { CardItem } from "../../components/Home/CardItem";
import { PageWrapper } from "../../components/PageWrapper";


export default function ConversorJson() {

	return <PageWrapper title="Conversor de JSON em diversos formatos">
		<Divider sx={{ margin: "10px 0" }} />
		<SimpleGrid cols={3} spacing="md" sx={{ margin: "20px 0px" }} breakpoints={[
			{ maxWidth: 980, cols: 3, spacing: 'md' },
			{ maxWidth: 755, cols: 2, spacing: 'sm' },
			{ maxWidth: 600, cols: 1, spacing: 'sm' },
		]}>
			<CardItem
				title="Converter print_r output para JSON"
				description="Ferramenta para converter o retorno do comando 'print_r' do PHP para JSON"
				href="/conversor-json/php-print_r-to-json"
			/>
			<CardItem
				title="Converter JSON para TypeScript"
				description="Ferramenta para converter um objeto JSON para tipagens em TypeScript"
				href="/conversor-json/json-to-typescript"
			/>
		</SimpleGrid>
	</PageWrapper>
}