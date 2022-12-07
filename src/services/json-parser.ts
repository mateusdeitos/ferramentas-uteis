type TypescriptPrimitives = string | number | boolean | null | undefined;

export declare module JsonParserTypes {
	type ConversionOptions = {
		createObjectsAsTypes: boolean
		considerNullValuesAsOptional: boolean
		rootObjectName: string
		parseAsSingleInterface: boolean;
	}

}


export class JsonObject {
	private properties: JsonObjectProperty[] = [];

	public addProperty(property: JsonObjectProperty) {
		this.properties.push(property);
	}

	public getProperties(): JsonObjectProperty[] {
		return this.properties;
	}

	public static fromJson(json: Record<string, any>, options: JsonParserTypes.ConversionOptions): JsonObject {
		const result = new JsonObject();

		Object.entries(json).forEach(([key, value]) => {
			if (isObject(value)) {
				result.addProperty(
					new JsonObjectProperty(
						key,
						JsonObject.fromJson(value, options),
						isOptional(value, options),
					)
				);
			} else if (isArray(value)) {
				result.addProperty(
					new JsonObjectProperty(
						key,
						JsonArray.fromJson(value, options),
						isOptional(value, options),
					)
				)
			} else {
				result.addProperty(
					new JsonObjectProperty(
						key,
						JsonPrimitive.from(value),
						isOptional(value, options),
					)
				)
			}
		});

		return result;
	}

}

export class JsonArray {
	private items: JsonArrayItem[] = [];

	public addItem(item: JsonArrayItem) {
		this.items.push(item);
	}

	public getItems(): JsonArrayItem[] {
		return this.items;
	}

	public static fromJson(array: any[], options: JsonParserTypes.ConversionOptions): JsonArray {
		const result = new JsonArray();

		array.forEach((item) => {
			if (isObject(item)) {
				result.addItem(
					new JsonArrayItem(
						JsonObject.fromJson(item, options),
					)
				)
			} else if (isArray(item)) {
				result.addItem(
					new JsonArrayItem(
						JsonArray.fromJson(item, options)
					)
				)
			} else {
				result.addItem(
					new JsonArrayItem(
						JsonPrimitive.from(item)
					)
				);
			}
		});

		return result;
	}

}

export class JsonArrayItem {
	constructor(
		private value: JsonPrimitive | JsonObject | JsonArray,
	) { }

	public getValue(): JsonPrimitive | JsonObject | JsonArray {
		return this.value;
	}
}

export class JsonObjectProperty {
	constructor(
		private name: string,
		private type: JsonPrimitive | JsonObject | JsonArray,
		private isOptional: boolean,
	) { }

	public getName() {
		return this.name;
	}

	public getType() {
		return this.type;
	}

	public getIsOptional() {
		return this.isOptional;
	}
}

export class JsonPrimitive {
	constructor(
		private value: TypescriptPrimitives,
		private type: "number" | "string" | "boolean" | "null" | "undefined" | "any",
	) { }

	public getType() {
		return this.type;
	}

	public getValue() {
		return this.value;
	}

	public static from(value: any): JsonPrimitive {
		if (isNumber(value)) {
			return new JsonPrimitive(value, "number");
		} else if (isString(value)) {
			return new JsonPrimitive(value, "string");
		} else if (isBoolean(value)) {
			return new JsonPrimitive(value, "boolean");
		} else if (value === null) {
			return new JsonPrimitive(value, "null");
		} else if (value === undefined) {
			return new JsonPrimitive(value, "undefined");
		} else {
			return new JsonPrimitive(value, "any");
		}
	}
}


const isObject = (value: any): value is Record<string, any> => typeof value === "object" && value !== null && !isArray(value);
const isArray = (value: any): value is any[] => Array.isArray(value);
const isNumber = (value: any): value is number => typeof value === "number" || !Number.isNaN(Number(value));
const isString = (value: any): value is string => typeof value === "string" && !isNumber(value);
const isBoolean = (value: any): value is boolean => typeof value === "boolean";
const isOptional = (value: any, options: JsonParserTypes.ConversionOptions) => options.considerNullValuesAsOptional && value === null;
