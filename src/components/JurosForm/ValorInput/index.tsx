import { NumberInput, NumberInputProps, useMantineColorScheme } from '@mantine/core'
import { useFormContext, Controller } from 'react-hook-form';

export const ValorInputComponent: React.FC<NumberInputProps> = ({ name = "numberInput", ...props }) => {
	const { control } = useFormContext();

	return <Controller
		control={control}
		name={name}
		render={({ field: { ref, onChange, value } }) => {
			return <NumberInput
				precision={2}
				value={value}
				{...props}
				decimalSeparator=","
				ref={ref}
				onChange={(value) => onChange(value)}
			/>
		}}
	/>
}
