import { NumberInput, NumberInputProps } from '@mantine/core'
import { useFormContext, Controller, UseControllerProps } from 'react-hook-form';

type Props = NumberInputProps & {
	rules?: UseControllerProps["rules"]
}

export const ValorInputComponent: React.FC<Props> = ({ name = "numberInput", rules, ...props }) => {
	const { control } = useFormContext();

	return <Controller
		control={control}
		name={name}
		rules={rules}
		render={({ field: { ref, onChange, value }, fieldState: { error } }) => {
			return <NumberInput
				precision={2}
				value={value}
				{...props}
				decimalSeparator=","
				error={error?.message}
				ref={ref}
				onChange={(value) => onChange(value)}
			/>
		}}
	/>
}
