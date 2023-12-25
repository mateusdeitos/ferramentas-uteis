import { NumberInput, NumberInputProps, Sx } from "@mantine/core";
import {
	Controller,
	UseControllerProps,
	useFormContext,
} from "react-hook-form";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useInputSize } from "../../hooks/useInputSize";

type Props = NumberInputProps & {
	rules?: UseControllerProps["rules"];
};

export const ValorInputComponent: React.FC<Props> = ({
	name = "numberInput",
	rules,
	...props
}) => {
	const { control } = useFormContext();
	const { isMobile } = useBreakpoint();
	const size = useInputSize();

	const style: Sx = (theme) => ({
		width: isMobile ? "100%" : "25%",
	});

	return (
		<Controller
			control={control}
			name={name}
			rules={rules}
			render={({ field: { ref, onChange, value }, fieldState: { error } }) => {
				return (
					<NumberInput
						precision={2}
						value={value}
						{...props}
						style={style}
						size={size}
						autoComplete="off"
						name={name}
						decimalSeparator=","
						error={error?.message}
						ref={ref}
						onChange={(value) => {
							onChange(value);
							props?.onChange?.(value);
						}}
					/>
				);
			}}
		/>
	);
};
