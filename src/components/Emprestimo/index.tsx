import React, { useEffect } from "react";
import { useForm, FormProvider } from 'react-hook-form';
import { Container, Group, Button, Divider, Space, Radio, useMantineColorScheme, useMantineTheme, Text } from '@mantine/core'
import { ValorInputComponent } from "./ValorInput";
import { SelectComponent } from "./Select";
import { RadioGroupComponent } from "./RadioGroup";
import { styles } from "../PageWrapper";
import { useHotkeys } from "@mantine/hooks";
export interface IEmprestimoForm {
	parcelas: number;
	valorEmprestado: number;
	taxaJuros: number;
	tipoPeriodo: "mes" | "ano";
	montanteFinal: number;
	modoCalculo: "taxaJuros" | "montanteFinal" | "amortizacaoEmprestimo";
	valorParcelas: number;
	amortizacaoPorParcela: number;
	saldoDevedor: number;
	valorAmortizar: number;
	parcelasRestantes: number;
}

export const Emprestimo: React.FC = () => {
	const { colorScheme } = useMantineColorScheme();
	useHotkeys([
		['mod+Enter', () => handleCalculo()],
	]);

	const form = useForm<IEmprestimoForm>({
		defaultValues: {
			tipoPeriodo: "mes",
			parcelas: 12,
			modoCalculo: "montanteFinal",
		}
	});
	const { getValues, setValue, watch, setFocus, reset } = form;

	const modoCalculo = watch("modoCalculo");

	const calcularValorParcelas = (montante: number, parcelas: number) => setValue("valorParcelas", montante / parcelas);
	const calcularAmortizacaoParcelas = (valorEmprestado: number, parcelas: number) => setValue("amortizacaoPorParcela", valorEmprestado / parcelas);
	const getExpoenteCalculo = ({ tipoPeriodo, parcelas }: Pick<IEmprestimoForm, "tipoPeriodo" | "parcelas">) => {
		return (tipoPeriodo === "ano" ? parcelas / 12 : parcelas);
	};

	const calcularMontanteFinal = ({
		tipoPeriodo,
		parcelas,
		valorEmprestado,
		taxaJuros,
	}: Pick<IEmprestimoForm, "tipoPeriodo" | "parcelas" | "valorEmprestado" | "taxaJuros">) => {
		const expoente = getExpoenteCalculo({ tipoPeriodo, parcelas });

		const montanteFinalCalculado = valorEmprestado * Math.pow(1 + taxaJuros / 100, expoente);
		setValue("montanteFinal", montanteFinalCalculado);
		calcularValorParcelas(montanteFinalCalculado, parcelas);
		calcularAmortizacaoParcelas(valorEmprestado, parcelas);
	};

	const calcularTaxaJuros = ({
		tipoPeriodo,
		parcelas,
		valorEmprestado,
		montanteFinal,
	}: Pick<IEmprestimoForm, "tipoPeriodo" | "parcelas" | "valorEmprestado" | "montanteFinal">) => {
		const expoente = getExpoenteCalculo({ tipoPeriodo, parcelas });

		const taxaJurosCalculada = (montanteFinal / valorEmprestado) ** (1 / expoente) - 1;
		setValue('taxaJuros', taxaJurosCalculada * 100);
		calcularValorParcelas(montanteFinal, parcelas);
		calcularAmortizacaoParcelas(valorEmprestado, parcelas);
	};

	const calcularAmortizacaoEmprestimo = (props: IEmprestimoForm) => {
		const { saldoDevedor, parcelasRestantes, valorAmortizar, taxaJuros } = props;
		const expoente = getExpoenteCalculo({ ...props });
		const montante = (saldoDevedor - valorAmortizar) * Math.pow(1 + taxaJuros / 100, expoente);
		calcularValorParcelas(montante, parcelasRestantes);
		calcularAmortizacaoParcelas(saldoDevedor - valorAmortizar, parcelasRestantes);
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
		setFocus("parcelas");
	}, [modoCalculo])

	return <FormProvider {...form}>
		<Container {...styles(colorScheme).bg}>
			<Group>
				<RadioGroupComponent
					label="O que você quer calcular"
					name="modoCalculo"
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
					name="parcelas"
					label="Parcelas"
					precision={0}
				/>
				<ValorInputComponent
					name="valorParcelas"
					label="Valor das Parcelas"
					hideControls
					precision={2}
					disabled
				/>
				<ValorInputComponent
					name="amortizacaoPorParcela"
					label="Amortização por Parcela"
					hideControls
					precision={2}
					disabled
				/>
			</Group>
			<Group>
				<ValorInputComponent
					name="valorEmprestado"
					label="Valor emprestado"
					hideControls
				/>
			</Group>
			<Group>
				<ValorInputComponent
					name="taxaJuros"
					label="Taxa de Juros (%)"
					disabled={modoCalculo === "taxaJuros"}
					step={0.01}
					precision={8}
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
				<ValorInputComponent
					name="montanteFinal"
					disabled={modoCalculo !== 'taxaJuros'}
					label="Montante final"
					hideControls
				/>
			</Group>
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
				<Button type="button" onClick={handleCalculo}>Calcular (Ctrl+Enter)</Button>
			</Group>

		</Container>
	</FormProvider>
}