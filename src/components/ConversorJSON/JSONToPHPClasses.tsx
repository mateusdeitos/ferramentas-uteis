import { Button, Divider, Group, JsonInput, MultiSelect, Radio, Space, Switch, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { PhpClass } from "../../services/conversao-json/php/PhpClass";
import { PhpParsingOptions } from "../../services/conversao-json/php/types";
import { JsonObject } from "../../services/json-parser";
import { DrawerResultConversion, useOpenDrawer } from "../DrawerResultConversion";

type TForm = {
	json: string
} & PhpParsingOptions


export const JSONToPHPClasses = () => {
	const [open, drawerProps] = useOpenDrawer();
	const form = useForm<TForm>({
		defaultValues: {
			json: JSON.stringify({
				"name": "John",
				"age": 30,
				"cars": [
					{ "name": "Ford", "models": ["Fiesta", "Focus", "Mustang"] },
					{ "name": "BMW", "models": ["320", "X3", "X5"] },
				],
				"address": {
					"street": "Rua dos Bobos",
					"number": 0,
					"city": "São Paulo",
					"state": "SP",
					"country": "Brasil"
				}
			}, null, 2),
			rootClassName: "RootObject",
			createGetters: true,
			createSetters: true,
			typeAs: "builtin",
			nonNullableProperties: [],
			createPropertiesAsNullable: false,
			useAddMethodForArray: false,
		},
	});

	const {
		json,
		typeAs,
		createGetters,
		createSetters,
		createPropertiesAsNullable,
		nonNullableProperties,
		useAddMethodForArray,
		useFluentSetters,
	} = form.watch();

	const onChangeJsonInput = (value: string) => {
		try {
			const json = JSON.parse(value);
			form.setValue("json", JSON.stringify(json, null, 2));
		} catch (error) {
			form.setValue("json", value);
		}
	}

	const handleOpen = () => {
		const parsed = parseJson(json, form.getValues());
		if (!parsed) {
			showNotification({
				title: "Erro",
				message: "Não foi possível converter o JSON, verifique se o json é válido",
			});

			return;
		}

		open(parsed.map(c => c.serialize()));
	}

	return <>
		<DrawerResultConversion {...drawerProps} />
		<JsonInput
			label="JSON"
			description="Insert a valid JSON		"
			minRows={12}
			maxRows={15}
			validationError="JSON inválido"
			autosize
			value={json}
			onChange={onChangeJsonInput}
		/>

		<Space h="md" />
		<Divider />
		<Space h="md" />

		<TextInput
			label="Root class name"
			description="The name of the root class"
			autoComplete='off'
			{...form.register("rootClassName")}
		/>


		<Radio.Group
			label="Type conversion"
			value={typeAs}
			onChange={(value) => form.setValue("typeAs", value as TForm["typeAs"])}
		>
			<Radio
				value="builtin"
				label="Builtin php types"
				description="Converts the types to builtin php types"
			/>
			<Radio
				value="docBlock"
				label="DocBlock"
				description="Converts the types to docblock"
			/>
		</Radio.Group>

		<Switch
			label="Create properties as Nullable"
			description="If checked, all properties will be nullable and initialized as null"
			size="xs"
			checked={createPropertiesAsNullable}
			onChange={e => form.setValue("createPropertiesAsNullable", !!e.currentTarget.checked)}
		/>

		{createPropertiesAsNullable && (
			<MultiSelect
				size="xs"
				label="Except for these types"
				description="Select the types that will not be initialized as nullable"
				searchable
				value={nonNullableProperties}
				onChange={(value) => form.setValue("nonNullableProperties", value as TForm["nonNullableProperties"])}
				data={["array", "bool", "float", "int", "string"] as TForm["nonNullableProperties"]}
			/>
		)}

		<Switch
			label="Create getters"
			description="If checked, a getter function will be created for each property"
			size="xs"
			checked={createGetters}
			onChange={e => form.setValue("createGetters", !!e.currentTarget.checked)}
		/>

		<Switch
			label="Create setters"
			description="If checked, a setter function will be created for each property"
			size="xs"
			checked={createSetters}
			onChange={e => form.setValue("createSetters", !!e.currentTarget.checked)}
		/>

		{createSetters && (
			<>
				<Switch
					label="Use add method for arrays"
					description="If checked, instead of a setter function, an add method will be created for each array property"
					size="xs"
					checked={useAddMethodForArray}
					onChange={e => form.setValue("useAddMethodForArray", !!e.currentTarget.checked)}
				/>
				<Switch
					label="Use fluent setters"
					description="If checked, the setters will return the object itself"
					size="xs"
					checked={useFluentSetters}
					onChange={e => form.setValue("useFluentSetters", !!e.currentTarget.checked)}
				/>
			</>
		)}


		<Space h="md" />
		<Divider />
		<Space h="md" />
		<Group>
			<Button
				disabled={!json}
				onClick={handleOpen}>
				Converter
			</Button>
			<Button
				variant="subtle"
				disabled={!json}
				onClick={() => form.setValue("json", "")}>
				Limpar
			</Button>
		</Group>
	</>
}

const parseJson = (json: string, options: TForm) => {
	try {
		const parsed = JSON.parse(json);
		const result = JsonObject.fromJson(parsed, {
			...options,
			considerNullValuesAsOptional: true,
			rootObjectName: options.rootClassName,
		});

		return PhpClass.fromJson(options.rootClassName, options, result);
	} catch (error) {

	}
}

