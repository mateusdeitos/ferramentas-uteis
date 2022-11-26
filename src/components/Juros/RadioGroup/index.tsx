import { RadioGroup, RadioGroupProps } from '@mantine/core'
import { useFormContext, Controller } from 'react-hook-form';

export const RadioGroupComponent: React.FC<RadioGroupProps> = ({ name = "radioGroup", children, ...props }) => {
	const { control } = useFormContext();

	return <Controller
		control={control}
		name={name}
		render={({ field: { ref, onChange, value } }) => {
			return <RadioGroup
				{...props}
				ref={ref}
				value={value}
				onChange={(value) => {
					props.onChange && props.onChange(value)
					onChange(value)
				}}
			>{children}</RadioGroup>
		}}
	/>
}