import { useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks";


export const useBreakpoint = () => {
	const theme = useMantineTheme();
	const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
	const xs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
	const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
	const md = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
	const lg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
	const xl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);

	return {
		isMobile,
		xs,
		sm,
		md,
		lg,
		xl,
	};
}