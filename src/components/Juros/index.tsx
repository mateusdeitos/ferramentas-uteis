import { Divider, Group, Radio, Space, Text } from '@mantine/core';
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from 'react-hook-form';
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useInputSize } from '../../hooks/useInputSize';
import { converterTaxaJuros } from '../../services/conversao-juros';
import { calcularMontanteFinal, calcularTaxaJuros } from "../../services/juros";
import { numeroBr } from "../../utils/formatters/numberFormat";
import { CalculateButton } from '../CalculateButton';
import { IResult, ResultSection } from '../ResultSection';
import { MontanteFinalForm } from "./MontanteFinalForm";
import { TaxaJurosForm } from "./TaxaJurosForm";

export interface IJurosForm {
	periodo: number;
	valorInicial: number;
	taxaJuros: number;
	tipoPeriodo: "monthly" | "yearly";
	montanteFinal: number;
	modoCalculo: "taxaJuros" | "montanteFinal";
	saldoDevedor: number;
	valorAmortizar: number;
	parcelasRestantes: number;
}

export const JurosForm: React.FC = () => {
	const { isMobile } = useBreakpoint();
	const [result, setResult] = useState<IResult | null>(null);
	const size = useInputSize();

	const form = useForm<IJurosForm>({
		defaultValues: {
			tipoPeriodo: "monthly",
			periodo: 12,
			modoCalculo: "montanteFinal",
		},
	});
	const { watch, setFocus, setValue, handleSubmit } = form;

	const modoCalculo = watch("modoCalculo");
	const tipoPeriodoSelecionado = watch("tipoPeriodo");
	const taxaJuros = watch("taxaJuros");

	const handleCalculo = handleSubmit((values) => {
		const { montanteFinalCalculado } = calcularMontanteFinal(values);

		setResult({
			montanteFinal: {
				descricao: "Montante final",
				valor: numeroBr(montanteFinalCalculado),
			},
		});
	});

	const handleCalculoTaxaJuros = handleSubmit((values) => {
		const { taxaJurosCalculada } = calcularTaxaJuros(values);
		const pluralPeriodo = values.tipoPeriodo === "monthly" ? "months" : "years";
		setResult({
			taxaJuros: {
				descricao: "Interest rate",
				valor: numeroBr(taxaJurosCalculada * 100) + "%" + values.tipoPeriodo,
			},
			rendimento: {
				descricao: `$ ${numeroBr(values.valorInicial)} at a interest rate of ${numeroBr(taxaJurosCalculada * 100)}% for ${values.periodo} ${pluralPeriodo}`,
				valor: "$ " + numeroBr(values.montanteFinal)
			}
		});
	})

	useEffect(() => {
		if (!isMobile) {
			setFocus("valorInicial");
		}

		setResult(null);
	}, [modoCalculo]);

	useEffect(() => {
		if (!!taxaJuros) {
			const convertido = converterTaxaJuros(Number(taxaJuros), tipoPeriodoSelecionado == 'yearly' ? 'yearly' : 'monthly');
			setValue("taxaJuros", convertido[tipoPeriodoSelecionado]);
		}
	}, [tipoPeriodoSelecionado])

	return <FormProvider {...form}>
		<Text size="xl">Interest rate calculator</Text>
		<Divider sx={{ marginBottom: "1rem" }} />
		<Group>
			<Radio.Group
				label="What do you want to calculate"
				orientation="horizontal"
				size={size}
				value={form.watch("modoCalculo")}
				onChange={(value) => form.setValue("modoCalculo", value as IJurosForm["modoCalculo"])}
			>
				<Radio value="taxaJuros" label="Interest rate" />
				<Radio value="montanteFinal" label="Final amount" />
			</Radio.Group>
		</Group>
		<Space h="md" />
		<Divider />
		<Space h="md" />

		{modoCalculo === 'montanteFinal' && <MontanteFinalForm />}
		{modoCalculo === 'taxaJuros' && <TaxaJurosForm />}

		<CalculateButton withHotkey onClick={modoCalculo === 'montanteFinal' ? handleCalculo : handleCalculoTaxaJuros}>
			Calcular
		</CalculateButton>
		<Space h="md" />

		{
			!!result && (
				<ResultSection result={result} />
			)
		}
	</FormProvider >
}

