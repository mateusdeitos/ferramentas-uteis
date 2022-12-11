import { JsonObjectProperty, JsonObject, JsonArray } from "../../json-parser";
import { PhpArrayProperty } from "./PhpArrayProperty";
import { PhpObjectProperty } from "./PhpObjectProperty";
import { PhpProperty } from "./PhpProperty";
import { PhpParsingOptions } from "./types";

export class PhpConversionFactory {

	public static fromJson(json: JsonObjectProperty, options: PhpParsingOptions): PhpProperty {
		const jsonType = json.getType();
		if (jsonType instanceof JsonObject) {
			return new PhpObjectProperty(
				json.getName(),
				"object",
				json.getIsOptional(),
				options
			)
		}

		if (jsonType instanceof JsonArray) {
			return new PhpArrayProperty(
				json.getName(),
				"array",
				json,
				json.getIsOptional(),
				options
			)
		}

		return new PhpProperty(
			json.getName(),
			PhpProperty.parsePrimitiveType(jsonType),
			json.getIsOptional(),
			options
		);
	}
}