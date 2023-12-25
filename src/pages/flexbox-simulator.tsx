"use-client";
import { Button, Flex, FlexProps } from "@mantine/core";
import { DrawerResult } from "../components/DrawerResult";
import { Form } from "../components/FlexboxSimulator/Form";
import { Item, TItem } from "../components/FlexboxSimulator/Item";
import { useCopyAsCSSStylesObject } from "../components/FlexboxSimulator/hooks/useCopyAsCSSStylesObject";
import { useCopyCSS } from "../components/FlexboxSimulator/hooks/useCopyCSS";
import { useFormFlexbox } from "../components/FlexboxSimulator/hooks/useFormFlexbox";
import { PageWrapper } from "../components/PageWrapper";

export type TForm = Pick<
	FlexProps,
	"align" | "justify" | "direction" | "wrap"
> & {
	amountOfItems: number;
	gap: number;
	alignContent: string;
	items: TItem[];
};

export default function FlexboxSimulator() {
	const { form, formValues } = useFormFlexbox();
	const [copyCSS, drawerCopyCSSProps] = useCopyCSS(formValues);
	const [copyStylesObject, drawerCopyStylesObjectProps] =
		useCopyAsCSSStylesObject(formValues);

	return (
		<PageWrapper title="Flexbox simulator">
			<DrawerResult {...drawerCopyCSSProps} language="css" />
			<DrawerResult {...drawerCopyStylesObjectProps} language="typescript" />
			<Form {...form} />
			<Flex w="100%" justify="start" mb={20} gap={16}>
				<Button variant="default" color="blue" onClick={() => form.reset()}>
					Reset
				</Button>
				<Button variant="filled" color="blue" onClick={() => copyCSS()}>
					Copy as CSS
				</Button>
				<Button
					variant="filled"
					color="blue"
					onClick={() => copyStylesObject()}
				>
					Copy as CSS styles object
				</Button>
			</Flex>
			<Flex
				bg="gray.8"
				justify={formValues.justify}
				align={formValues.align}
				direction={formValues.direction}
				wrap={formValues.wrap}
				gap={formValues.gap}
				mih={100}
				mah={400}
				miw={100}
				maw={1000}
				p={25}
				style={{
					transition: "all 200ms ease",
					overflow: "auto",
					alignContent: formValues.alignContent,
					resize: "both",
				}}
			>
				{formValues.items.map((item, index) => {
					return (
						<Item
							key={index}
							{...item}
							onChange={(editedItem) => {
								form.setValue(
									"items",
									form.getValues("items").map((item, i) => {
										if (i === index) {
											return editedItem;
										}

										return item;
									})
								);
							}}
						/>
					);
				})}
			</Flex>
		</PageWrapper>
	);
}
