import { Button, Divider, Group, JsonInput, Space, Switch, TextInput } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { JsonObject } from "../../services/json-parser";
import { TypescriptInterfaceOrType, TypescriptParsingOptions } from "../../services/typescript-json-parser";
import { DrawerResultConversion, useOpenDrawer } from "../DrawerResultConversion";

type TForm = {
	json: string
} & TypescriptParsingOptions;


export const JSONToTypescript = () => {
	const [open, drawerProps] = useOpenDrawer();
	const [formValues, setFormValues] = useLocalStorage<TForm>({
		key: "json-to-typescript",
		defaultValue: {
			json: JSON.stringify({
				"name": "mantine",
				"version": "1.0.0",
				"description": "React UI library",
				"main": "index.js",
				"scripts": {
					"start": "next dev",
					"build": "next build",
				},
				"dependencies": [
					"@mantine/core",
					"@mantine/hooks",
					"@mantine/notifications",
				]
			}, null, 2),
			parseAsSingleInterface: false,
			createObjectsAsTypes: false,
			considerNullValuesAsOptional: true,
			rootObjectName: "RootObject",
		},
	});


	const onChangeJsonInput = (value: string) => {
		try {
			const json = JSON.parse(value);
			setFormValues({ ...formValues, json: JSON.stringify(json, null, 2) });
		} catch (error) {
			setFormValues({ ...formValues, json: value });
		}
	}

	const handleOpenResult = () => {
		const parsed = parseJson(formValues.json, formValues);
		if (!parsed) {
			showNotification({
				title: "Erro",
				message: "Could not parse JSON, check if it is valid",
			});

			return;
		}

		const values = Array.isArray(parsed) ? parsed.map(i => i.serialize()) : [parsed.serialize()];
		open(values);
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
			value={formValues.json}
			onChange={onChangeJsonInput}
		/>

		<Space h="md" />
		<Divider />
		<Space h="md" />

		<TextInput
			label="Root name"
			description="The name of the root interface/type"
			autoComplete='off'
			value={formValues.rootObjectName}
			onChange={({ target: { value: rootObjectName } }) => setFormValues({ ...formValues, rootObjectName })}
		/>

		<Switch
			label="Convert objects as types"
			size="xs"
			description="If checked, objects will be converted to types instead of interfaces"
			checked={formValues.createObjectsAsTypes}
			onChange={({ target: { checked: createObjectsAsTypes } }) => setFormValues({ ...formValues, createObjectsAsTypes })}
		/>

		<Switch
			label="Treat properties with null values as optional"
			size="xs"
			checked={formValues.considerNullValuesAsOptional}
			onChange={({ target: { checked: considerNullValuesAsOptional } }) => setFormValues({ ...formValues, considerNullValuesAsOptional })}
		/>

		<Switch
			label="Parse as a single Interface/Type"
			description="If true, the JSON will be parsed as a single interface/type, otherwise, each object will be parsed as a separate interface/type"
			size="xs"
			checked={formValues.parseAsSingleInterface}
			onChange={({ target: { checked: createEachObjectAsASeparateInstance } }) => setFormValues({ ...formValues, parseAsSingleInterface: createEachObjectAsASeparateInstance })}
		/>

		<Space h="md" />
		<Divider />
		<Space h="md" />
		<Group>
			<Button
				disabled={!formValues.json}
				onClick={handleOpenResult}>
				Convert
			</Button>
			<Button
				variant="subtle"
				disabled={!formValues.json}
				onClick={() => setFormValues(v => ({ ...v, json: "" }))}>
				Clear
			</Button>
		</Group>
	</>
}


const parseJson = (json: string, options: TForm) => {
	try {
		const parsed = JSON.parse(json);
		const result = JsonObject.fromJson(parsed, options);
		return options.parseAsSingleInterface ?
			TypescriptInterfaceOrType.fromJsonToSingleInstance(result, options?.rootObjectName ?? "IMain", options) :
			TypescriptInterfaceOrType.fromJsonToMultipleInstances(result, options.rootObjectName ?? "IMain", options)
	} catch (error) {

	}
}

