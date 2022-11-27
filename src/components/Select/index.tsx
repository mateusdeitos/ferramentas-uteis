import { Select, SelectProps } from '@mantine/core'
import { useFormContext, Controller } from 'react-hook-form';

export const SelectComponent: React.FC<SelectProps> = ({ name = "selectInput", children, ...props }) => {
	const { control } = useFormContext();

	return <Controller
		control={control}
		name={name}
		render={({ field: { ref, onChange, value } }) => {
			return <Select
				{...props}
				ref={ref}
				size="lg"
				value={value}
				onChange={(value) => onChange(value)}
			>{children}</Select>
		}}
	/>
}