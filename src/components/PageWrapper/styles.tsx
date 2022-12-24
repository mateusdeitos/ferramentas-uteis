import { ColorScheme, CSSObject, MantineTheme } from '@mantine/core';

export const styles = (colorScheme: ColorScheme, isMobile: boolean) => ({
	bg: {
		sx: (theme: MantineTheme): CSSObject => ({
			backgroundColor: colorScheme === 'light' ? theme.colors.gray[0] : theme.colors.dark[7]
		})
	},
	shell: {
		sx: (theme: MantineTheme): CSSObject => ({
			...styles(colorScheme, isMobile).bg.sx(theme),
			maxWidth: 960,
			margin: "0 auto",
		}),
	},
	text: {
		sx: (theme: MantineTheme, isActive = false): CSSObject => {

			let color = colorScheme === 'light' ? theme.colors.gray[9] : theme.colors.gray[0];
			if (isActive) {
				color = theme.colors.blue[8];
			}
			return {
				color,
				fontSize: theme.fontSizes.sm,
				fontWeight: "bold",
				cursor: 'pointer',
				":hover": {
					color: theme.colors.blue[8]
				},
				transition: 'color 0.2s ease-in-out',
			};
		}
	},
	header: {
		sx: (theme: MantineTheme): CSSObject => {
			return {
				color: colorScheme === 'light' ? theme.colors.gray[9] : theme.colors.gray[0],
				fontSize: theme.headings.sizes.h1.fontSize,
				cursor: 'pointer',
				":hover": {
					color: theme.colors.blue[8]
				},
				transition: 'color 0.2s ease-in-out',
			};
		}
	}
});
