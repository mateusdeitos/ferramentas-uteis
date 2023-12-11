import { DrawerResult } from "../../DrawerResult";
import { TForm } from "../../../pages/flexbox-simulator";
import { defaultItemProps } from "../defaultItemProps";

export const useCopyAsCSSStylesObject = (formValues: TForm) => {
	const [openDrawer, drawerProps] = DrawerResult.useOpenDrawer();
	const copy = () => {
		const cssContainer = Object.entries(formValues)
			.map(([key, value]) => {
				if (key === "items") return;
				if (key === "amountOfItems") return;
				if (key === "items") return;
				if (key === "alignContent") return `alignContent: "${value}"`;
				if (key === "gap") return `gap: ${value}`;
				if (key === "wrap") return `flexWrap: "${value}"`;
				if (key === "justify") return `justifyContent: "${value}"`;
				if (key === "align") return `alignItems: "${value}"`;
				if (key === "direction") return `flexDirection: "${value}"`;

				return "";
			})
			.filter(Boolean)
			.map((v) => `\n\t${v},`)
			.join("");

		const cssItems = formValues.items
			.map((item, index) => {
				const cssItem = Object.entries(item)
					.map(([key, value]) => {
						switch (key) {
							case "flexBasis":
							case "flexGrow":
							case "flexShrink":
								if (value === defaultItemProps[key]) return "";
								return `${key}: ${value}`;

							default:
								return "";
						}
					})
					.filter(Boolean)
					.map((v) => `\n\t${v},`)
					.join("\n\n");

				if (!cssItem) return "";

				return `{${cssItem}\n}`;
			})
			.filter(Boolean);

		openDrawer([
			`{
	display: "flex",${cssContainer}
}`,
			...cssItems,
		]);
	};

	return [copy, drawerProps] as const;
};
