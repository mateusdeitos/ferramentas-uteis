import { Box, NumberInput, Popover } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { FormWrapper } from "./FormWrapper";
import { defaultItemProps } from "./defaultItemProps";

type TItemProps = TItem & {
	onChange: (item: TItem) => void;
};
export const Item = ({ onChange, ...item }: TItemProps) => {
	const changed = Object.entries(item).some(
		([key, value]) => value !== defaultItemProps[key as keyof TItem]
	);

	const { ref, hovered } = useHover<HTMLDivElement>();

	const bg = hovered ? "blue" : changed ? "red" : "gray";

	return (
		<Popover withArrow>
			<Popover.Target>
				<Box
					ref={ref}
					bg={`${bg}.5`}
					h={50}
					w={50}
					style={{
						transition: "all 200ms ease",
						border: "1px solid black",
						cursor: "pointer",
						flexBasis: item.flexBasis > 0 ? item.flexBasis : undefined,
						flexGrow: item.flexGrow > 0 ? item.flexGrow : undefined,
						flexShrink: item.flexShrink > 0 ? item.flexShrink : undefined,
					}}
				/>
			</Popover.Target>
			<Popover.Dropdown>
				<FormWrapper label="Flex basis">
					<NumberInput
						autoFocus
						min={0}
						value={item.flexBasis ?? 0}
						onChange={(flexBasis = 0) => onChange({ ...item, flexBasis })}
					/>
				</FormWrapper>
				<FormWrapper label="Flex grow">
					<NumberInput
						min={0}
						value={item.flexGrow ?? 0}
						onChange={(flexGrow = 0) => onChange({ ...item, flexGrow })}
					/>
				</FormWrapper>
				<FormWrapper label="Flex shrink">
					<NumberInput
						min={0}
						value={item.flexShrink ?? 0}
						onChange={(flexShrink = 0) => onChange({ ...item, flexShrink })}
					/>
				</FormWrapper>
			</Popover.Dropdown>
		</Popover>
	);
};

export type TItem = {
	flexBasis: number;
	flexGrow: number;
	flexShrink: number;
};
