import { CardItem } from "../components/Home/CardItem";
import { Section } from "../components/Home/Section";
import { PageWrapper } from "../components/PageWrapper";


export default function Home() {
	return (
		<PageWrapper>
			{sections.map(section => {
				return <Section key={section.title} title={section.title}>
					{section.items.map(item => {
						return <CardItem key={item.title} title={item.title} href={item.href} description={item.description} />
					})}
				</Section>
			})}
		</PageWrapper >
	);
}

const sections = [
	{
		title: "Financeiras 💰",
		items: [
			{
				title: "Cálculo de juros",
				description: "Calcule o montante final de um valor aplicado a uma taxa de juros ou calcule a taxa de juros necessária para atingir um montante final",
				href: "/juros"
			},
			{
				title: "Conversão de juros",
				description: "Converta juros anuais em mensais e vice-versa",
				href: "/conversao-juros"
			},
		]
	},
]

