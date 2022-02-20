import { Button, Group } from "@mantine/core"
import { useFormContext } from "react-hook-form"
import { IJurosForm, IResult, JurosFormCalculateButton } from ".."
import { useBreakpoint } from "../../../hooks/useBreakpoint"
import { calcularMontanteFinal, calcularTaxaJuros } from "../../../services/juros"
import { numeroBr } from "../../../utils/formatters/numberFormat"
import { SelectComponent } from "../Select"
import { ValorInputComponent } from "../ValorInput"

interface IProps {
	updateResult: (result: IResult) => void;
}

export const TaxaJurosForm: React.FC<IProps> = ({ updateResult }) => {
	const { getValues } = useFormContext<IJurosForm>();
	const { isMobile } = useBreakpoint();

	const handleCalculo = () => {
		const values = getValues();
		const { taxaJurosCalculada } = calcularTaxaJuros(values);
		const pluralPeriodo = values.tipoPeriodo === "mes" ? "mes(es)" : "ano(s)";
		updateResult({
			taxaJuros: {
				descricao: "Taxa de juros",
				valor: numeroBr(taxaJurosCalculada * 100) + "%" + (values.tipoPeriodo === "ano" ? " a.a" : " a.m"),
			},
			rendimento: {
				descricao: `R$ ${numeroBr(values.valorInicial)} a uma taxa de juros de ${numeroBr(taxaJurosCalculada * 100)}% durante ${values.periodo} ${pluralPeriodo}`,
				valor: "R$ " + numeroBr(values.montanteFinal)
			}
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
				name="montanteFinal"
				label="Montante final"
				hideControls
			/>
		</Group>

		<JurosFormCalculateButton onClick={handleCalculo} />
	</>
}