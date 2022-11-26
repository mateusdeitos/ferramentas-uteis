import { ActionIcon, Group, Radio, RadioGroup, Text } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { JurosForm } from "../../components/Juros";
import { ValorInputComponent } from "../../components/ValorInput";
import { PageWrapper } from "../../components/PageWrapper";
import { RadioGroupComponent } from "../../components/RadioGroup";
import { CalculateButton } from "../../components/CalculateButton";
import { useState } from "react";
import { IResult, ResultSection } from "../../components/ResultSection";
import { converterTaxaJuros } from "../../services/juros";
import { numeroBr } from "../../utils/formatters/numberFormat";

type FormData = {
	juros: number;
	periodo: "mes" | "ano";
}


export default function ConversaoJuros() {
	const form = useForm<FormData>({ defaultValues: { juros: 0, periodo: "mes" } });
	const [result, setResult] = useState<IResult | null>(null);

	const calcular = form.handleSubmit((values) => {
		const { juros, periodo } = values;
		const jurosConvertido = converterTaxaJuros(juros, periodo === 'mes' ? 'ano' : 'mes');
		setResult({
			juros: {
				descricao: `Taxa de juros resultante ${periodo === 'mes' ? 'anual' : 'mensal'}`,
				valor: numeroBr(jurosConvertido) + '%',
			},
		});
	});

	return <PageWrapper>
		<FormProvider {...form}>
			<Group>
				<ValorInputComponent
					name="juros"
					label="Taxa de juros"
					hideControls
					rules={{
						required: "A taxa de juros é obrigatório",
						min: {
							value: 0.01,
							message: "A taxa de juros deve ser maior que 0",
						}
					}}
				/>
				<RadioGroupComponent name="periodo" label="Tipo de período">
					<Radio value="mes">Mensal</Radio>
					<Radio value="ano">Anual</Radio>
				</RadioGroupComponent>
			</Group>

			<CalculateButton onClick={() => calcular()} />

			{!!result && <ResultSection result={result} />}
		</FormProvider>

	</PageWrapper>

}