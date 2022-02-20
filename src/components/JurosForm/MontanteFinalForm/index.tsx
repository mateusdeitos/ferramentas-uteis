import { Group } from "@mantine/core"
import { useFormContext } from "react-hook-form"
import { IJurosForm, IResult, JurosFormCalculateButton } from ".."
import { calcularMontanteFinal } from "../../../services/juros"
import { numeroBr } from "../../../utils/formatters/numberFormat"
import { SelectComponent } from "../Select"
import { ValorInputComponent } from "../ValorInput"

interface IProps {
	updateResult: (result: IResult) => void;
}

export const MontanteFinalForm: React.FC<IProps> = ({ updateResult }) => {
	const { getValues } = useFormContext<IJurosForm>();

	const handleCalculo = () => {
		const values = getValues();
		const { montanteFinalCalculado, valorParcelas, amortizacaoPorParcela } = calcularMontanteFinal(values);

		updateResult({
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
		});
	}
	return <>

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
			<ValorInputComponent
				name="taxaJuros"
				label="Taxa de Juros (%)"
				step={0.01}
				precision={8}
			/>
		</Group>

		<JurosFormCalculateButton onClick={handleCalculo} />
	</>
}