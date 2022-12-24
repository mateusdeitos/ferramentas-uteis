import { Group } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { PageWrapper } from "../../components/PageWrapper";
import { ValorInputComponent } from "../../components/ValorInput";
import { converterTaxaJuros } from "../../services/conversao-juros";
import { ConversaoJurosTypes } from "../../types/conversao-juros";

type FormData = {
	juros: Record<ConversaoJurosTypes.TPeriodoTaxa, number>;
}

const periodoOptions: { periodo: ConversaoJurosTypes.TPeriodoTaxa, label: string, symbol: string }[] = [
	{ periodo: 'daily', label: 'Daily', symbol: 'daily' },
	{ periodo: 'monthly', label: 'Monthly', symbol: "monthly" },
	{ periodo: 'six-monthly', label: 'Six Monthly', symbol: "six monthly" },
	{ periodo: 'yearly', label: 'Yearly', symbol: "yearly" },
]

export default function ConversaoJuros() {
	const form = useForm<FormData>({
		defaultValues: {
			juros: {
				daily: 0,
				monthly: 0,
				yearly: 0,
				"six-monthly": 0,
			}
		}
	});

	const updateValues = (periodoAtual: ConversaoJurosTypes.TPeriodoTaxa) => {
		const value = form.getValues().juros[periodoAtual];
		if (!value) return;

		periodoOptions
			.filter((option) => option.periodo !== periodoAtual)
			.forEach(({ periodo }) => {
				const conversao = converterTaxaJuros(value, periodoAtual);
				form.setValue(`juros.${periodo}`, conversao[periodo])
			});

	}

	return <PageWrapper title="Interest rate conversion">
		<FormProvider {...form}>
			{periodoOptions.map(({ periodo, label }) => (
				<Group key={periodo} sx={{ marginBottom: 16 }}>
					<ValorInputComponent
						name={`juros.${periodo}`}
						label={`Interest rate ${label} (%)`}
						step={0.25}
						onChange={() => updateValues(periodo)}
						onKeyPress={(e) => {
							if (e.key === 'Enter') {
								updateValues(periodo);
							}
						}}
					/>
				</Group>
			))}
		</FormProvider>
	</PageWrapper>

}