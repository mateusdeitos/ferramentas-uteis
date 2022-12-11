import { useRouter } from "next/router"
import { mapComponentsConversaoJson } from "."
import { PageWrapper } from "../../components/PageWrapper"

export default function ConversionHandler() {
	const router = useRouter()
	let conversion = Array.isArray(router.query?.conversion) ? router.query?.conversion[0] : router.query?.conversion ?? ""
	if (!mapComponentsConversaoJson[conversion]) {
		conversion = router.asPath.split("/").filter(Boolean).reverse()[0];
	}

	const { title, Component } = mapComponentsConversaoJson[conversion] ?? {
		title: "Not found",
		Component: () => <div>Not found</div>
	}

	return <PageWrapper title={title}>
		<Component />
	</PageWrapper>


}

