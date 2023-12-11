import { Space, Switch, Textarea } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Controller, useForm } from "react-hook-form";
import { convertPhpPrintROutputToJSON } from "../../services/print-r-to-json";
import { CalculateButton } from "../CalculateButton";
import { DrawerResult, useOpenDrawer } from "../DrawerResult";

type TForm = {
	printR: string;
} & ConversionOptions;

export type ConversionOptions = {
	convertNumbers?: boolean;
};

export const PhpPrintRToJson = () => {
	const form = useForm<TForm>({
		defaultValues: {
			convertNumbers: true,
			printR: `Array
	(
		[id] => 1
		[username] => admin
		[configuration] => stdClass Object
			(
				[allow] => 1
			)
	
		[roles] => Array
			(
				[0] => Array
					(
						[id] => 1
						[name] => admin
					)
	
				[1] => Array
					(
						[id] => 2
						[name] => user
					)
	
				[2] => Array
					(
						[id] => 3
						[name] => guest
					)
	
			)
	
		[permission] => Array
			(
				[0] => Array
					(
						[id] => 1
						[name] => read
					)
	
				[1] => Array
					(
						[id] => 2
						[name] => write
					)
	
				[2] => Array
					(
						[id] => 3
						[name] => delete
					)
	
			)
	
		[active] => 1
	)`,
		},
	});
	const [openDrawer, drawerProps] = useOpenDrawer();

	const printR = form.watch("printR");

	const handleConverter = ({ printR, ...options }: TForm) => {
		const json = convertPhpPrintROutputToJSON(
			form.getValues("printR"),
			options
		);

		if (!json) {
			showNotification({
				message: "Couldn't convert the input",
				color: "red",
			});

			return;
		}

		openDrawer([JSON.stringify(json, null, 2)]);
	};

	return (
		<>
			<DrawerResult {...drawerProps} />
			<Controller
				control={form.control}
				name="printR"
				render={({ field }) => (
					<Textarea
						{...field}
						label="Print_r"
						description="Insert the output of a valid 'print_r'"
						minRows={10}
						maxRows={15}
						autosize
					/>
				)}
			/>
			<Space h="md" />

			<Switch
				label="Number conversion"
				size="xs"
				description="Parse numeric strings to int or float"
				checked={form.watch("convertNumbers")}
				{...form.register("convertNumbers")}
			/>
			<Space h="md" />

			<CalculateButton
				disabled={!printR}
				onClick={form.handleSubmit(handleConverter)}
			>
				Convert
			</CalculateButton>
		</>
	);
};
