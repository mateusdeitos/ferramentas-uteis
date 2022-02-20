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
import { calcularValorParcelas, calcularAmortizacaoParcelas, converterTaxaJuros, calcularMontanteFinal, calcularTaxaJuros, calcularAmortizacaoEmprestimo } from "../../services/juros";
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

interface IResult {
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

	useHotkeys([
		['mod+Enter', () => handleCalculo()],
	]);

	const form = useForm<IJurosForm>({
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

	const handleCalculo = () => {
		const values = getValues();
		let result = {} as IResult;
		switch (modoCalculo) {
			case "taxaJuros": {
				const { taxaJurosCalculada } = calcularTaxaJuros(values);
				result = {
					montanteFinal: {
						descricao: "Montante final",
						valor: numeroBr(values.montanteFinal),
					},
					taxaJuros: {
						descricao: "Taxa de juros",
						valor: numeroBr(taxaJurosCalculada * 100) + "%" + (values.tipoPeriodo === "ano" ? " a.a" : " a.m"),
					},
				}
				break;
			}
			case "montanteFinal": {
				const { montanteFinalCalculado, valorParcelas, amortizacaoPorParcela } = calcularMontanteFinal(values);

				result = {
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
				};
				break;
			}
			case "amortizacaoEmprestimo": {
				const { amortizacaoPorParcela, valorParcelas } = calcularAmortizacaoEmprestimo(values);
				result = {
					valorParcelas: {
						descricao: "Valor por parcela",
						valor: numeroBr(valorParcelas),
					},
					amortizacaoPorParcela: {
						descricao: "Amortização por parcela",
						valor: numeroBr(amortizacaoPorParcela),
					},
				}
				break;
			}

			default:
				break;
		}

		setResult(result);
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
				<Button type="button" onClick={handleCalculo}>Calcular{!isMobile ? " (Ctrl+Enter)" : ""}</Button>
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