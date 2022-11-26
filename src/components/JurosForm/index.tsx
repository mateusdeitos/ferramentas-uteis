import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from 'react-hook-form';
import { Container, Group, Button, ButtonProps, Divider, Space, Radio, useMantineColorScheme, useMantineTheme, Text, Accordion, Card } from '@mantine/core'
import { RadioGroupComponent } from "./RadioGroup";
import { styles } from "../PageWrapper";
import { useHotkeys } from "@mantine/hooks";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { converterTaxaJuros } from "../../services/juros";
import { MontanteFinalForm } from "./MontanteFinalForm";
import { TaxaJurosForm } from "./TaxaJurosForm";

export interface IJurosForm {
	periodo: number;
	valorInicial: number;
	taxaJuros: number;
	tipoPeriodo: "mes" | "ano";
	montanteFinal: number;
	modoCalculo: "taxaJuros" | "montanteFinal" | "amortizacaoEmprestimo";
	saldoDevedor: number;
	valorAmortizar: number;
	parcelasRestantes: number;
}

export interface IResult {
	[key: string]: {
		descricao: string;
		valor: number | string;
	}
}


export const JurosForm: React.FC = () => {
	const { colorScheme } = useMantineColorScheme();
	const { isMobile } = useBreakpoint();
	const [result, setResult] = useState<IResult | null>(null);
	const theme = useMantineTheme();

	const form = useForm<IJurosForm>({
		defaultValues: {
			tipoPeriodo: "mes",
			periodo: 12,
			modoCalculo: "montanteFinal",
		},
	});
	const { watch, setFocus, setValue } = form;

	const modoCalculo = watch("modoCalculo");
	const tipoPeriodoSelecionado = watch("tipoPeriodo");
	const taxaJuros = watch("taxaJuros");

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
		<Container sx={{ ...styles(colorScheme).bg.sx(theme), paddingBottom: "2rem" }}>
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

			{modoCalculo === 'montanteFinal' && <MontanteFinalForm updateResult={result => setResult(result)} />}
			{modoCalculo === 'taxaJuros' && <TaxaJurosForm updateResult={result => setResult(result)} />}

			<Space h="md" />

			{!!result && (
				<Card>
					<Card.Section sx={{ padding: "1rem 1rem 0 1rem" }}>
						<Text weight={500} size="xl">Resultado</Text>
						<Divider />
						<Space h="md" />
					</Card.Section>
					<Card.Section>
						<Group direction="column" sx={{ padding: "0 1rem 0.5rem 1rem" }}>
							{result && Object.entries(result).map(([key, { descricao, valor }]) => {
								return <Group key={key}>
									<Text size="md" weight={300}>{descricao}:</Text><Text size="sm">{valor}</Text>
								</Group>
							})}
						</Group>
					</Card.Section>
				</Card>
			)}

		</Container>
	</FormProvider>
}

export const JurosFormCalculateButton: React.FC<ButtonProps<'button'>> = ({ children, ...props }) => {
	const { isMobile } = useBreakpoint();
	const { onClick = () => { } } = props;

	useHotkeys([
		['mod+Enter', () => onClick({} as React.MouseEvent<HTMLButtonElement>)],
	]);
	return <>
		<Space h="md" />
		<Divider />
		<Space h="md" />
		<Group>
			<Button {...props}>
				Calcular{!isMobile ? " (Ctrl+Enter)" : ""}
				{children}
			</Button>
		</Group>
	</>
}