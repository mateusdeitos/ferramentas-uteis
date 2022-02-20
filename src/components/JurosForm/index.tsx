import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from 'react-hook-form';
import { Container, Group, Button, Divider, Space, Radio, useMantineColorScheme, useMantineTheme, Text, Accordion, Card } from '@mantine/core'
import { ValorInputComponent } from "./ValorInput";
import { SelectComponent } from "./Select";
import { RadioGroupComponent } from "./RadioGroup";
import { styles } from "../PageWrapper";
import { useHotkeys } from "@mantine/hooks";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { numeroBr } from "../../utils/formatters/numberFormat";
export interface IEmprestimoForm {
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

interface IResult {
	[key: string]: {
		descricao: string;
		valor: number | string;
	}
}

const calcularValorParcelas = (montante: number, periodo: number) => montante / periodo;
const calcularAmortizacaoParcelas = (valorInicial: number, periodo: number) => valorInicial / periodo;
const converterTaxaJuros = (taxaJuros: number, periodoDesejado: "mes" | "ano") => {
	const expoente = periodoDesejado === "mes" ? 1 / 12 : 12;
	return (Math.pow(1 + taxaJuros / 100, expoente) - 1) * 100;
}

export const JurosForm: React.FC = () => {
	const { colorScheme } = useMantineColorScheme();
	const { isMobile } = useBreakpoint();
	const [result, setResult] = useState<IResult | null>(null);
	const theme = useMantineTheme();

	useHotkeys([
		['mod+Enter', () => handleCalculo()],
	]);

	const form = useForm<IEmprestimoForm>({
		defaultValues: {
			tipoPeriodo: "mes",
			periodo: 12,
			modoCalculo: "montanteFinal",
		}
	});
	const { getValues, watch, setFocus, setValue } = form;

	const modoCalculo = watch("modoCalculo");
	const tipoPeriodoSelecionado = watch("tipoPeriodo");
	const taxaJuros = watch("taxaJuros");

	const calcularMontanteFinal = ({
		periodo,
		valorInicial,
		taxaJuros,
	}: Pick<IEmprestimoForm, "periodo" | "valorInicial" | "taxaJuros">) => {
		const montanteFinalCalculado = valorInicial * Math.pow(1 + taxaJuros / 100, periodo);
		const valorParcelas = calcularValorParcelas(montanteFinalCalculado, periodo);
		const amortizacaoPorParcela = calcularAmortizacaoParcelas(valorInicial, periodo);
		setResult({
			montanteFinal: {
				descricao: "Montante final",
				valor: numeroBr(montanteFinalCalculado),
			},
			valorParcelas: {
				descricao: "Valor por parcela",
				valor: numeroBr(valorParcelas),
			},
			amortizacaoPorParcela: {
				descricao: "Amortização por parcela",
				valor: numeroBr(amortizacaoPorParcela),
			},
		})
	};

	const calcularTaxaJuros = ({
		tipoPeriodo,
		periodo,
		valorInicial,
		montanteFinal,
	}: Pick<IEmprestimoForm, "tipoPeriodo" | "periodo" | "valorInicial" | "montanteFinal">) => {
		const taxaJurosCalculada = (montanteFinal / valorInicial) ** (1 / periodo) - 1;
		setResult({
			montanteFinal: {
				descricao: "Montante final",
				valor: numeroBr(montanteFinal),
			},
			taxaJuros: {
				descricao: "Taxa de juros",
				valor: numeroBr(taxaJurosCalculada * 100) + "%" + (tipoPeriodo === "ano" ? " a.a" : " a.m"),
			},
		})
	};

	const calcularAmortizacaoEmprestimo = (props: IEmprestimoForm) => {
		const { saldoDevedor, parcelasRestantes, valorAmortizar, taxaJuros, periodo } = props;
		const montante = (saldoDevedor - valorAmortizar) * Math.pow(1 + taxaJuros / 100, periodo);
		const valorParcelas = calcularValorParcelas(montante, parcelasRestantes);
		const amortizacaoPorParcela = calcularAmortizacaoParcelas(saldoDevedor - valorAmortizar, parcelasRestantes);
		setResult({
			valorParcelas: {
				descricao: "Valor por parcela",
				valor: numeroBr(valorParcelas),
			},
			amortizacaoPorParcela: {
				descricao: "Amortização por parcela",
				valor: numeroBr(amortizacaoPorParcela),
			},
		})
	}

	const handleCalculo = () => {
		const values = getValues();
		switch (modoCalculo) {
			case "taxaJuros":
				calcularTaxaJuros({ ...values });
				break;
			case "montanteFinal":
				calcularMontanteFinal({ ...values });
				break;
			case "amortizacaoEmprestimo":
				calcularAmortizacaoEmprestimo({ ...values });
				break;

			default:
				break;
		}
	}

	useEffect(() => {
		if (!isMobile) {
			setFocus("valorInicial");
		}
	}, [modoCalculo]);

	useEffect(() => {
		const subscription = watch((data) => setResult(null));
		return () => subscription.unsubscribe();
	}, [watch]);

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
					<Radio value="amortizacaoEmprestimo">Amortização do empréstimo</Radio>
				</RadioGroupComponent>
			</Group>
			<Space h="md" />
			<Divider />
			<Space h="md" />
			<Group>
				<ValorInputComponent
					name="valorInicial"
					label="Valor inicial"
					hideControls
				/>
			</Group>
			<Group>
				<ValorInputComponent
					name="periodo"
					label="Período"
					precision={0}
				/>
				<SelectComponent
					name="tipoPeriodo"
					label="Tipo de período"
					data={[
						{
							value: "mes",
							label: "Mês"
						},
						{
							value: "ano",
							label: "Ano"
						}
					]} />
			</Group>
			<Group>
				{modoCalculo !== "taxaJuros" && (
					<ValorInputComponent
						name="taxaJuros"
						label="Taxa de Juros (%)"
						step={0.01}
						precision={8}
					/>
				)}
			</Group>
			{modoCalculo === "taxaJuros" && (
				<Group>
					<ValorInputComponent
						name="montanteFinal"
						label="Montante final"
						hideControls
					/>
				</Group>
			)}
			{modoCalculo === 'amortizacaoEmprestimo' && (
				<>
					<Group>
						<ValorInputComponent
							name="saldoDevedor"
							label="Saldo devedor do empréstimo"
							precision={2}
						/>
						<ValorInputComponent
							name="valorAmortizar"
							label="Valor a ser amortizado"
							precision={2}
						/>
						<ValorInputComponent
							name="parcelasRestantes"
							label="Parcelas restantes"
							precision={0}
						/>
					</Group>
				</>
			)}
			<Space h="md" />
			<Divider />
			<Space h="md" />
			<Group>
				<Button type="button" onClick={handleCalculo}>Calcular{!isMobile ? "(Ctrl+Enter)" : ""}</Button>
			</Group>
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