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
	{ periodo: 'dia', label: 'Diário', symbol: 'ao dia' },
	{ periodo: 'mes', label: 'Mensal', symbol: "ao mês" },
	{ periodo: 'semestre', label: 'Semestral', symbol: "ao semestre" },
	{ periodo: 'ano', label: 'Anual', symbol: "ao ano" },
]

export default function ConversaoJuros() {
	const form = useForm<FormData>({
		defaultValues: {
			juros: {
				dia: 0,
				mes: 0,
				ano: 0,
				semestre: 0,
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

	return <PageWrapper>
		<FormProvider {...form}>
			{periodoOptions.map(({ periodo, label }) => (
				<Group key={periodo} sx={{ marginBottom: 16 }}>
					<ValorInputComponent
						name={`juros.${periodo}`}
						label={`Taxa de juros ${label} (%)`}
						step={0.25}
						onBlur={() => updateValues(periodo)}
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