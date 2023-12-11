import { Flex, NumberInput } from "@mantine/core";
import { UseFormReturn, useController } from "react-hook-form";
import { TForm } from "../../pages/flexbox-simulator";
import { FormWrapper } from "./FormWrapper";
import { Control } from "./Control";

export const Form = (form: UseFormReturn<TForm>) => {
	const amountOfItems = useController({
		control: form.control,
		name: "amountOfItems",
	});
	const gap = useController({
		control: form.control,
		name: "gap",
	});

	const alignmentData = [
		{ label: "Center", value: "center" },
		{ label: "Start", value: "flex-start" },
		{ label: "End", value: "flex-end" },
	];

	return (
		<Flex mb={20} gap={8} wrap="wrap">
			<FormWrapper label="Amount of items">
				<NumberInput
					min={1}
					max={999}
					value={amountOfItems.field.value}
					onChange={(value) => amountOfItems.field.onChange(value)}
				/>
			</FormWrapper>
			<FormWrapper label="Gap between items (px)">
				<NumberInput
					min={1}
					max={999}
					value={gap.field.value}
					onChange={(value) => gap.field.onChange(value)}
				/>
			</FormWrapper>
			<Control
				form={form}
				color="blue"
				name="direction"
				label="Direction"
				data={[
					{ label: "Row", value: "row" },
					{ label: "Column", value: "column" },
				]}
			/>
			<Control
				form={form}
				color="cyan"
				name="wrap"
				label="Wrap"
				data={[
					{ label: "Wrap", value: "wrap" },
					{ label: "No wrap", value: "nowrap" },
				]}
			/>
			<Control
				form={form}
				color="grape"
				name="alignContent"
				label="Align Content"
				data={[...alignmentData, { label: "Stretch", value: "stretch" }]}
			/>
			<Control
				color="green"
				form={form}
				name="align"
				label="Align"
				data={alignmentData}
			/>

			<Control
				form={form}
				color="green"
				name="justify"
				label="Justify"
				data={[
					...alignmentData,
					{ label: "Space between", value: "space-between" },
					{ label: "Space around", value: "space-around" },
				]}
			/>
		</Flex>
	);
};
