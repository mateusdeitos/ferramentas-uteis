import { DrawerResult } from "../../DrawerResult";
import { TForm } from "../../../pages/flexbox-simulator";
import { defaultItemProps } from "../defaultItemProps";

export const useCopyCSS = (formValues: TForm) => {
	const [openCopyCSS, drawerCopyCSSProps] = DrawerResult.useOpenDrawer();
	const copyCSS = () => {
		const cssContainer = Object.entries(formValues)
			.map(([key, value]) => {
				if (key === "items") return;
				if (key === "amountOfItems") return;
				if (key === "items") return;
				if (key === "alignContent") return `align-content: ${value};`;
				if (key === "gap") return `flex-gap: ${value}px;`;
				if (key === "wrap") return `flex-wrap: ${value};`;
				if (key === "justify") return `justify-content: ${value};`;
				if (key === "align") return `align-items: ${value};`;
				if (key === "direction") return `flex-direction: ${value};`;

				return `${key}: ${value};`;
			})
			.filter(Boolean)
			.map((v) => `\n\t${v}`)
			.join("");

		const cssItems = formValues.items
			.map((item, index) => {
				const cssItem = Object.entries(item)
					.map(([key, value]) => {
						if (key === "flexBasis" && value !== defaultItemProps[key]) {
							return `flex-basis: ${value}px;`;
						}

						if (key === "flexGrow" && value !== defaultItemProps[key]) {
							return `flex-grow: ${value};`;
						}

						if (key === "flexShrink" && value !== defaultItemProps[key]) {
							return `flex-shrink: ${value};`;
						}

						return "";
					})
					.filter(Boolean)
					.map((v) => `\n\t${v}`)
					.join("\n\n");

				if (!cssItem) return "";

				return `.item-${index} {${cssItem}\n}`;
			})
			.filter(Boolean);

		openCopyCSS([
			`.container {
	display: flex;${cssContainer}
}`,
			...cssItems,
		]);
	};

	return [copyCSS, drawerCopyCSSProps] as const;
};
