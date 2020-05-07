import * as Colors from "https://deno.land/std/fmt/colors.ts";

/**
 * The colors to be used with the Kia spinner
 */
export type Color =
	| "black"
	| "red"
	| "green"
	| "yellow"
	| "blue"
	| "magenta"
	| "cyan"
	| "white"
	| "gray";

/**
 * Converts the Kia color type to the Deno color functions
 * @param color The color string
 */
export const colorise = (color: Color): Function => {
	let map = {
		black: Colors.black,
		red: Colors.red,
		green: Colors.green,
		yellow: Colors.yellow,
		blue: Colors.blue,
		magenta: Colors.magenta,
		cyan: Colors.cyan,
		white: Colors.white,
		gray: Colors.gray,
	};
	return map[color];
};

/**
 * Overwrites text on the current line
 * @param encoder A TextEncoder object
 * @param text The text to be written
 */
export const overwriteLine = async (encoder: TextEncoder, text: string) => {
	await Deno.stdout.write(encoder.encode(`\r${text}`));
};
