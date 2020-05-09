import Kia, { forPromise } from "../mod.ts";

// Just a function to async sleep
function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

let name: string = "test";

forPromise(
	async () => {
		await sleep(4000);
	},
	{ text: name }
);
