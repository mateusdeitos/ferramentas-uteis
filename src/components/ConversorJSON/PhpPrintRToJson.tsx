import { Drawer, Switch, Textarea } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { Prism } from "@mantine/prism"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { CalculateButton } from "../CalculateButton"

type TForm = {
	printR: string
} & ConversionOptions;


type ConversionOptions = {
	convertNumbers?: boolean
}

export const PhpPrintRToJson = () => {
	const form = useForm<TForm>({
		defaultValues: {
			convertNumbers: true, printR: `Array
	(
		[id] => 1
		[username] => admin
		[configuration] => stdClass Object
			(
				[allow] => 1
			)
	
		[roles] => Array
			(
				[0] => Array
					(
						[id] => 1
						[name] => admin
					)
	
				[1] => Array
					(
						[id] => 2
						[name] => user
					)
	
				[2] => Array
					(
						[id] => 3
						[name] => guest
					)
	
			)
	
		[permission] => Array
			(
				[0] => Array
					(
						[id] => 1
						[name] => read
					)
	
				[1] => Array
					(
						[id] => 2
						[name] => write
					)
	
				[2] => Array
					(
						[id] => 3
						[name] => delete
					)
	
			)
	
		[active] => 1
	)` }
	})
	const [drawerProps, openDrawer] = useState<Omit<IDrawerResultProps, "onClose">>({
		jsonString: "",
	})

	const printR = form.watch("printR")

	const handleConverter = ({ printR, ...options }: TForm) => {
		const json = convertPhpPrintROutputToJSON(form.getValues("printR"), options)

		if (!json) {
			showNotification({
				message: "Couldn't convert the input",
				color: "red",

			});

			return;
		}

		openDrawer({
			jsonString: JSON.stringify(json, null, 4)
		});

	}

	return <>
		<DrawerResult {...drawerProps} onClose={() => openDrawer({ jsonString: "" })} />
		<Controller
			control={form.control}
			name="printR"
			render={({ field }) => <Textarea
				{...field}
				label="Print_r"
				description="Insert the output of a valid 'print_r'"
				minRows={10}
				maxRows={15}
				autosize
			/>}
		/>

		<Switch
			label="Number conversion"
			size="xs"
			description="Parse numeric strings to int or float"
			checked={form.watch("convertNumbers")}
			{...form.register("convertNumbers")}
		/>

		<CalculateButton disabled={!printR} onClick={form.handleSubmit(handleConverter)}>Convert</CalculateButton>
	</>
}

interface IDrawerResultProps {
	jsonString: string
	onClose: () => void
}

const DrawerResult = ({ jsonString, onClose }: IDrawerResultProps) => {
	return <Drawer
		padding="xl"
		position="right"
		size={900}
		title="Result"
		opened={!!jsonString}
		onClose={onClose}
		styles={{
			drawer: {
				height: "100%",
				overflowY: "auto",
			}
		}}
	>
		<Prism language="javascript">{jsonString}</Prism>
	</Drawer>
}

function convertPhpPrintROutputToJSON(phpPrintROutput: string, options: ConversionOptions = {
	convertNumbers: false,
}) {

	const lines = phpPrintROutput.trim().split("\n")

	const isArray = (str: string | number, nextLine: string) => {
		return typeof str === 'string' && str.trim().startsWith("Array") && nextLine.trim().startsWith("(");
	}

	const isObject = (str: string | number, nextLine: string) => {
		return typeof str === 'string' && str.trim().startsWith("stdClass") && nextLine.trim().startsWith("(");
	}

	const isKeyValue = (str: string): str is `${string}=>${string}` => {
		const [key, value] = str.split("=>");
		return !!key?.trim() && !!value?.trim();
	}

	const getKeyValue = (str: `${string}=>${string}`) => {
		const [key, value] = str.split("=>");
		return [
			parseKey(key),
			parseValue(value)
		];
	}

	const parseKey = (key: string): string => {
		return key.trim().replace("[", "").replace("]", "")
	}

	const parseValue = (value: string): any => {
		if (options.convertNumbers === true) {
			if (!Number.isNaN(Number(value))) {
				return Number(value)
			}
		}

		if (typeof value === 'string') {
			return value.trim();
		}

		return value
	}

	const parseArray = (lines: string[], startIndex = 0, asObject = false): [unknown[] | object, number] => {
		const result: Record<string, any> = {};
		let lastIndex = startIndex;
		for (let index = startIndex; index < lines.length; index++) {
			lastIndex = index;
			const line = lines[index];
			if (isKeyValue(line)) {
				const [key, value] = getKeyValue(line);
				if (isArray(value, lines[index + 1] ?? "")) {
					const [parsed, lastIndex] = parseArray(lines, index + 2);
					result[key] = parsed;

					index = lastIndex + 1;
					continue;
				} else if (isObject(value, lines[index + 1] ?? "")) {
					const [parsed, lastIndex] = parseArray(lines, index + 2, true);
					result[key] = parsed;

					index = lastIndex + 1;
					continue;
				} else {
					result[key] = value;
					continue;
				}
			} else if (line.trim() === ")") {
				break;
			} else {
				continue;
			}
		}

		const isAssociativeArray = asObject || Object.keys(result).some((key, index) => key !== index.toString());
		if (isAssociativeArray) {
			return [result, lastIndex];
		}

		return [Object.values(result), lastIndex];
	}

	let json: Record<string, any> | null = null;
	const [line] = lines;
	if (isArray(line, lines[1] ?? "")) {
		[json] = parseArray(lines, 2);
	} else if (isObject(line, lines[1] ?? "")) {
		[json] = parseArray(lines, 2, true);
	}

	if (!json) {
		return null;
	}

	return json;
}