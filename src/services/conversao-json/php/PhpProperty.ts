import { upperCaseFirstLetter } from "../../../utils/stringUtils";
import { JsonPrimitive } from "../../json-parser";
import { PhpParsingOptions, PhpPropertyType } from "./types";


export class PhpProperty {
	constructor(
		protected name: string,
		protected type: PhpPropertyType,
		protected isOptional: boolean,
		protected options: PhpParsingOptions
	) { }

	public getName(): string {
		return this.name;
	}

	public getType(): PhpPropertyType {
		return this.type;
	}

	protected getSetterParamType(): string {
		return this.getType();
	}

	public getParsedType(): PhpPropertyType | string {
		if (this.getIsOptional()) {
			return `?${this.type}`;
		}

		return this.type;
	}

	public getIsOptional(): boolean {
		if (this.options.createPropertiesAsNullable) {
			return !this.options.nonNullableProperties.includes(this.type);
		}

		return this.isOptional;
	}

	public getInitializer(): string {
		if (this.options.createPropertiesAsNullable && this.getIsOptional()) {
			return "null";
		}

		switch (this.type) {
			case "array":
				return "[]";
			case "int":
			case "float":
				return "0";
			case "string":
				return '""';
			case "bool":
				return "false";
			case "object":
				return "null";
		}

	}

	public static parsePrimitiveType(type: JsonPrimitive): PhpPropertyType {
		switch (type.getType()) {
			case "number": {
				const value = type.getValue();
				if (typeof value !== "number") {
					return "string";
				}

				if (Number.isInteger(value)) {
					return "int";
				}

				return "float";
			}
			case "boolean":
				return "bool";
			case "string":
			default:
				return "string";
		}
	}


	protected serializeAsBuiltInType(): string {
		return `\tprotected ${this.getParsedType()} $${this.getName()} = ${this.getInitializer()};`;
	}

	protected getDocBlockType(): string {
		return [this.type, this.getIsOptional() ? "null" : ""].filter(Boolean).join("|");
	}

	protected serializeAsDocBlock(): string {
		return `\t/** @var ${this.getDocBlockType()} */\r\tprotected $${this.getName()} = ${this.getInitializer()};`;
	}

	protected getSetterReturnAndBody(): { body: string; returnType: string; } {
		if (this.options.useFluentSetters) {
			return {
				body: `\r\t\t$this->${this.getName()} = $${this.getName()};\r\t\treturn $this;\r\t`,
				returnType: "self",
			};
		}

		return {
			body: `\r\t\t$this->${this.getName()} = $${this.getName()};\r\t`,
			returnType: "void",
		};
	}

	public serializeGetter(): string {
		if (this.options.typeAs === "builtin") {
			return `\tpublic function get${upperCaseFirstLetter(this.getName())}(): ${this.getParsedType()} {\r\t\treturn $this->${this.getName()};\r\t}`;
		}

		const docBlockTypeDeclaration = `\t/** @return ${this.getDocBlockType()} */\r`;

		return `${docBlockTypeDeclaration}\tpublic function get${upperCaseFirstLetter(this.getName())}() {\r\t\treturn $this->${this.getName()};\r\t}`;
	}

	public serializeSetter(): string {
		return `\tpublic function set${upperCaseFirstLetter(this.getName())}(${this.getSetterParamType()} $${this.getName()}): ${this.getSetterReturnAndBody().returnType} {${this.getSetterReturnAndBody().body}}`;
	}

	public serialize(): string {
		if (this.options.typeAs === "docBlock") {
			return this.serializeAsDocBlock();
		}

		return this.serializeAsBuiltInType();
	}
}
