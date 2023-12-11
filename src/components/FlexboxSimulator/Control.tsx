import { MantineColor, SegmentedControl } from "@mantine/core";
import { Path, UseFormReturn, useController } from "react-hook-form";
import { FormWrapper } from "./FormWrapper";

export type ControlProps<TForm extends Record<string, any>> = {
	name: Path<TForm>;
	data: Parameters<typeof SegmentedControl>[0]["data"];
	form: UseFormReturn<TForm>;
	label: string;
	color?: MantineColor;
};

export function Control<TForm extends Record<string, any>>({
	name,
	label,
	data,
	form,
	color,
}: ControlProps<TForm>) {
	const controller = useController({ control: form.control, name });
	return (
		<FormWrapper label={label}>
			<SegmentedControl
				color={color}
				data={data}
				value={controller.field.value as string}
				onChange={(value) => controller.field.onChange(value)}
			/>
		</FormWrapper>
	);
}
