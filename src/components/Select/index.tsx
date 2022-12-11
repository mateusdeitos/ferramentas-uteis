import { Select, SelectProps, Sx } from '@mantine/core'
import { useFormContext, Controller } from 'react-hook-form';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useInputSize } from '../../hooks/useInputSize';

export const SelectComponent: React.FC<SelectProps> = ({ name = "selectInput", children, ...props }) => {
	const { control } = useFormContext();
	const { isMobile } = useBreakpoint();
	const size = useInputSize();


	const sx: Sx = theme => ({
		width: isMobile ? '100%' : '25%',
	})

	return <Controller
		control={control}
		name={name}
		render={({ field: { ref, onChange, value } }) => {
			return <Select
				{...props}
				ref={ref}
				sx={sx}
				size={size}
				value={value}
				onChange={(value) => onChange(value)}
			>{children}</Select>
		}}
	/>
}