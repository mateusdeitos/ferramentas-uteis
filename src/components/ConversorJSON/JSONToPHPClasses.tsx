import { Button, CopyButton, Divider, Drawer, Group, JsonInput, MultiSelect, Radio, Space, Switch, TextInput, Tooltip } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PhpClass } from "../../services/conversao-json/php/PhpClass";
import { PhpParsingOptions } from "../../services/conversao-json/php/types";
import { JsonObject } from "../../services/json-parser";
import { Prism } from "../Prism";

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

	return <>
		<DrawerResult {...drawerProps} />
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
				onClick={() => open(
					json,
					form.getValues()
				)}>
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

interface IDrawerResultProps {
	parsed?: PhpClass[];
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
		{!!parsed?.length && (
			<>
				{parsed.map((item, index) => {
					return <Prism sx={{ marginTop: 12 }} key={index} language={"php" as any}>{item?.serialize?.() ?? ""}</Prism>
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
		)}
	</Drawer>
}

const useOpenDrawer = () => {
	const [drawerProps, setDrawerProps] = useState<IDrawerResultProps>({
		parsed: undefined,
		onClose: () => setDrawerProps(v => ({ ...v, parsed: undefined })),
	});

	const open = (json: string, options: TForm) => {
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

