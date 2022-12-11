import { JsonObject, JsonObjectProperty } from "../../json-parser";
import { upperCaseFirstLetter } from "../../../utils/stringUtils";
import { PhpProperty } from "./PhpProperty";
import { PhpParsingOptions } from "./types";
import { PhpConversionFactory } from "./Factory";

export class PhpObjectProperty extends PhpProperty {

	public getIsOptional(): boolean {
		return true;
	}

	protected getDocBlockType(): string {
		const suffix = this.getIsOptional() ? "|null" : "";
		return upperCaseFirstLetter(this.name) + suffix;
	}

	public getParsedType(): string {
		const prefix = this.getIsOptional() ? "?" : "";
		return prefix + upperCaseFirstLetter(this.name);
	}

	protected getSetterParamType(): string {
		return upperCaseFirstLetter(this.name);
	}

	public static fromJson(property: JsonObjectProperty, options: PhpParsingOptions): PhpProperty {
		const jsonType = property.getType();
		if (!(jsonType instanceof JsonObject)) {
			return PhpConversionFactory.fromJson(property, options);
		}

		return new PhpObjectProperty(property.getName(), "object", property.getIsOptional(), options);
	}

}
