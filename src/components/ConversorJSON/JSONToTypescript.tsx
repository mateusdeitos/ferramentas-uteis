import { Button, CopyButton, Divider, Drawer, Group, JsonInput, Space, Switch, Tooltip } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { Prism } from "@mantine/prism";
import { useState } from "react";
import { JsonObject, JsonParserTypes } from "../../services/json-parser";
import { TypescriptInterfaceOrType } from "../../services/typescript-json-parser";

type TForm = {
	json: string
} & JsonParserTypes.ConversionOptions;


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

	return <>
		<DrawerResult {...drawerProps} />
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
			label="Parse as a single Interface"
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
				onClick={() => open(
					formValues.json,
					formValues
				)}>
				Converter
			</Button>
			<Button
				variant="subtle"
				disabled={!formValues.json}
				onClick={() => setFormValues(v => ({ ...v, json: "" }))}>
				Limpar
			</Button>
		</Group>
	</>
}

interface IDrawerResultProps {
	parsed?: TypescriptInterfaceOrType | TypescriptInterfaceOrType[];
	onClose: () => void;
}

const DrawerResult = ({ parsed, onClose }: IDrawerResultProps) => {
	return <Drawer
		padding="xl"
		position="right"
		size={900}
		title="Resultado"
		opened={!!parsed}
		onClose={onClose}
		styles={{
			drawer: {
				height: "100%",
				overflowY: "auto",
			}
		}}
	>
		{Array.isArray(parsed) ? (
			<>
				{parsed.map((item, index) => {
					return <Prism sx={{ marginTop: 12 }} key={index} language="typescript">{item?.serialize?.() ?? ""}</Prism>
				})}
				<Space h="md" />
				<CopyButton timeout={2000} value={parsed.map(item => item.serialize()).join("\n\n")}>{({ copied, copy }) => {
					return <Tooltip label={copied ? 'Copied' : 'Copy All'} withArrow position="top">
						<Button color={copied ? "teal" : "blue"} onClick={copy}>
							{copied ? "Copied" : "Copy all"}
						</Button>
					</Tooltip>
				}}</CopyButton>
			</>
		) : (
			<Prism language="typescript">{parsed?.serialize?.() ?? ""}</Prism>
		)}
	</Drawer>
}

const useOpenDrawer = () => {
	const [drawerProps, setDrawerProps] = useState<IDrawerResultProps>({
		parsed: undefined,
		onClose: () => setDrawerProps(v => ({ ...v, parsed: undefined })),
	});

	const open = (json: string, options: JsonParserTypes.ConversionOptions) => {
		const parsed = parseJson(json, options);
		if (!parsed) {
			showNotification({
				title: "Erro",
				message: "Não foi possível converter o JSON, verifique se o json é válido",
			});

			return;
		}

		setDrawerProps(v => ({ ...v, parsed }));

		return close;
	}
	return [open, drawerProps] as const
}

const parseJson = (json: string, options: JsonParserTypes.ConversionOptions) => {
	try {
		const parsed = JSON.parse(json);
		const result = JsonObject.fromJson(parsed, options);
		return options.parseAsSingleInterface ?
			TypescriptInterfaceOrType.fromJsonToSingleInstance(result, options?.rootObjectName ?? "IMain", options) :
			TypescriptInterfaceOrType.fromJsonToMultipleInstances(result, options.rootObjectName ?? "IMain", options)
	} catch (error) {

	}
}

