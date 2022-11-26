import { Card, Divider, Group, Radio, Space, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from 'react-hook-form';
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { calcularMontanteFinal, calcularTaxaJuros, converterTaxaJuros } from "../../services/juros";
import { numeroBr } from "../../utils/formatters/numberFormat";
import { CalculateButton } from '../CalculateButton';
import { MontanteFinalForm } from "./MontanteFinalForm";
import { RadioGroupComponent } from "../RadioGroup";
import { TaxaJurosForm } from "./TaxaJurosForm";
import { IResult, ResultSection } from '../ResultSection';

export interface IJurosForm {
	periodo: number;
	valorInicial: number;
	taxaJuros: number;
	tipoPeriodo: "mes" | "ano";
	montanteFinal: number;
	modoCalculo: "taxaJuros" | "montanteFinal";
	saldoDevedor: number;
	valorAmortizar: number;
	parcelasRestantes: number;
}



export const JurosForm: React.FC = () => {
	const { isMobile } = useBreakpoint();
	const [result, setResult] = useState<IResult | null>(null);

	const form = useForm<IJurosForm>({
		defaultValues: {
			tipoPeriodo: "mes",
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
		const pluralPeriodo = values.tipoPeriodo === "mes" ? "mes(es)" : "ano(s)";
		setResult({
			taxaJuros: {
				descricao: "Taxa de juros",
				valor: numeroBr(taxaJurosCalculada * 100) + "%" + (values.tipoPeriodo === "ano" ? " a.a" : " a.m"),
			},
			rendimento: {
				descricao: `R$ ${numeroBr(values.valorInicial)} a uma taxa de juros de ${numeroBr(taxaJurosCalculada * 100)}% durante ${values.periodo} ${pluralPeriodo}`,
				valor: "R$ " + numeroBr(values.montanteFinal)
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
			setValue("taxaJuros", converterTaxaJuros(Number(taxaJuros), tipoPeriodoSelecionado));
		}
	}, [tipoPeriodoSelecionado])

	return <FormProvider {...form}>
		<Text size="xl">Cálculo de Juros</Text>
		<Divider sx={{ marginBottom: "1rem" }} />
		<Group>
			<RadioGroupComponent
				label="O que você quer calcular"
				name="modoCalculo"
				variant={isMobile ? "vertical" : "horizontal"}
			>
				<Radio value="montanteFinal">Montante final</Radio>
				<Radio value="taxaJuros">Taxa de juros</Radio>
			</RadioGroupComponent>
		</Group>
		<Space h="md" />
		<Divider />
		<Space h="md" />

		{modoCalculo === 'montanteFinal' && <MontanteFinalForm />}
		{modoCalculo === 'taxaJuros' && <TaxaJurosForm />}

		<CalculateButton onClick={modoCalculo === 'montanteFinal' ? handleCalculo : handleCalculoTaxaJuros} />
		<Space h="md" />

		{!!result && (
			<ResultSection result={result} />
		)}
	</FormProvider>
}

