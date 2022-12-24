import { ConversionOptions } from "../components/ConversorJSON/PhpPrintRToJson";

export function convertPhpPrintROutputToJSON(phpPrintROutput: string, options: ConversionOptions = {
	convertNumbers: false,
}) {

	const lines = phpPrintROutput.trim().split("\n");

	const isArray = (str: string | number, nextLine: string) => {
		return typeof str === 'string' && str.trim().startsWith("Array") && nextLine.trim().startsWith("(");
	};

	const isObject = (str: string | number, nextLine: string) => {
		return typeof str === 'string' && str.trim().startsWith("stdClass") && nextLine.trim().startsWith("(");
	};

	const isKeyValue = (str: string): str is `${string}=>${string}` => {
		const [key, value] = str.split("=>");
		return !!key?.trim() && !!value?.trim();
	};

	const getKeyValue = (str: `${string}=>${string}`) => {
		const [key, value] = str.split("=>");
		return [
			parseKey(key),
			parseValue(value)
		];
	};

	const parseKey = (key: string): string => {
		return key.trim().replace("[", "").replace("]", "");
	};

	const parseValue = (value: string): any => {
		if (options.convertNumbers === true) {
			if (!Number.isNaN(Number(value))) {
				return Number(value);
			}
		}

		if (typeof value === 'string') {
			return value.trim();
		}

		return value;
	};

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
	};

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
