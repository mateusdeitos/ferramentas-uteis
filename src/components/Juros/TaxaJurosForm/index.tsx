import { Group } from "@mantine/core"
import { useFormContext } from "react-hook-form";
import { IJurosForm } from ".."
import { SelectComponent } from "../../Select"
import { ValorInputComponent } from "../../ValorInput"

export const TaxaJurosForm = () => {
	const { watch } = useFormContext<IJurosForm>();
	const tipoPeriodo = watch("tipoPeriodo");
	return <>
		<Group>
			<ValorInputComponent
				name="valorInicial"
				label="Valor inicial"
				hideControls
				rules={{
					required: "Valor inicial é obrigatório",
					min: {
						value: 0.01,
						message: "Valor inicial deve ser maior que 0",
					}
				}}
			/>
		</Group>
		<Group>
			<ValorInputComponent
				name="periodo"
				label={tipoPeriodo === 'ano' ? "Período (anos)" : "Período (meses)"}
				rules={{
					required: "Período é obrigatório",
					min: {
						value: 1,
						message: "Período deve ser maior que 0",
					}
				}}
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
				rules={{
					required: "Montante final é obrigatório",
					min: {
						value: 0.01,
						message: "Montante final deve ser maior que 0",
					}
				}}
			/>
		</Group>

	</>
}