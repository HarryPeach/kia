import * as Colors from "https://deno.land/std/fmt/colors.ts";
export enum Color {
	Black,
	Red,
	Green,
	Yellow,
	Blue,
	Magenta,
	Cyan,
	White,
	Gray,
}

/**
 * Creates a colored terminal output, using the deno std lib
 * @param color The color to transform the text
 * @param text The text to be colorised
 */
export const colorise = (color: Color, text: string): string => {
	switch (color) {
		case Color.Black:
			return Colors.black(text);
		case Color.Red:
			return Colors.red(text);
		case Color.Green:
			return Colors.green(text);
		case Color.Yellow:
			return Colors.yellow(text);
		case Color.Blue:
			return Colors.blue(text);
		case Color.Magenta:
			return Colors.magenta(text);
		case Color.Cyan:
			return Colors.cyan(text);
		case Color.White:
			return Colors.white(text);
		case Color.Gray:
			return Colors.gray(text);
	}
};

/**
 * Overwrites text on the current line
 * @param encoder A TextEncoder object
 * @param text The text to be written
 */
export const overwriteLine = async (encoder: TextEncoder, text: string) => {
	await Deno.stdout.write(encoder.encode(`\r${text}`));
};
