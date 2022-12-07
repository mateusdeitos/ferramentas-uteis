import { useRouter } from "next/router"
import React from "react"
import { JSONToTypescript } from "../../components/ConversorJSON/JSONToTypescript"
import { PhpPrintRToJson } from "../../components/ConversorJSON/PhpPrintRToJson"
import { PageWrapper } from "../../components/PageWrapper"

const mapComponents: Record<string, { title: string, Component: React.FC }> = {
	"php-print_r-to-json": {
		title: "Converter print_r output para JSON",
		Component: PhpPrintRToJson
	},
	"json-to-typescript": {
		title: "Converter JSON para TypeScript",
		Component: JSONToTypescript
	}
}

export default function ConversionHandler() {
	const router = useRouter()
	let conversion = Array.isArray(router.query?.conversion) ? router.query?.conversion[0] : router.query?.conversion ?? ""
	if (!mapComponents[conversion]) {
		conversion = router.asPath.split("/").filter(Boolean).reverse()[0];
	}

	const { title, Component } = mapComponents[conversion] ?? {
		title: "Not found",
		Component: () => <div>Not found</div>
	}

	return <PageWrapper title={title}>
		<Component />
	</PageWrapper>


}

