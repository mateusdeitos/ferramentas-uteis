
export type PhpPropertyType = "array" | "int" | "float" | "string" | "bool" | "object";

export type PhpParsingOptions = {
	createGetters: boolean
	createSetters: boolean
	typeAs: "builtin" | "docBlock"
	createPropertiesAsNullable: boolean
	nonNullableProperties: PhpPropertyType[]
	useAddMethodForArray: boolean
	useFluentSetters: boolean
	rootClassName: string
}


