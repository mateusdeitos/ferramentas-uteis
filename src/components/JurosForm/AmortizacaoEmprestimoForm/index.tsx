import { Button, Group } from "@mantine/core"
import { useFormContext } from "react-hook-form"
import { IJurosForm, IResult, JurosFormCalculateButton } from ".."
import { useBreakpoint } from "../../../hooks/useBreakpoint"
import { calcularAmortizacaoEmprestimo, calcularMontanteFinal, calcularTaxaJuros } from "../../../services/juros"
import { numeroBr } from "../../../utils/formatters/numberFormat"
import { ValorInputComponent } from "../ValorInput"

interface IProps {
	updateResult: (result: IResult) => void;
}

export const AmortizacaoEmprestimoForm: React.FC<IProps> = ({ updateResult }) => {
	const { getValues } = useFormContext<IJurosForm>();

	const handleCalculo = () => {
		const values = getValues();

		const { amortizacaoPorParcela, valorParcelas } = calcularAmortizacaoEmprestimo(values);
		updateResult({
			valorParcelas: {
				descricao: "Valor por parcela",
				valor: numeroBr(valorParcelas),
			},
			amortizacaoPorParcela: {
				descricao: "Amortização por parcela",
				valor: numeroBr(amortizacaoPorParcela),
			},
		});
	}
	return <>

		<Group>
			<ValorInputComponent
				name="valorInicial"
				label="Valor do empréstimo"
				hideControls
			/>
		</Group>
		<Group>
			<ValorInputComponent
				name="periodo"
				label="Quantidade de meses"
				precision={0}
			/>
			<ValorInputComponent
				name="taxaJuros"
				label="Taxa de Juros (%)"
				step={0.01}
				precision={8}
			/>
		</Group>

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

		<JurosFormCalculateButton onClick={handleCalculo} />
	</>
}