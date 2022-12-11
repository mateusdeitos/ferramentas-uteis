import { MantineSize } from "@mantine/core"
import { useBreakpoint } from "./useBreakpoint"

export const useInputSize = () => {
	const { sm, md } = useBreakpoint();

	const size: MantineSize = sm ? 'xs' : md ? 'sm' : 'md';

	return size;
}