import { Kia } from "../kia.ts";

// Just a function to async sleep
function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Create a spinner instance
const kia = new Kia({text: "Loading sun", color: "cyan"});

// Start the spinner
await kia.start();
await sleep(2000);
// Change the spinner options
kia.setOptions({text: "Loading some more"});
await sleep(1000);
// Finish spinning successfully
await kia.succeed("Loaded sun");

kia.setOptions({text: "Loading clouds"});
await kia.start();
await sleep(2000);
// Finish spinning with a warning
await kia.warn("Some clouds loaded");

kia.setOptions({text: "Getting the temperature"})
await kia.start();
await sleep(2500);
// Finish spinning with an info message
await kia.info("Nice and warm!");

kia.setOptions({text: "Loading rain"})
await kia.start();
await sleep(2000);
// Finish spinning with a failure message
await kia.fail("Rain could not be loaded!");
// Since success, fail, warn, and info are all wrappers around stopWithFlair: you could also do this manually like so:
// import {bold, red} from "https://deno.land/std/fmt/colors.ts";
// await kia.stopWithFlair(bold(red("X")), "Rain could not be loaded");