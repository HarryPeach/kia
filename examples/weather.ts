import { Kia } from "../kia.ts";

// Just a function to async sleep
function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Create a spinner instance
const kiaSpinner = new Kia({text: "Loading sun", color: "cyan"});

// Start the spinner
await kiaSpinner.start();
await sleep(2000);
// Change the spinner options
kiaSpinner.setOptions({text: "Loading some more"});
await sleep(1000);
// Finish spinning successfully
await kiaSpinner.succeed("Loaded sun");

kiaSpinner.setOptions({text: "Loading clouds"});
await kiaSpinner.start();
await sleep(2000);
// Finish spinning with a warning
await kiaSpinner.warn("Some clouds loaded");

kiaSpinner.setOptions({text: "Getting the temperature"})
await kiaSpinner.start();
await sleep(2500);
// Finish spinning with an info message
await kiaSpinner.info("Nice and warm!");

kiaSpinner.setOptions({text: "Loading rain"})
await kiaSpinner.start();
await sleep(2000);
// Finish spinning with a failure message
await kiaSpinner.fail("Rain could not be loaded!");
// Since success, fail, warn, and info are all wrappers around stopWithFlair: you could also do this manually like so:
// import {bold, red} from "https://deno.land/std/fmt/colors.ts";
// await kiaSpinner.stopWithFlair(bold(red("X")), "Rain could not be loaded");