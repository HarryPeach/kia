export const clearLine = async (encoder: TextEncoder, text: string) => {
	await Deno.stdout.write(encoder.encode(`\r${text}`));
};
