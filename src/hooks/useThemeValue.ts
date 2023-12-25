import { useColorScheme } from "@mantine/hooks";

export const useThemeValue = () => {
	const colorScheme = useColorScheme();
	return <T>(lightValue: T, darkValue: T) => {
		return colorScheme === "dark" ? darkValue : lightValue;
	};
};
