import { JsonArray, JsonArrayItem, JsonObject, JsonObjectProperty, JsonParserTypes, JsonPrimitive } from "./json-parser";

export class TypescriptInterfaceOrType {
	private properties: TypescriptProperty[] = [];
	private interfaceType: "interface" | "type" = "interface";

	constructor(
		private name: string,
		options: JsonParserTypes.ConversionOptions,
	) {
		if (options?.createObjectsAsTypes === true) {
			this.interfaceType = "type";
		}
	}

	public getName(): string {
		return this.name;
	}

	public addProperty(property: TypescriptProperty) {
		this.properties.push(property);
	}

	public getProperties(): TypescriptProperty[] {
		return this.properties;
	}

	public static fromJsonToSingleInstance(json: JsonObject, name: string, options: JsonParserTypes.ConversionOptions): TypescriptInterfaceOrType {
		const result = new TypescriptInterfaceOrType(name, options);

		json.getProperties().forEach((property) => {
			result.addProperty(
				new TypescriptProperty(
					property.getName(),
					TypescriptType.from(property.getType(), options),
					property.getIsOptional(),
				)
			);
		});

		return result;
	}

	public static fromRecord(record: TypescriptRecord, name: string, options: JsonParserTypes.ConversionOptions): TypescriptInterfaceOrType {
		const result = new TypescriptInterfaceOrType(name, options);

		record.getProperties().forEach((property) => {
			result.addProperty(
				new TypescriptProperty(
					property.getName(),
					property.getType(),
					property.getIsOptional(),
				)
			);
		});

		return result;
	}

	public static fromJsonToMultipleInstances(json: JsonObject, name: string, options: JsonParserTypes.ConversionOptions): TypescriptInterfaceOrType[] {
		const main = new TypescriptInterfaceOrType(name, options);
		const result: TypescriptInterfaceOrType[] = [];

		const getInterfaceName = (property: JsonObjectProperty) => {
			return "I" + property.getName().charAt(0).toUpperCase() + property.getName().slice(1);
		}

		const getInterfacesFromRecord = (property: JsonObjectProperty, type: TypescriptRecord) => {
			const recordAsJson = type.getJson();
			if (!recordAsJson) {
				return [];
			}

			return TypescriptInterfaceOrType.fromJsonToMultipleInstances(recordAsJson, getInterfaceName(property), options);
		}

		const parseRecord = (property: JsonObjectProperty, type: TypescriptRecord) => {
			result.push(...getInterfacesFromRecord(property, type));
			main.addProperty(
				new TypescriptProperty(
					property.getName(),
					getInterfaceName(property),
					property.getIsOptional(),
				)
			)
		}

		const parseArrayOfRecord = (property: JsonObjectProperty, record: TypescriptRecord) => {
			result.push(...getInterfacesFromRecord(property, record));
			main.addProperty(
				new TypescriptProperty(
					property.getName(),
					`Array<${getInterfaceName(property)}>`,
					property.getIsOptional(),
				)
			)
		}

		const parseProperty = (property: JsonObjectProperty) => {
			main.addProperty(
				new TypescriptProperty(
					property.getName(),
					TypescriptType.from(property.getType(), options),
					property.getIsOptional(),
				)
			)
		}

		json.getProperties().forEach((property) => {
			const type = TypescriptType.from(property.getType(), options);
			if (type instanceof TypescriptRecord) {
				parseRecord(property, type);
				return
			}

			if (type instanceof TypescriptArray) {
				const itemType = type.getType();
				if (itemType instanceof TypescriptRecord) {
					parseArrayOfRecord(property, itemType);
					return;
				}

			}

			parseProperty(property);
		});

		result.unshift(main);
		return result;
	}

	public serialize(): string {
		return [
			`${this.interfaceType} ${this.name}${this.interfaceType === 'type' ? " =" : ""} {`,
			...this.properties.map((property) => property.serialize(1)),
			"}",
		].join("\n");
	}
}

export class TypescriptProperty {
	constructor(
		private name: string,
		private type: TypescriptType | string,
		private optional: boolean,
	) { }

	public getName(): string {
		return this.name;
	}

	public getType(): TypescriptType | string {
		return this.type;
	}

	public getIsOptional(): boolean {
		return this.optional;
	}

	private parseName(name: string): string {
		if (name.match(/^[a-zA-Z][a-zA-Z0-9_]*$/)) {
			return name;
		}

		return `"${name}"`;
	}

	public serialize(tabs: number): string {
		const serialized = typeof this.type === 'string' ? this.type : this.type.serialize(tabs);
		return [
			"\t".repeat(tabs),
			`${this.parseName(this.name)}${this.optional ? "?" : ""}: ${serialized}; `,
		].join("");
	}
}

export class TypescriptType {
	private static readonly types: Record<JsonPrimitive["type"], TypescriptType> = {
		"string": new TypescriptType("string"),
		"number": new TypescriptType("number"),
		"boolean": new TypescriptType("boolean"),
		"null": new TypescriptType("null"),
		"undefined": new TypescriptType("undefined"),
		"any": new TypescriptType("any"),
	};

	constructor(
		protected type: JsonPrimitive["type"] | TypescriptRecord | TypescriptType | "union" | "record" | "array" | string,
	) { }

	public isEqual(that: TypescriptType): boolean {
		if (this instanceof TypescriptUnionType && that instanceof TypescriptUnionType) {
			return this.getTypes().every((type) => that.getTypes().some((thatType) => type.isEqual(thatType)));
		}

		if (typeof this.type === 'string') {
			return this.type === that.type;
		}

		if (typeof that.type === 'string') {
			return false;
		}

		return this.type.isEqual(that.type);
	}

	public serialize(tabs: number): string {
		return typeof this.type === 'string' ? this.type : this.type.serialize(tabs);
	}

	public static from(
		json: JsonPrimitive | JsonObject | JsonArray | JsonArrayItem,
		options: JsonParserTypes.ConversionOptions,
	): TypescriptType {
		if (json instanceof JsonPrimitive) {
			return TypescriptType.types[json.getType()];
		} else if (json instanceof JsonObject) {
			return TypescriptRecord.from(json, options);
		} else if (json instanceof JsonArrayItem) {
			return TypescriptType.from(json.getValue(), options)
		} else if (json instanceof JsonArray) {
			return TypescriptArray.from(json, options);
		} else {
			throw new Error("Invalid type");
		}
	}
}

export class TypescriptArray extends TypescriptType {
	constructor() {
		super("array");
	}

	private setType(type: TypescriptType) {
		this.type = type;
		return this;
	}

	public getType() {
		return this.type;
	}

	public static from(json: JsonArray, options: JsonParserTypes.ConversionOptions): TypescriptArray {
		const UnionType = new TypescriptUnionType();
		json.getItems().forEach((item) => {
			UnionType.addType(TypescriptType.from(item, options));
		});

		if (UnionType.getTypes().length === 1) {
			return new TypescriptArray().setType(UnionType.getTypes()[0]);
		}

		return new TypescriptArray().setType(UnionType);
	}

	public serialize(tabs: number): string {
		if (this.type instanceof TypescriptRecord) {
			return `Array<${this.type.serialize(tabs)}>`;
		} else if (this.type instanceof TypescriptUnionType && this.type.getTypes().length > 1) {
			return `(${this.type.serialize(tabs)})[]`;
		} else if (typeof this.type === 'string') {
			return `${this.type}[]`;
		}

		return `${this.type.serialize(tabs)}[]`;
	}
}

export class TypescriptRecord extends TypescriptType {
	private properties: TypescriptProperty[] = [];
	private json: JsonObject | null = null;
	private constructor() {
		super("record");
	}

	public addProperty(property: TypescriptProperty) {
		this.properties.push(property);
	}

	public getProperties(): TypescriptProperty[] {
		return this.properties;
	}

	public static from(json: JsonObject, options: JsonParserTypes.ConversionOptions): TypescriptRecord {
		const result = new TypescriptRecord();

		json.getProperties().forEach((property) => {
			result.addProperty(
				new TypescriptProperty(
					property.getName(),
					TypescriptType.from(property.getType(), options),
					property.getIsOptional(),
				)
			);
		});

		result.json = json;

		return result;
	}

	public getJson(): JsonObject | null {
		return this.json;
	}

	public isEqual(that: TypescriptType): boolean {
		const compare = (thisProperties: TypescriptProperty[], thatProperties: TypescriptProperty[]) => {
			return thisProperties.every((thisProperty) => thatProperties
				.some((thatProperty) => {
					if (thisProperty.getName() !== thatProperty.getName()) {
						return false;
					}

					const thisType = thisProperty.getType();
					const thatType = thatProperty.getType();
					if (typeof thisType === 'string' && typeof thatType === 'string') {
						return thisType === thatType;
					}

					if (thisType instanceof TypescriptType && thatType instanceof TypescriptType) {
						return thisType.isEqual(thatType);
					}

					return false;
				}))
		}

		if (that instanceof TypescriptRecord) {
			if (!compare(this.properties, that.properties)) {
				return false;
			}

			return compare(that.properties, this.properties);
		}

		return false;
	}

	public serialize(tabs: number): string {
		return [
			"{",
			"\n",
			...this.properties.map((property) => property.serialize(tabs + 1) + "\n"),
			"\t".repeat(tabs),
			"}",
		].join("");
	}
}

export class TypescriptUnionType extends TypescriptType {
	private types: TypescriptType[] = [];

	constructor() {
		super("union");
	}

	public hasType(type: TypescriptType): boolean {
		return this.types.some((t) => t.isEqual(type));
	}

	public addType(type: TypescriptType) {
		if (this.hasType(type)) {
			return;
		}

		this.types.push(type);
	}

	public getTypes(): TypescriptType[] {
		return this.types;
	}

	public serialize(tabs: number): string {
		return this.types.map(type => type.serialize(tabs)).join(" | ");
	}
}
