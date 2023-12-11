import { Drawer, Space, CopyButton, Tooltip, Button } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { Language } from "prism-react-renderer";
import { useState } from "react";

export interface IDrawerResultProps {
	values: string[];
	onClose: () => void;
	language?: Language;
}

export const DrawerResult = ({
	values,
	onClose,
	language = "typescript",
}: IDrawerResultProps) => {
	return (
		<Drawer
			padding="xl"
			position="right"
			size={900}
			title="Result"
			opened={!!values?.length}
			onClose={onClose}
			styles={{
				drawer: {
					height: "100%",
					overflowY: "auto",
				},
			}}
		>
			<>
				{values.map((item, index) => {
					return (
						<Prism sx={{ marginTop: 12 }} key={index} language={language}>
							{item ?? ""}
						</Prism>
					);
				})}
				<Space h="md" />
				<CopyButton timeout={2000} value={values.join("\n\n")}>
					{({ copied, copy }) => {
						return (
							<Tooltip
								label={copied ? "Copied" : "Copy All"}
								withArrow
								position="top"
							>
								<Button color={copied ? "teal" : "blue"} onClick={copy}>
									{copied ? "Copied" : values.length > 1 ? "Copy all" : "Copy"}
								</Button>
							</Tooltip>
						);
					}}
				</CopyButton>
			</>
		</Drawer>
	);
};

export const useOpenDrawer = () => {
	const [drawerProps, setDrawerProps] = useState<IDrawerResultProps>({
		values: [],
		onClose: () => setDrawerProps((v) => ({ ...v, values: [] })),
	});

	const open = (values: string[]) => {
		setDrawerProps((v) => ({ ...v, values }));
	};

	return [open, drawerProps] as const;
};

DrawerResult.useOpenDrawer = useOpenDrawer;
