import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { defaultItemProps } from "../defaultItemProps";
import { TForm } from "../../../pages/flexbox-simulator";

export const useFormFlexbox = () => {
	const form = useForm<TForm>({
		defaultValues: {
			justify: "flex-start",
			align: "flex-start",
			direction: "row",
			amountOfItems: 4,
			gap: 8,
			wrap: "wrap",
			alignContent: "stretch",
			items: [
				defaultItemProps,
				defaultItemProps,
				defaultItemProps,
				defaultItemProps,
			],
		},
	});

	const formValues = form.watch();

	useEffect(() => {
		const amount = formValues.amountOfItems;
		if (!amount) return;
		form.setValue(
			"items",
			(() => {
				const current = form.getValues("items");
				if (amount > current.length) {
					return [
						...current,
						...Array.from(
							{ length: amount - current.length },
							() => defaultItemProps
						),
					];
				}

				return current.slice(0, amount);
			})()
		);
	}, [formValues.amountOfItems]);

	return {
		form,
		formValues,
	};
};
