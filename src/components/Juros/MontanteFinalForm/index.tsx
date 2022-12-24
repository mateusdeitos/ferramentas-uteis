import { Group } from "@mantine/core"
import { useFormContext } from "react-hook-form"
import { IJurosForm } from ".."
import { SelectComponent } from "../../Select"
import { ValorInputComponent } from "../../ValorInput"

export const MontanteFinalForm = () => {
	const { watch } = useFormContext<IJurosForm>();

	const tipoPeriodo = watch("tipoPeriodo");

	return <>

		<Group>
			<ValorInputComponent
				name="valorInicial"
				label="Initial value"
				hideControls
				rules={{
					required: "Initial value is required",
					min: {
						value: 0.01,
						message: "Initial value must be greater than 0",
					}
				}}
			/>
		</Group>
		<Group>
			<ValorInputComponent
				name="periodo"
				label={tipoPeriodo === 'yearly' ? "Years" : "Months"}
				rules={{
					required: "Period is required",
					min: {
						value: 1,
						message: "Period must be greater than 0",
					}
				}}
				precision={0}
			/>
			<SelectComponent
				name="tipoPeriodo"
				label="Period type"
				data={[
					{
						value: "monthly",
						label: "Month"
					},
					{
						value: "yearly",
						label: "Year"
					}
				]} />
		</Group>

		<Group>
			<ValorInputComponent
				name="taxaJuros"
				label="Interest rate (%)"
				step={0.25}
				rules={{
					required: "Interest rate is required",
					min: {
						value: 0.01,
						message: "Interest rate must be greater than 0",
					}
				}}
				precision={8}
			/>
		</Group>
	</>
}