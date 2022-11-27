import { Divider, Group, Radio, Space, Text } from '@mantine/core';
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from 'react-hook-form';
import { useBreakpoint } from "../../hooks/useBreakpoint";
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
			const convertido = converterTaxaJuros(Number(taxaJuros), tipoPeriodoSelecionado == 'mes' ? 'ano' : 'mes');
			setValue("taxaJuros", convertido[tipoPeriodoSelecionado]);
		}
	}, [tipoPeriodoSelecionado])

	return <FormProvider {...form}>
		<Text size="xl">Cálculo de Juros</Text>
		<Divider sx={{ marginBottom: "1rem" }} />
		<Group>
			<Radio.Group
				label="O que você quer calcular"
				orientation={isMobile ? "vertical" : "horizontal"}
				size="lg"
				value={form.watch("modoCalculo")}
				onChange={(value) => form.setValue("modoCalculo", value as IJurosForm["modoCalculo"])}
			>
				<Radio value="taxaJuros" label="Taxa de juros" />
				<Radio value="montanteFinal" label="Montante final" />
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

