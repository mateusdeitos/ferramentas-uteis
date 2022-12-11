import { upperCaseFirstLetter } from "../../../utils/stringUtils";
import { JsonArray, JsonObject, JsonObjectProperty } from "../../json-parser";
import { PhpConversionFactory } from "./Factory";
import { PhpObjectProperty } from "./PhpObjectProperty";
import { PhpProperty } from "./PhpProperty";
import { PhpParsingOptions } from "./types";


export class PhpClass {
	private properties: PhpProperty[] = [];

	constructor(
		private name: string,
		private options: PhpParsingOptions
	) {
		this.name = upperCaseFirstLetter(this.name);
	}

	public getName(): string {
		return this.name;
	}

	public addProperty(property: PhpProperty) {
		this.properties.push(property);
	}

	public getProperties(): PhpProperty[] {
		return this.properties;
	}

	public static fromJson(name: string, options: PhpParsingOptions, json: JsonObject): PhpClass[] {
		const main = new PhpClass(name, options);
		const result: PhpClass[] = [];

		const getClassesFromObject = (json: JsonObject, phpProperty: PhpProperty) => {
			return PhpClass.fromJson(
				phpProperty.getName(),
				options,
				json
			);
		};

		const parseRecord = (property: JsonObjectProperty, json: JsonObject, phpProperty: PhpProperty) => {
			result.push(...getClassesFromObject(json, phpProperty));
			main.addProperty(
				PhpObjectProperty.fromJson(
					property,
					options
				)
			);
		};

		const parseArray = (property: JsonObjectProperty, propertyType: JsonArray) => {
			const classes: Record<string, PhpClass> = {};
			propertyType.getItems().forEach((item) => {
				const value = item.getValue();
				if (value instanceof JsonObject) {
					const parsedObjects = getClassesFromObject(
						value,
						PhpConversionFactory.fromJson(property, options)
					);

					parsedObjects.forEach(_class => classes[_class.getName()] = _class);
				}
			});

			result.push(...Object.values(classes));

			main.addProperty(
				PhpConversionFactory.fromJson(property, options)
			);
		};

		const parseProperty = (property: JsonObjectProperty) => {
			main.addProperty(
				PhpConversionFactory.fromJson(property, options)
			);
		};

		json.getProperties().forEach((property) => {
			const phpProperty = PhpConversionFactory.fromJson(property, options);
			const propertyType = property.getType();
			if (propertyType instanceof JsonObject) {
				parseRecord(property, propertyType, phpProperty);
				return;
			}

			if (propertyType instanceof JsonArray) {
				parseArray(property, propertyType);
				return;
			}

			parseProperty(property);
		});

		result.unshift(main);
		return result;
	}

	public serialize(): string {
		const result = [
			`class ${this.name} {`,
			...this.properties.map((property) => property.serialize()),
		];

		if (this.options.createGetters) {
			result.push(...this.properties.map((property) => "\n\n" + property.serializeGetter()));
		}

		if (this.options.createSetters) {
			result.push(...this.properties.map((property) => "\n\n" + property.serializeSetter()));
		}

		result.push("}");

		return result.join("\r");
	}
}
