import { Colors, writeAllSync } from "./deps.ts";

// Terminal escape sequences
const ESC = "\x1b[";

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
export function colorise(color: Color) {
	return Colors[color];
}

/**
 * Overwrites text on the current line
 * @param encoder A TextEncoder object
 * @param text The text to be written
 */
export function writeLine(
	writer: Deno.WriterSync,
	encoder: TextEncoder,
	text: string,
	indent?: number,
) {
	writeAllSync(
		writer,
		encoder.encode(`\r${indent ? ESC + indent + "C" : ""}${text}`),
	);
}

/**
 * Clears the line and performs a carriage return
 */
export function clearLine(writer: Deno.WriterSync, encoder: TextEncoder) {
	writeAllSync(writer, encoder.encode(ESC + "2K\r"));
}

/**
 * Hides the terminal cursor
 */
export function hideCursor(writer: Deno.WriterSync, encoder: TextEncoder) {
	writeAllSync(writer, encoder.encode(ESC + "?25l"));
}

/**
 * Shows the terminal cursor
 */
export function showCursor(writer: Deno.WriterSync, encoder: TextEncoder) {
	writeAllSync(writer, encoder.encode(ESC + "?25h"));
}
