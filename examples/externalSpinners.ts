import Kia from "../mod.ts";
// Import some spinners from cli-spinners by ameerthehacker
import { SPINNERS } from "https://raw.githubusercontent.com/ameerthehacker/cli-spinners/master/spinners.ts";

// Just a function to async sleep
function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Use the spinner "flip"
const kia = new Kia({ text: "A spinner", spinner: SPINNERS.flip });
await kia.start();
await sleep(2000);

// Switch the spinner to "dots8"
await kia.set({ text: "Another spinner!", spinner: SPINNERS.dots8 });
await sleep(2000);
await kia.stop();
