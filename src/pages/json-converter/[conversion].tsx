import { useRouter } from "next/router"
import { ReactElement } from "react";
import { appSections } from "..";
import { JSONToPHPClasses } from "../../components/ConversorJSON/JSONToPHPClasses";
import { JSONToTypescript } from "../../components/ConversorJSON/JSONToTypescript";
import { PhpPrintRToJson } from "../../components/ConversorJSON/PhpPrintRToJson";
import { PageWrapper } from "../../components/PageWrapper"

const mapComponents: Record<string, ReactElement> = {
	"php-print_r-to-json": <PhpPrintRToJson />,
	"json-to-typescript": <JSONToTypescript />,
	"json-to-php": <JSONToPHPClasses />
}

export default function ConversionHandler() {
	const router = useRouter()
	let conversion = Array.isArray(router.query?.conversion) ? router.query?.conversion[0] : router.query?.conversion ?? ""
	if (!mapComponents[conversion]) {
		conversion = router.asPath.split("/").filter(Boolean).reverse()[0];
	}

	const Component = mapComponents[conversion] ?? (() => <div>Not found</div>);
	const title = appSections
		.find(section => section.id === "programming")?.items
		.find(item => item.href === `/json-converter/${conversion}`)?.title ?? "Not found";

	return <PageWrapper title={title}>
		{Component}
	</PageWrapper>
}
