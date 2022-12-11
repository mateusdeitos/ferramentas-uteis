import { upperCaseFirstLetter } from "../../../utils/stringUtils";
import { JsonArray, JsonObject, JsonObjectProperty, JsonPrimitive } from "../../json-parser";
import { PhpProperty } from "./PhpProperty";
import { PhpParsingOptions, PhpPropertyType } from "./types";


export class PhpArrayProperty extends PhpProperty {
	private types: (JsonPrimitive | JsonObject)[] = [];
	constructor(
		protected name: string,
		protected type: PhpPropertyType,
		protected jsonObjectProperty: JsonObjectProperty,
		protected isOptional: boolean,
		protected options: PhpParsingOptions
	) {
		super(name, type, isOptional, options);

		const jsonType = jsonObjectProperty.getType();
		if (!(jsonType instanceof JsonArray)) {
			return;
		}

		jsonType.getItems().forEach(item => {
			const value = item.getValue();
			if (value instanceof JsonArray) {
				return;
			}

			this.addType(value);
		});
	}

	public addType(type: JsonPrimitive | JsonObject): this {
		this.types.push(type);

		return this;
	}

	protected getDocBlockType(): string {
		const typesArray = this.getTypes();

		const typeStr = typesArray.length === 1 ? typesArray[0] : `(${typesArray.join("|")})`;

		const result = [`${typeStr}[]`];
		if (this.getIsOptional()) {
			result.push("null");
		}

		return result.join("|");
	}

	private getTypes(): string[] {
		const types = new Set<string>();

		this.types.forEach((type) => {
			if (type instanceof JsonObject) {
				types.add(upperCaseFirstLetter(this.getName()));
				return;
			}

			if (type instanceof JsonPrimitive) {
				types.add(PhpProperty.parsePrimitiveType(type));
				return;
			}
		});

		return Array.from(types);
	}


	protected getSetterReturnAndBody(): { body: string; returnType: string; } {
		if (this.options.useAddMethodForArray) {
			const body = [`\r\t\t$this->${this.getName()}[] = $${this.getName()};\r\t`];
			if (this.options.useFluentSetters) {
				body.push("\treturn $this;\r\t");
			}

			return {
				body: body.join(""),
				returnType: this.options.useFluentSetters ? "self" : "void",
			};
		}

		return super.getSetterReturnAndBody();
	}

	public serializeSetter(): string {
		if (this.options.useAddMethodForArray) {
			const types = this.getTypes();
			const propertyName = this.getName();
			const { body, returnType } = this.getSetterReturnAndBody();
			if (types.length === 1 && this.options.typeAs === "builtin") {
				return `\tpublic function add${upperCaseFirstLetter(this.getName())}(${types[0]} $${propertyName}): ${returnType} {${body}}`;
			}

			const docBlockTypeDeclaration = `\t/** @var ${types.join(" | ")} $${propertyName} */\r`;

			// multiple types use docblock as union type
			return `${docBlockTypeDeclaration}\tpublic function add${upperCaseFirstLetter(propertyName)}($${propertyName}): ${returnType} {${body}}`;
		}

		return super.serializeSetter();
	}

	public serialize(): string {
		if (this.options.typeAs === "builtin") {
			return `\t/** @var ${this.getDocBlockType()} */\r` + this.serializeAsBuiltInType();
		}

		return this.serializeAsDocBlock();
	}
}
