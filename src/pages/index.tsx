import { Center } from "@mantine/core";
import { PageWrapper } from "../components/PageWrapper";

export default function Home() {
	return (
		<PageWrapper>
			<Center sx={{ margin: "20px 50px" }}>
				<h1><Center>Olá ✋! </Center><br />Acesse as ferramentas no menu lateral (👈) e espero que elas sejam úteis para você</h1>
			</Center>
		</PageWrapper>
	);
}