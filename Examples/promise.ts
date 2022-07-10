import { forPromise } from '../mod.ts';

// Just a function to async sleep
function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const text = 'test';

forPromise(
	async () => {
		await sleep(4000);
	},
	{ text },
);
