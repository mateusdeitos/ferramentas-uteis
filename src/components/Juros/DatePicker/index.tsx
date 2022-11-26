
import "dayjs/locale/pt-br";
import { DatePicker, DatePickerProps } from '@mantine/dates'
import { useFormContext, Controller } from 'react-hook-form';

export const DatePickerComponent: React.FC<DatePickerProps> = ({ name = "datePicker", ...props }) => {
	const { control } = useFormContext();

	return <Controller
		control={control}
		name={name}
		render={({ field: { ref, onChange, value } }) => {
			return <DatePicker
				inputFormat="DD/MM/YYYY"
				value={new Date(value)}
				{...props}
				ref={ref}
				locale="pt-br"
				onChange={(value) => onChange(value)}
			/>
		}}
	/>
}